# Image Upload Test Script

## Testing the Backblaze B2 Integration

This document provides testing instructions for the newly implemented Backblaze B2 image upload functionality.

### Prerequisites

1. **Environment Setup**: Ensure your `.env` file has the correct Backblaze B2 credentials:

   ```
   B2_KEY_ID=your_actual_key_id
   B2_APPLICATION_KEY=your_actual_application_key
   B2_BUCKET_NAME=your_bucket_name
   B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
   ```

2. **Bucket Setup**: Make sure your Backblaze B2 bucket is configured:
   - Bucket Type: Should be `Public` for direct URL access
   - CORS Settings: Configure to allow web access if needed

### Test Scenarios

#### 1. Backend API Testing

**Test Item Creation with Images:**

```bash
# Use curl or Postman to test the items endpoint
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Test Item" \
  -F "description=Test Description" \
  -F "location=Test Location" \
  -F "categoryId=YOUR_CATEGORY_ID" \
  -F "dateFound=2025-09-29" \
  -F "images=@path/to/test-image1.jpg" \
  -F "images=@path/to/test-image2.jpg"
```

**Test Claim Creation with Proof Image:**

```bash
curl -X POST http://localhost:3000/api/claims \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "itemId=YOUR_ITEM_ID" \
  -F "proofDescription=This is my proof description" \
  -F "proofImage=@path/to/proof-image.jpg"
```

#### 2. Mobile App Testing

**Test Image Upload in ReportItemScreen:**

1. Open the mobile app
2. Navigate to "Report Item" screen
3. Fill in item details
4. Add 1-3 images using the image picker
5. Submit the form
6. Verify the item appears in the dashboard with images

**Test Claim Submission in ClaimProcessScreen:**

1. Navigate to an item detail page
2. Click "Claim Item"
3. Fill in proof description
4. Add a proof image
5. Submit the claim
6. Verify the claim appears in admin dashboard

### Expected Results

#### Successful Upload

- **Backend Response**: Should return item/claim object with `image_urls` array containing B2 URLs
- **B2 URLs Format**: `https://s3.us-west-004.backblazeb2.com/your-bucket-name/folder/userId/filename.jpg`
- **Mobile Display**: Images should load and display correctly in the app

#### File Organization in B2

```
your-bucket-name/
├── items/
│   └── user-id/
│       ├── uuid1.jpg
│       ├── uuid2.png
│       └── ...
├── claims/
│   └── user-id/
│       ├── uuid3.jpg
│       └── ...
└── profiles/
    └── user-id/
        └── avatar.jpg
```

### Troubleshooting

#### Common Issues

1. **Upload Fails with 401 Error**

   - Check B2 credentials in `.env` file
   - Verify B2 key has write permissions

2. **Upload Succeeds but Image URLs Don't Work**

   - Check bucket privacy settings (should be Public)
   - Verify B2_ENDPOINT is correct for your region

3. **Mobile App Can't Load Images**

   - Check if URLs are properly returned from API
   - Verify image URLs are accessible in a browser
   - Check React Native Image component props

4. **Large Images Fail to Upload**
   - Current limit is 5MB per image
   - Consider implementing image compression on mobile

#### Debug Commands

**Test B2 Connection:**

```javascript
// Add this to a test route
const ImageUploadService = require("./services/image-upload");
const imageService = new ImageUploadService();

// Test upload
const testBuffer = Buffer.from("test data");
const result = await imageService.uploadImage(testBuffer, {
  originalName: "test.txt",
  mimeType: "text/plain",
  folder: "test",
  userId: "test-user",
});
console.log("Upload result:", result);
```

**Check B2 Storage:**

```javascript
// List files in bucket
const backblaze = imageService.backblaze;
const listResult = await backblaze.listFiles();
console.log("Files in bucket:", listResult);
```

### Performance Considerations

1. **Image Optimization**: Consider implementing image compression before upload
2. **Progressive Upload**: For multiple images, show upload progress
3. **Retry Logic**: Implement retry for failed uploads
4. **Cleanup**: Old images are automatically cleaned up when items are updated

### Security Notes

1. **File Type Validation**: Only image files are accepted
2. **File Size Limits**: 5MB per image
3. **User Isolation**: Images are organized by user ID
4. **Access Control**: Images are public but URLs are not easily guessable

### Monitoring

Monitor these metrics:

- Upload success rate
- Average upload time
- Storage usage in B2
- Failed upload errors in logs
