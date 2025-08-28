# Sample Data for CalABSSA

This directory contains sample data for local development and open source contributors.

## How to use sample data

1. Copy sample files to the expected locations:
   ```bash
   cp app/data/teams.sample.json app/data/teams.json
   cp app/data/dayDiv.sample.json app/data/dayDiv.json
   cp -r public/ics-sample/* public/ics/
   ```

2. Or set the environment variable:
   ```bash
   USE_SAMPLE_DATA=true npm run dev
   ```

## For production deployment

The real data is fetched from Google Cloud Storage during the build process.
See the main README for deployment instructions.