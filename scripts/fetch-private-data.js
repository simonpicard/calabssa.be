const { Storage } = require("@google-cloud/storage");
const { ExternalAccountClient } = require("google-auth-library");
const fs = require("fs").promises;
const path = require("path");

// Load .env.local for local development
if (!process.env.VERCEL) {
  try {
    require("dotenv").config({ path: ".env.local" });
  } catch (e) {
    // dotenv not installed is okay
  }
}

// Configuration
const USE_SAMPLE_DATA = process.env.USE_SAMPLE_DATA === "true";
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME;
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_PROJECT_NUMBER = process.env.GCP_PROJECT_NUMBER;
const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
const GCP_WORKLOAD_IDENTITY_POOL_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID =
  process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;

// Paths
const DATA_DIR = path.join(__dirname, "..", "app", "data");
const ICS_DIR = path.join(__dirname, "..", "public", "ics");
const SAMPLE_ICS_DIR = path.join(__dirname, "..", "public", "ics-sample");

async function ensureDirectories() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(ICS_DIR, { recursive: true });
}

async function copySampleData() {
  console.log("📦 Using sample data for development...");

  // Copy sample JSON files
  await fs.copyFile(
    path.join(DATA_DIR, "teams.sample.json"),
    path.join(DATA_DIR, "teams.json")
  );
  await fs.copyFile(
    path.join(DATA_DIR, "dayDiv.sample.json"),
    path.join(DATA_DIR, "dayDiv.json")
  );
  console.log("✅ Copied sample JSON files");

  // Copy sample ICS files
  try {
    const sampleFiles = await fs.readdir(SAMPLE_ICS_DIR);
    for (const file of sampleFiles) {
      if (file.endsWith(".ics")) {
        await fs.copyFile(
          path.join(SAMPLE_ICS_DIR, file),
          path.join(ICS_DIR, file)
        );
      }
    }
    console.log("✅ Copied sample ICS files");
  } catch (error) {
    console.log("⚠️  No sample ICS files found, skipping...");
  }
}

async function getAuthenticatedStorage() {
  const isVercel = process.env.VERCEL === "1";

  if (isVercel) {
    console.log("🔐 Using Workload Identity Federation (Vercel environment)");

    // Check required environment variables
    if (
      !GCP_PROJECT_NUMBER ||
      !GCP_SERVICE_ACCOUNT_EMAIL ||
      !GCP_WORKLOAD_IDENTITY_POOL_ID ||
      !GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID
    ) {
      console.error("Missing environment variables:");
      console.error("  GCP_PROJECT_NUMBER:", GCP_PROJECT_NUMBER ? "✓" : "✗");
      console.error(
        "  GCP_SERVICE_ACCOUNT_EMAIL:",
        GCP_SERVICE_ACCOUNT_EMAIL ? "✓" : "✗"
      );
      console.error(
        "  GCP_WORKLOAD_IDENTITY_POOL_ID:",
        GCP_WORKLOAD_IDENTITY_POOL_ID ? "✓" : "✗"
      );
      console.error(
        "  GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID:",
        GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID ? "✓" : "✗"
      );
      throw new Error(
        "Missing required GCP environment variables for Workload Identity Federation"
      );
    }

    // In Vercel builds, the OIDC token is provided as VERCEL_OIDC_TOKEN
    const oidcToken = process.env.VERCEL_OIDC_TOKEN;
    if (!oidcToken) {
      throw new Error(
        "VERCEL_OIDC_TOKEN not found. Make sure OIDC is enabled in Vercel project settings."
      );
    }

    console.log("🎫 Using VERCEL_OIDC_TOKEN for authentication");
    console.log(
      "📊 Config: Pool=" +
        GCP_WORKLOAD_IDENTITY_POOL_ID +
        ", Provider=" +
        GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID
    );
    console.log("🔑 Service Account:", GCP_SERVICE_ACCOUNT_EMAIL);
    console.log("📍 Token length:", oidcToken.length, "chars");

    // Debug token format (JWT should have 3 parts separated by dots)
    const tokenParts = oidcToken.split(".");
    if (tokenParts.length === 3) {
      console.log("✅ Token appears to be a valid JWT");
      try {
        const payload = JSON.parse(
          Buffer.from(tokenParts[1], "base64").toString()
        );
        console.log("🔍 JWT issuer:", payload.iss);
        console.log("🔍 JWT subject:", payload.sub);
        console.log("🔍 JWT audience:", payload.aud);
      } catch (e) {
        console.log("⚠️  Could not decode JWT payload");
      }
    } else {
      console.log(
        "⚠️  Token does not appear to be a JWT (parts:",
        tokenParts.length,
        ")"
      );
    }

    // Write token to temporary file for credential_source
    const fs = require("fs");
    const os = require("os");
    const tokenFile = path.join(os.tmpdir(), `vercel-oidc-${Date.now()}.txt`);
    fs.writeFileSync(tokenFile, oidcToken);
    console.log("📝 Written token to:", tokenFile);

    try {
      // Create the external account configuration

      console.log("🔧 Creating ExternalAccountClient from JSON...");

      const authClient = ExternalAccountClient.fromJSON({
        type: "external_account",
        audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
        subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
        token_url: "https://sts.googleapis.com/v1/token",
        service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
        subject_token_supplier: {
          // Use the Vercel OIDC token as the subject token
          getSubjectToken: async () => oidcToken,
        },
        service_account_impersonation: {
          token_lifetime_seconds: 3600,
        },
      });

      console.log("🚀 Initializing Storage client...");
      const storage = new Storage({
        projectId: GCP_PROJECT_ID,
        authClient: authClient,
      });

      // Clean up token file after creating the client
      process.on("exit", () => {
        try {
          fs.unlinkSync(tokenFile);
        } catch (e) {
          // Ignore cleanup errors
        }
      });

      return storage;
    } catch (error) {
      // Clean up token file on error
      try {
        fs.unlinkSync(tokenFile);
      } catch (e) {
        // Ignore cleanup errors
      }
      console.error("❌ Auth error details:", error.message);
      throw error;
    }
  } else {
    console.log("🔑 Using Application Default Credentials (local environment)");

    // For local development, use gcloud auth or service account key
    return new Storage({
      projectId: GCP_PROJECT_ID,
    });
  }
}

