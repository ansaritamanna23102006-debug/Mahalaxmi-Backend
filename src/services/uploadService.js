const fs = require('fs');
const path = require('path');
const { cloudinary } = require('../config/cloudinary');

const uploadImage = async (file) => {
  try {
    if (!file) return null;

    const isMock = process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloud_name' || !process.env.CLOUDINARY_CLOUD_NAME;

    // Local Mock upload mode
    if (isMock) {
      console.log('[MOCK UPLOAD] Simulating Cloudinary upload for:', file.originalname);
      
      // If file was uploaded to memory, write it to the uploads directory
      let filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadsDir = path.join(__dirname, '../../uploads');
      
      // Create uploads directory if it does not exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const localPath = path.join(uploadsDir, filename);

      if (file.buffer) {
        fs.writeFileSync(localPath, file.buffer);
      } else if (file.path) {
        // If file is already saved by multer diskStorage, copy or rename it
        fs.copyFileSync(file.path, localPath);
        try {
          fs.unlinkSync(file.path); // Remove original temp file
        } catch (e) {
          // ignore
        }
      }

      const host = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
      return `${host}/uploads/${filename}`;
    }

    // Real Cloudinary upload mode
    let uploadResult;
    if (file.buffer) {
      // Memory Storage: Upload via stream
      uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'mahalaxmi' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    } else if (file.path) {
      // Disk Storage: Upload from path
      uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'mahalaxmi'
      });
      // Delete temporary local file
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error('Failed to delete temp file:', err.message);
      }
    }

    return uploadResult.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failure:', error.message);
    throw new Error(`Media upload failed: ${error.message}`);
  }
};

const uploadMultipleImages = async (files) => {
  if (!files || files.length === 0) return [];
  const uploadPromises = files.map(file => uploadImage(file));
  return await Promise.all(uploadPromises);
};

module.exports = {
  uploadImage,
  uploadMultipleImages
};
