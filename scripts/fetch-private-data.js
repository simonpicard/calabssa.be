const { Storage } = require('@google-cloud/storage');
const { GoogleAuth, ExternalAccountClient } = require('google-auth-library');
const fs = require('fs').promises;
const path = require('path');

// Try to load .env.local if running locally (not in Vercel)
if (!process.env.VERCEL && !process.env.CI) {
  try {
    require('dotenv').config({ path: '.env.local', silent: true });
  } catch (e) {
    // dotenv might not be installed, that's okay
    // User can set env vars manually or use sample data
  }
}

// Configuration from environment variables
const USE_SAMPLE_DATA = process.env.USE_SAMPLE_DATA === 'true';
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME;
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_PROJECT_NUMBER = process.env.GCP_PROJECT_NUMBER;
const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL || process.env.GCP_SERVICE_ACCOUNT; // Support both names
const GCP_WORKLOAD_IDENTITY_POOL_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;

// Paths
const DATA_DIR = path.join(__dirname, '..', 'app', 'data');
const ICS_DIR = path.join(__dirname, '..', 'public', 'ics');
const SAMPLE_ICS_DIR = path.join(__dirname, '..', 'public', 'ics-sample');

async function ensureDirectories() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(ICS_DIR, { recursive: true });
}

async function copySampleData() {
  console.log('📦 Using sample data for development...');
  
  // Copy sample JSON files
  const teamsSource = path.join(DATA_DIR, 'teams.sample.json');
  const teamsDest = path.join(DATA_DIR, 'teams.json');
  const dayDivSource = path.join(DATA_DIR, 'dayDiv.sample.json');
  const dayDivDest = path.join(DATA_DIR, 'dayDiv.json');
  
  await fs.copyFile(teamsSource, teamsDest);
  await fs.copyFile(dayDivSource, dayDivDest);
  console.log('✅ Copied sample JSON files');
  
  // Copy sample ICS files
  try {
    const sampleFiles = await fs.readdir(SAMPLE_ICS_DIR);
    for (const file of sampleFiles) {
      if (file.endsWith('.ics')) {
        await fs.copyFile(
          path.join(SAMPLE_ICS_DIR, file),
          path.join(ICS_DIR, file)
        );
      }
    }
    console.log('✅ Copied sample ICS files');
  } catch (error) {
    console.log('⚠️  No sample ICS files found, skipping...');
  }
}