async function fetchFromGCS() {
  // Check required environment variables
  if (!GCP_PROJECT_ID || !GCS_BUCKET_NAME) {
    throw new Error(
      "Missing required environment variables: GCP_PROJECT_ID and GCS_BUCKET_NAME"
    );
  }

  console.log("☁️  Fetching private data from Google Cloud Storage...");
  console.log(`📦 Bucket: ${GCS_BUCKET_NAME}`);

  const storage = await getAuthenticatedStorage();
  const bucket = storage.bucket(GCS_BUCKET_NAME);

  // Download JSON data files
  console.log("\n📥 Downloading data files...");

  const dataFiles = [
    { source: "data/teams.json", dest: path.join(DATA_DIR, "teams.json") },
    { source: "data/dayDiv.json", dest: path.join(DATA_DIR, "dayDiv.json") },
  ];

  for (const file of dataFiles) {
    console.log(`  • Downloading ${file.source}...`);
    await bucket.file(file.source).download({ destination: file.dest });
  }
  console.log("✅ Data files downloaded");

  // Download ICS files
  console.log("\n📥 Downloading calendar files...");

  const [files] = await bucket.getFiles({ prefix: "ics/" });
  console.log(`  • Found ${files.length} calendar files`);

  let downloaded = 0;
  for (const file of files) {
    const fileName = path.basename(file.name);
    if (fileName && fileName.endsWith(".ics")) {
      const destPath = path.join(ICS_DIR, fileName);
      await file.download({ destination: destPath });
      downloaded++;

      // Show progress every 50 files
      if (downloaded % 50 === 0) {
        console.log(`    ⏳ Downloaded ${downloaded}/${files.length} files...`);
      }
    }
  }

  console.log(`✅ Downloaded ${downloaded} calendar files`);
}

async function main() {
  console.log("🚀 CalABSSA Data Fetcher\n");

  try {
    await ensureDirectories();

    if (USE_SAMPLE_DATA) {
      await copySampleData();
    } else {
      await fetchFromGCS();
    }

    console.log("\n✨ Data fetching complete!");
  } catch (error) {
    console.error("\n❌ Failed to fetch data:", error.message);
    console.error(error);

    if (error.message.includes("Could not load the default credentials")) {
      console.log("\n💡 For local development, you need to authenticate:");
      console.log("   Run: gcloud auth application-default login");
    }

    if (error.message.includes("VERCEL_OIDC_TOKEN")) {
      console.log("\n💡 For Vercel builds:");
      console.log("   1. Enable OIDC in project settings");
      console.log("   2. Ensure all GCP environment variables are set");
      console.log("   3. Make sure the build runs in Vercel environment");
    }

    process.exit(1);
  }
}

// Run the script
main();
