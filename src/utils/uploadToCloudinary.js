const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

// Load environment variables
dotenv.config();

// Import Models
const Product = require('../models/Product');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const Gallery = require('../models/Gallery');
const Offer = require('../models/Offer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mahalaxmi';
const FRONTEND_PUBLIC_DIR = path.join(__dirname, '../../../Mahalaxmi-Frontend/public');
const IMAGES_DIR = path.join(FRONTEND_PUBLIC_DIR, 'images');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function uploadFileToCloudinary(filePath, relativePath) {
  try {
    console.log(`Uploading ${relativePath}...`);
    // Define a public ID based on filename (without extension and replacing spaces/special characters)
    const fileBasename = path.basename(filePath, path.extname(filePath));
    const cleanPublicId = fileBasename.replace(/[^a-zA-Z0-9_-]/g, '_');
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'mahalaxmi',
      public_id: cleanPublicId,
      overwrite: true,
      invalidate: true
    });
    
    console.log(`✓ Uploaded ${relativePath} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Failed to upload ${relativePath}:`, error.message);
    return null;
  }
}

async function run() {
  try {
    // 1. Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Check frontend public directory exists
    if (!fs.existsSync(FRONTEND_PUBLIC_DIR)) {
      throw new Error(`Frontend public directory not found at: ${FRONTEND_PUBLIC_DIR}`);
    }

    const mapping = {};

    // 2. Scan and upload files from public/images
    if (fs.existsSync(IMAGES_DIR)) {
      const files = fs.readdirSync(IMAGES_DIR);
      for (const file of files) {
        const filePath = path.join(IMAGES_DIR, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          const relativePath = `/images/${file}`;
          const cloudinaryUrl = await uploadFileToCloudinary(filePath, relativePath);
          if (cloudinaryUrl) {
            mapping[relativePath] = cloudinaryUrl;
          }
          // Slight delay to prevent rate-limiting
          await sleep(200);
        }
      }
    }

    // 3. Scan and upload specific files from public root
    const rootFilesToUpload = ['traditional_maker.jpg', 'hero_sweets.jpg'];
    for (const file of rootFilesToUpload) {
      const filePath = path.join(FRONTEND_PUBLIC_DIR, file);
      if (fs.existsSync(filePath)) {
        const relativePath = `/${file}`;
        const cloudinaryUrl = await uploadFileToCloudinary(filePath, relativePath);
        if (cloudinaryUrl) {
          mapping[relativePath] = cloudinaryUrl;
        }
        await sleep(200);
      }
    }

    // Write mapping to JSON files for reference
    const mappingPathBackend = path.join(__dirname, 'cloudinary_mapping.json');
    const mappingPathFrontend = path.join(FRONTEND_PUBLIC_DIR, 'cloudinary_mapping.json');
    
    fs.writeFileSync(mappingPathBackend, JSON.stringify(mapping, null, 2));
    fs.writeFileSync(mappingPathFrontend, JSON.stringify(mapping, null, 2));
    console.log(`✓ Saved mapping to backend at ${mappingPathBackend}`);
    console.log(`✓ Saved mapping to frontend at ${mappingPathFrontend}`);

    // Helper to find replacement URL
    const getReplacement = (url) => {
      if (!url) return url;
      // Strip out hostname or any leading part to match relative path
      let matchPath = url;
      if (url.includes('/images/')) {
        const idx = url.indexOf('/images/');
        matchPath = url.substring(idx);
      } else if (url.includes('/traditional_maker')) {
        matchPath = '/traditional_maker.jpg';
      } else if (url.includes('/hero_sweets')) {
        matchPath = '/hero_sweets.jpg';
      }
      
      // Try exact match or decodeURI/encodeURI mismatch match
      const decodedMatchPath = decodeURIComponent(matchPath);
      
      if (mapping[matchPath]) return mapping[matchPath];
      if (mapping[decodedMatchPath]) return mapping[decodedMatchPath];
      
      return url;
    };

    // 4. Update MongoDB Records
    console.log('Updating MongoDB collections...');

    // Products
    const products = await Product.find({});
    console.log(`Updating ${products.length} Products...`);
    let updatedProducts = 0;
    for (const p of products) {
      let isChanged = false;
      if (p.images && p.images.length > 0) {
        const newImages = p.images.map(img => {
          const rep = getReplacement(img);
          if (rep !== img) isChanged = true;
          return rep;
        });
        if (isChanged) {
          p.images = newImages;
        }
      }
      if (isChanged) {
        await p.save();
        updatedProducts++;
      }
    }
    console.log(`✓ Updated ${updatedProducts} Products`);

    // Categories
    const categories = await Category.find({});
    console.log(`Updating ${categories.length} Categories...`);
    let updatedCategories = 0;
    for (const cat of categories) {
      if (cat.image) {
        const rep = getReplacement(cat.image);
        if (rep !== cat.image) {
          cat.image = rep;
          await cat.save();
          updatedCategories++;
        }
      }
    }
    console.log(`✓ Updated ${updatedCategories} Categories`);

    // Collections
    const collections = await Collection.find({});
    console.log(`Updating ${collections.length} Collections...`);
    let updatedCollections = 0;
    for (const col of collections) {
      if (col.image) {
        const rep = getReplacement(col.image);
        if (rep !== col.image) {
          col.image = rep;
          await col.save();
          updatedCollections++;
        }
      }
    }
    console.log(`✓ Updated ${updatedCollections} Collections`);

    // Gallery
    const galleryItems = await Gallery.find({});
    console.log(`Updating ${galleryItems.length} Gallery items...`);
    let updatedGallery = 0;
    for (const item of galleryItems) {
      if (item.imageUrl) {
        const rep = getReplacement(item.imageUrl);
        if (rep !== item.imageUrl) {
          item.imageUrl = rep;
          await item.save();
          updatedGallery++;
        }
      }
    }
    console.log(`✓ Updated ${updatedGallery} Gallery items`);

    // Offers
    const offers = await Offer.find({});
    console.log(`Updating ${offers.length} Offers...`);
    let updatedOffers = 0;
    for (const offer of offers) {
      if (offer.bannerUrl) {
        const rep = getReplacement(offer.bannerUrl);
        if (rep !== offer.bannerUrl) {
          offer.bannerUrl = rep;
          await offer.save();
          updatedOffers++;
        }
      }
    }
    console.log(`✓ Updated ${updatedOffers} Offers`);

    console.log('\n🎉 ALL DONE! Images successfully uploaded and database references updated.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

run();
