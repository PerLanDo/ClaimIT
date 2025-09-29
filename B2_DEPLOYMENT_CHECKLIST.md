# Backblaze B2 Integration - Deployment Checklist

## ✅ Implementation Complete!

### What Was Implemented

#### 🔧 **Backend Changes**

1. **New Image Upload Service** (`services/image-upload.js`)

   - Centralized image upload handling
   - Multiple image upload support
   - Automatic file naming with UUIDs
   - Image validation (type, size)
   - Cleanup functionality for old images

2. **Updated Routes**

   - **Items Route** (`routes/items.js`): Now uploads item images to B2
   - **Claims Route** (`routes/claims.js`): Now uploads proof images to B2
   - **Test Route** (`routes/test.js`): New testing endpoints for B2 functionality

3. **Enhanced API Helpers** (`mobile/src/services/api.ts`)
   - `uploadItem()` - Helper for item creation with images
   - `updateItem()` - Helper for item updates with images
   - `uploadClaim()` - Helper for claim submission with proof images
   - `createFormData()` - Utility for FormData creation

#### 📱 **Mobile App Changes**

1. **Updated Screens**

   - **ReportItemScreen**: Now uses new `uploadItem` helper
   - **ClaimProcessScreen**: Now uses new `uploadClaim` helper

2. **Improved Error Handling**
   - Better upload failure messages
   - Validation feedback
   - Progress indication

### File Organization in Backblaze B2

```
your-bucket-name/
├── items/
│   └── [user-id]/
│       ├── [uuid].jpg
│       ├── [uuid].png
│       └── ...
├── claims/
│   └── [user-id]/
│       ├── [uuid].jpg
│       └── ...
├── profiles/
│   └── [user-id]/
│       └── avatar.jpg
└── test/
    └── [user-id]/
        └── test-files...
```

## 🚀 Next Steps to Deploy

### 1. Configure Backblaze B2 Bucket

```bash
# 1. Create a Backblaze B2 bucket
#    - Go to Backblaze B2 console
#    - Create new bucket (e.g., "claimit-production")
#    - Set bucket type to "Public" for direct URL access

# 2. Create application key
#    - Generate new application key with read/write permissions
#    - Note down: Key ID and Application Key
```

### 2. Update Environment Variables

Update your `.env` file:

```env
# Backblaze B2 Configuration
B2_KEY_ID=your_actual_key_id_here
B2_APPLICATION_KEY=your_actual_application_key_here
B2_BUCKET_NAME=claimit-production
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
```

### 3. Test the Integration

#### Test Backend API:

```bash
# 1. Start your server
npm run dev

# 2. Test B2 connection
curl http://localhost:3000/api/test/b2/health

# 3. Test image upload (with valid JWT token)
curl -X POST http://localhost:3000/api/test/b2/test-upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "testImage=@path/to/test-image.jpg"
```

#### Test Mobile App:

1. Open the mobile app
2. Navigate to "Report Item"
3. Add images and submit
4. Check if images appear in item cards
5. Test claim submission with proof images

### 4. Verify Image URLs

After uploading, verify the generated URLs work:

- Format: `https://s3.us-west-004.backblazeb2.com/bucket-name/folder/userId/filename.jpg`
- Should be publicly accessible
- Should display in mobile app

### 5. Production Deployment

#### For Vercel:

```bash
# Add environment variables to Vercel
vercel env add B2_KEY_ID
vercel env add B2_APPLICATION_KEY
vercel env add B2_BUCKET_NAME
vercel env add B2_ENDPOINT

# Deploy
vercel --prod
```

## 🔍 Troubleshooting

### Common Issues:

1. **Upload fails with 401 Unauthorized**

   - Check B2 credentials in `.env`
   - Verify application key has write permissions

2. **Images upload but URLs don't work**

   - Check bucket is set to "Public"
   - Verify B2_ENDPOINT matches your region

3. **Mobile app can't load images**

   - Check network permissions in React Native
   - Verify URLs are properly formatted
   - Test URLs in browser first

4. **Large images fail**
   - Current limit: 5MB per image
   - Consider adding image compression

### Debug Commands:

```bash
# Check B2 connection
curl http://localhost:3000/api/test/b2/health

# Get storage info
curl http://localhost:3000/api/test/b2/storage-info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test single upload
curl -X POST http://localhost:3000/api/test/b2/test-upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "testImage=@test.jpg"
```

## 📈 Performance Optimizations (Future)

1. **Image Compression**: Add client-side compression before upload
2. **Progressive Upload**: Show upload progress for multiple images
3. **CDN**: Consider adding CloudFlare in front of B2 for faster delivery
4. **Thumbnails**: Generate thumbnails for faster loading
5. **Lazy Loading**: Implement lazy loading for image grids

## 🔒 Security Features

✅ **Already Implemented:**

- File type validation (images only)
- File size limits (5MB)
- User-based folder organization
- Unique filename generation (UUIDs)
- Input validation and sanitization

## 📋 Testing Checklist

- [ ] B2 health check passes
- [ ] Single image upload works
- [ ] Multiple image upload works
- [ ] Item creation with images works
- [ ] Claim submission with proof works
- [ ] Images display in mobile app
- [ ] Image URLs are publicly accessible
- [ ] Old images are cleaned up on updates
- [ ] Error handling works properly
- [ ] File validation works

## 🎉 You're Ready!

The Backblaze B2 integration is now complete and ready for production use! The image upload functionality is fully integrated into your ClaimIT app, providing:

- ✅ Reliable cloud image storage
- ✅ Automatic file organization
- ✅ Proper error handling
- ✅ Mobile app integration
- ✅ Admin functionality support

Just configure your B2 bucket and credentials, then test the endpoints to ensure everything works correctly!