async function fetchFromGCS() {
  // Check required environment variables
  if (!GCP_PROJECT_ID || !GCS_BUCKET_NAME) {
    console.error('❌ Missing required environment variables');
    console.log('\n💡 Please set the following environment variables:');
    console.log('   - GCP_PROJECT_ID: Your Google Cloud project ID');
    console.log('   - GCS_BUCKET_NAME: Your Google Cloud Storage bucket name');
    console.log('\n   For local development, add them to .env.local');
    console.log('   For Vercel deployment, add them in project settings');
    throw new Error('Missing required GCP configuration');
  }
  
  console.log('☁️  Fetching private data from Google Cloud Storage...');
  
  let storage;
  let tokenFile = null; // Track token file for cleanup
  
  // Check if we're in Vercel environment
  const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
  
  if (isVercel) {
    console.log('🔐 Using Workload Identity Federation (Vercel environment)');
    
    if (!GCP_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('Missing GCP_SERVICE_ACCOUNT_EMAIL environment variable');
    }
    
    try {
      // Try the new approach with @vercel/functions
      const { getVercelOidcToken } = require('@vercel/functions/oidc');
      
      console.log('📝 Using @vercel/functions for OIDC token...');
      
      // Initialize the External Account Client following Vercel's documentation
      const authClient = ExternalAccountClient.fromJSON({
        type: 'external_account',
        audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        token_url: 'https://sts.googleapis.com/v1/token',
        service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
        subject_token_supplier: {
          // Use the Vercel OIDC token as the subject token
          getSubjectToken: getVercelOidcToken,
        },
      });
      
      storage = new Storage({
        projectId: GCP_PROJECT_ID,
        authClient: authClient,
      });
      
    } catch (e) {
      // Fallback to environment variable approach
      console.log('⚠️  @vercel/functions not available, trying OIDC_TOKEN env var...');
      
      const oidcToken = process.env.OIDC_TOKEN;
      
      if (!oidcToken) {
        console.error('❌ OIDC_TOKEN not found.');
        console.log('\n💡 Please ensure:');
        console.log('   1. OIDC is enabled in Vercel project settings');
        console.log('   2. The build is running on Vercel');
        throw new Error('OIDC token not available');
      }
      
      // Write OIDC token to a temporary file
      const fsSync = require('fs');
      const os = require('os');
      tokenFile = path.join(os.tmpdir(), `oidc-token-${Date.now()}.txt`);
      fsSync.writeFileSync(tokenFile, oidcToken);
      
      // Create auth client with file-based approach
      const authClient = ExternalAccountClient.fromJSON({
        type: 'external_account',
        audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        token_url: 'https://sts.googleapis.com/v1/token',
        credential_source: {
          file: tokenFile,
          format: {
            type: 'text'
          }
        },
        service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT}:generateAccessToken`
      });
      
      storage = new Storage({
        projectId: GCP_PROJECT_ID,
        authClient: authClient,
      });
    }
  } else {
    console.log('🔑 Using Application Default Credentials (local environment)');
    
    // Local development - use ADC or service account key
    storage = new Storage({
      projectId: GCP_PROJECT_ID,
    });
  }
  
  const bucket = storage.bucket(GCS_BUCKET_NAME);
  
  try {
    // Download JSON data files
    console.log('\n📥 Downloading data files...');
    
    const dataFiles = [
      { source: 'data/teams.json', dest: path.join(DATA_DIR, 'teams.json') },
      { source: 'data/dayDiv.json', dest: path.join(DATA_DIR, 'dayDiv.json') },
    ];
    
    for (const file of dataFiles) {
      console.log(`  • Downloading ${file.source}...`);
      await bucket.file(file.source).download({ destination: file.dest });
    }
    console.log('✅ Data files downloaded');
    
    // Download ICS files
    console.log('\n📥 Downloading calendar files...');
    
    // List all files in the ics/ folder
    const [files] = await bucket.getFiles({ prefix: 'ics/' });
    console.log(`  • Found ${files.length} calendar files`);
    
    // Download each ICS file
    let downloaded = 0;
    for (const file of files) {
      const fileName = path.basename(file.name);
      if (fileName && fileName.endsWith('.ics')) {
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
    
  } catch (error) {
    console.error('❌ Error fetching from GCS:', error.message);
    
    if (error.message.includes('Could not load the default credentials')) {
      console.log('\n💡 For local development, you need to set up authentication:');
      console.log('   Option 1: Run: gcloud auth application-default login');
      console.log('   Option 2: Set GOOGLE_APPLICATION_CREDENTIALS to a service account key file');
      console.log('   Option 3: Use USE_SAMPLE_DATA=true to use sample data instead');
    }
    
    // Clean up token file if it exists
    if (tokenFile) {
      const fs = require('fs');
      if (fs.existsSync(tokenFile)) {
        console.log('🧹 Cleaning up temporary token file');
        fs.unlinkSync(tokenFile);
      }
    }
    
    throw error;
  }
  
  // Clean up token file after successful operation
  if (tokenFile) {
    const fs = require('fs');
    if (fs.existsSync(tokenFile)) {
      console.log('🧹 Cleaning up temporary token file');
      fs.unlinkSync(tokenFile);
    }
  }
}

async function main() {
  console.log('🚀 CalABSSA Data Fetcher\n');
  
  try {
    await ensureDirectories();
    
    if (USE_SAMPLE_DATA) {
      await copySampleData();
    } else {
      await fetchFromGCS();
    }
    
    console.log('\n✨ Data fetching complete!');
    
  } catch (error) {
    console.error('\n❌ Failed to fetch data:', error.message);
    process.exit(1);
  }
}

// Run the script
main();