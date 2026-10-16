import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
});

export const uploadMedia = async (fileBuffer, folder = 'intellmeet', mimeType = 'image/jpeg') => {
  // If Cloudinary keys are present, upload to Cloudinary free tier
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            format: result.format
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  // Graceful 100% Free fallback: Convert buffer to data URI so users can test immediately without setting up accounts
  const base64Data = fileBuffer.toString('base64');
  const dataUri = `data:${mimeType};base64,${base64Data}`;
  return {
    url: dataUri,
    publicId: `mock_${Date.now()}`,
    bytes: fileBuffer.length,
    format: mimeType.split('/')[1] || 'jpeg'
  };
};

export default cloudinary;
