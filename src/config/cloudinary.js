const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
  const isMock = process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloud_name';
  
  if (isMock) {
    console.warn('Warning: Cloudinary credentials are set to mock values. File uploads will fall back to local mocks.');
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

module.exports = {
  cloudinary,
  configureCloudinary
};
