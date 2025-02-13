import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary and deletes the local file after upload.
 * @param {string} localFilePath - The local file path of the file to upload.
 * @returns {object|null} - The Cloudinary response object or null on failure.
 */
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.warn("No file path provided for Cloudinary upload.");
      return null;
    }

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Automatically detect the file type
    });

    // Log success and delete the local file
    console.log("File successfully uploaded to Cloudinary:", response.url);
    fs.unlinkSync(localFilePath); // Remove the local temporary file
    return response;
  } catch (error) {
    // Log the error
    console.error("Error uploading file to Cloudinary:", error.message);

    // Attempt to delete the local file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null; // Return null to indicate failure
  }
};

export { uploadOnCloudinary };
