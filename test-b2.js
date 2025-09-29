// Test script to verify B2 integration
const ImageUploadService = require("./services/image-upload");
require("dotenv").config();

async function testB2Integration() {
  console.log("🔧 Testing B2 Integration...\n");

  const imageService = new ImageUploadService();

  console.log("📋 Configuration:");
  console.log(`   Bucket: ${process.env.B2_BUCKET_NAME}`);
  console.log(
    `   Private: ${process.env.B2_BUCKET_PRIVATE !== "false" ? "Yes" : "No"}`
  );
  console.log(
    `   URL Expiry: ${process.env.B2_URL_EXPIRY || "86400"} seconds\n`
  );

  try {
    // Test 1: Connection
    console.log("🔗 Test 1: Testing B2 connection...");
    const backblaze = imageService.backblaze;
    const listResult = await backblaze.listFiles("", 1);

    if (listResult.success) {
      console.log("✅ B2 connection successful!");
      console.log(`   Files in bucket: ${listResult.data.files.length}`);
    } else {
      console.log("❌ B2 connection failed:", listResult.error);
      return;
    }

    // Test 2: Upload
    console.log("\n📤 Test 2: Testing image upload...");
    const testBuffer = Buffer.from("FAKE_IMAGE_DATA_FOR_TESTING", "utf8");

    const uploadResult = await imageService.uploadImage(testBuffer, {
      originalName: "test-image.jpg",
      mimeType: "image/jpeg",
      folder: "test",
      userId: "test-user-123",
    });

    if (uploadResult.success) {
      console.log("✅ Image upload successful!");
      console.log(`   Key: ${uploadResult.data.key}`);
      console.log(`   URL: ${uploadResult.data.url}`);
      console.log(`   Size: ${uploadResult.data.size} bytes`);
      console.log(`   Private: ${uploadResult.data.isPrivate}`);
      if (uploadResult.data.expiresAt) {
        console.log(`   Expires: ${uploadResult.data.expiresAt}`);
      }

      // Test 3: URL refresh (for private buckets)
      if (uploadResult.data.isPrivate) {
        console.log("\n🔄 Test 3: Testing URL refresh...");
        const refreshResult = await imageService.refreshImageUrls(
          [uploadResult.data.key],
          3600
        );

        if (refreshResult.success) {
          console.log("✅ URL refresh successful!");
          console.log(`   New URL: ${refreshResult.data[0].url}`);
        } else {
          console.log("❌ URL refresh failed:", refreshResult.error);
        }
      }

      // Test 4: Cleanup
      console.log("\n🗑️  Test 4: Testing cleanup...");
      const deleteResult = await imageService.deleteImage(
        uploadResult.data.key
      );

      if (deleteResult.success) {
        console.log("✅ Image deletion successful!");
      } else {
        console.log("❌ Image deletion failed:", deleteResult.error);
      }
    } else {
      console.log("❌ Image upload failed:", uploadResult.error);
    }

    console.log("\n🎉 All tests completed!");
  } catch (error) {
    console.error("💥 Test failed with error:", error.message);
  }
}

// Run tests
testB2Integration()
  .then(() => {
    console.log("\n✨ Test script finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Test script error:", error);
    process.exit(1);
  });
