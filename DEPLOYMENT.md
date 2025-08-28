# Deployment Guide

This guide explains how to deploy CalABSSA with your own data.

## Architecture

The application uses a hybrid approach:
- Public code repository (this repo)
- Private data storage (your choice of cloud storage)
- Build-time data fetching (no runtime API calls)

## Data Storage Options

### Option 1: Google Cloud Storage (Recommended)

1. Create a GCS bucket for your private data
2. Upload your data files:
   - `data/teams.json`
   - `data/dayDiv.json`
   - `ics/*.ics` (all calendar files)

3. Set up authentication:
   - For production: Use Workload Identity Federation
   - For local development: Use `gcloud auth application-default login`

4. Configure environment variables (see below)

### Option 2: Other Cloud Storage

Modify `scripts/fetch-private-data.js` to support your preferred storage solution (AWS S3, Azure Blob, etc.)

## Environment Variables

Create a `.env.local` file for local development:

```bash
# Google Cloud Configuration
GCP_PROJECT_ID=your-project-id
GCS_BUCKET_NAME=your-bucket-name

# For Vercel Workload Identity (production only)
GCP_SERVICE_ACCOUNT=your-service-account@your-project.iam.gserviceaccount.com
GCP_WORKLOAD_IDENTITY_PROVIDER=projects/NUMBER/locations/global/workloadIdentityPools/POOL/providers/PROVIDER
VERCEL_OIDC_TOKEN_AUDIENCE=https://vercel.com/YOUR-TEAM/YOUR-PROJECT

# Use sample data instead (for development)
USE_SAMPLE_DATA=true
```

## Local Development

### Using Sample Data
```bash
USE_SAMPLE_DATA=true npm run dev
```

### Using Real Data from Cloud Storage
```bash
# Authenticate with your cloud provider
gcloud auth application-default login  # For GCP

# Fetch data and run
npm run fetch-data
npm run dev
```

## Production Deployment (Vercel)

1. **Enable OIDC Token** in Vercel project settings (required for Workload Identity)

2. **Add environment variables** in Vercel dashboard:
   - All variables from `.env.local`
   - Do NOT commit `.env.local` to git

3. **Deploy**:
   ```bash
   git push origin main
   ```

   The build process will automatically:
   - Run `prebuild` script
   - Fetch data from your cloud storage
   - Build the Next.js application
   - Deploy to Vercel

## Security Best Practices

1. **Never commit sensitive data** to the repository
2. **Use Workload Identity Federation** for production (not service account keys)
3. **Keep `.env.local` in `.gitignore`**
4. **Use read-only permissions** for your storage service account
5. **Rotate credentials regularly** if using service account keys locally

## Troubleshooting

### "Missing required environment variables"
- Ensure all GCP environment variables are set
- Check `.env.local` exists and is properly formatted

### "Permission denied" accessing storage
- Verify service account has appropriate permissions
- Check authentication is properly configured

### Build fails on Vercel
- Ensure OIDC is enabled in Vercel project settings
- Verify all environment variables are added in Vercel dashboard
- Check Vercel build logs for specific errors

## Contributing

When contributing to this project:
1. Use sample data for development
2. Never commit real team/calendar data
3. Test with `USE_SAMPLE_DATA=true` before submitting PRs