# Image Upload Setup Guide

## Problem
Images uploaded through the admin panel don't appear after deployment because Vercel and similar platforms have read-only file systems that don't persist uploaded files.

## Solution Overview
The upload system now automatically detects the environment:
- **Development**: Uses local file storage (`public/uploads`)
- **Production**: Uses Vercel Blob cloud storage

## Setup Instructions

### Step 1: Install Vercel Blob Package

Try installing the Vercel Blob package:

```bash
# Option 1: Standard install
npm install @vercel/blob

# Option 2: If there are dependency conflicts
npm install @vercel/blob --force

# Option 3: If still having issues
npm install @vercel/blob --legacy-peer-deps
```

If installation fails due to dependency conflicts, the system will fall back to local storage in development and show an error in production.

### Step 2: Set Up Vercel Blob Storage

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Navigate to Storage**: Click on "Storage" in your project dashboard
3. **Create Blob Store**: 
   - Click "Create Database"
   - Select "Blob"
   - Name it something like "jennyleedev-images"
   - Click "Create"

4. **Get Your Token**:
   - Go to the Blob store you just created
   - Click on the "Settings" tab
   - Copy the `BLOB_READ_WRITE_TOKEN`

### Step 3: Set Environment Variables

#### For Production (Vercel):
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_...your_token_here
   ```

#### For Local Development:
Add to your `.env` file:
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_...your_token_here
```

### Step 4: Test the System

1. **Local Testing**:
   ```bash
   npm run dev
   ```
   - Go to `/admin` and upload an image
   - It should save to `public/uploads/` locally
   - Response will show `"storage": "local"`

2. **Production Testing**:
   - Deploy to Vercel
   - Upload an image through admin
   - Response should show `"storage": "vercel-blob"`
   - Images will be served from Vercel Blob URLs

## Alternative Solutions

### Option 1: Cloudinary (If Vercel Blob doesn't work)

1. Sign up at https://cloudinary.com
2. Get your credentials from dashboard
3. Add environment variables:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Option 2: AWS S3 + CloudFront

1. Create S3 bucket
2. Set up CloudFront distribution
3. Configure IAM permissions
4. Add AWS credentials to environment

## Troubleshooting

### Images Still Not Showing
1. Check browser network tab for failed image requests
2. Verify environment variables are set correctly
3. Check Vercel function logs for upload errors
4. Ensure CORS is configured for your domain

### Upload Errors
1. Check file size (max 4MB)
2. Verify file type is supported (JPEG, PNG, WebP, GIF)
3. Check admin authentication
4. Verify Blob token permissions

### Development Issues
1. Make sure `public/uploads/` directory is created
2. Check file permissions
3. Clear browser cache
4. Restart development server

## Migration Steps (For Existing Images)

If you have existing images in `public/uploads/` that need to be migrated to cloud storage:

1. Create a migration script to upload existing images to Vercel Blob
2. Update database records with new URLs
3. Remove old files from `public/uploads/`

## Current File Structure
```
public/
  uploads/          # Local development images (git ignored)
app/
  api/
    upload/
      route.ts      # Hybrid upload handler
```

## Environment Detection Logic
- **Local**: `NODE_ENV !== 'production'` → Local file storage
- **Production**: `NODE_ENV === 'production' && VERCEL` → Cloud storage
- **Fallback**: If cloud storage fails → Error message

The system is now ready to handle image uploads in both development and production environments! 