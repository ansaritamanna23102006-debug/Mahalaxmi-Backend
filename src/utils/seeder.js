const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Category = require('../models/Category');

dotenv.config();

const categoriesData = [
  {
    name: "Sweets",
    description: "Authentic luxury ghee sweets, soft pedas, and syrup-rich Bengali delicacies.",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Farsan",
    description: "Crunchy Mumbai namkeen, crispy flatbreads, spiced bhujias, and pinwheel snacks.",
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&auto=format&fit=crop&q=80"
  }
];

const productsData = [
  // --- SWEETS ---
  {
    name: "Premium Kaju Katli",
    category: "Sweets",
    description: "Traditional diamond-shaped cashew fudge decorated with premium edible silver leaf. Crafted using A-grade cashews and double-refined sugar syrup.",
    shortDescription: "Traditional diamond-shaped cashew fudge decorated with premium silver leaf.",
    price: 400,
    discountPrice: 360,
    stock: 150,
    sku: "MM-SWEET-001",
    images: [
      "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: true,
    isBestSeller: true,
    isFestivalOffer: false,
    isNewArrival: false
  },
  {
    name: "Motichoor Ladoo",
    category: "Sweets",
    description: "Made with premium gram flour pearls, pure ghee, and roasted melon seeds, flavored with saffron.",
    shortDescription: "Made with premium gram flour pearls, pure ghee, and roasted melon seeds.",
    price: 280,
    discountPrice: 240,
    stock: 200,
    sku: "MM-SWEET-002",
    images: [
      "https://images.unsplash.com/photo-1605197561914-65022f4628ec?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: true,
    isBestSeller: false,
    isFestivalOffer: false,
    isNewArrival: true
  },
  {
    name: "Kaju Roll",
    category: "Sweets",
    description: "Creamy cashew rolls filled with pure pistachios and saffron.",
    shortDescription: "Creamy cashew rolls filled with pure pistachios and saffron.",
    price: 420,
    discountPrice: 380,
    stock: 90,
    sku: "MM-SWEET-003",
    images: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: false,
    isBestSeller: true,
    isFestivalOffer: false,
    isNewArrival: false
  },
  {
    name: "Besan Ladoo",
    category: "Sweets",
    description: "Slow-roasted gram flour in pure cow ghee, flavored with green cardamom.",
    shortDescription: "Slow-roasted gram flour in pure cow ghee, flavored with green cardamom.",
    price: 220,
    discountPrice: 0,
    stock: 120,
    sku: "MM-SWEET-004",
    images: [
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: false,
    isBestSeller: false,
    isFestivalOffer: true,
    isNewArrival: false
  },
  {
    name: "Royal Gulab Jamun",
    category: "Sweets",
    description: "Soft, golden-fried milk dumplings soaked in aromatic rose and cardamom syrup.",
    shortDescription: "Soft, golden-fried milk dumplings soaked in aromatic rose and cardamom syrup.",
    price: 180,
    discountPrice: 0,
    stock: 180,
    sku: "MM-SWEET-005",
    images: [
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: true,
    isBestSeller: true,
    isFestivalOffer: false,
    isNewArrival: false
  },
  {
    name: "Sponge Rasgulla",
    category: "Sweets",
    description: "Soft, spongy cottage cheese balls cooked in light sugar syrup.",
    shortDescription: "Soft, spongy cottage cheese balls cooked in light sugar syrup.",
    price: 160,
    discountPrice: 0,
    stock: 220,
    sku: "MM-SWEET-006",
    images: [
      "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: false,
    isBestSeller: false,
    isFestivalOffer: false,
    isNewArrival: true
  },
  {
    name: "Special Mysore Pak",
    category: "Sweets",
    description: "Rich, melt-in-the-mouth traditional sweet cooked with pure ghee and gram flour.",
    shortDescription: "Rich, melt-in-the-mouth traditional sweet cooked with pure ghee and gram flour.",
    price: 280,
    discountPrice: 0,
    stock: 75,
    sku: "MM-SWEET-007",
    images: [
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: false,
    isBestSeller: false,
    isFestivalOffer: true,
    isNewArrival: false
  },
  {
    name: "Kesar Peda",
    category: "Sweets",
    description: "Concentrated milk fudge flavored with rich saffron threads and cardamom.",
    shortDescription: "Concentrated milk fudge flavored with rich saffron threads and cardamom.",
    price: 200,
    discountPrice: 0,
    stock: 140,
    sku: "MM-SWEET-008",
    images: [
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: true,
    isBestSeller: false,
    isFestivalOffer: false,
    isNewArrival: false
  },
  {
    name: "Milk Cake",
    category: "Sweets",
    description: "Traditional grainy milk cake made by continuous reduction of sweet milk.",
    shortDescription: "Traditional grainy milk cake made by continuous reduction of sweet milk.",
    price: 300,
    discountPrice: 0,
    stock: 60,
    sku: "MM-SWEET-009",
    images: [
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: false,
    isBestSeller: false,
    isFestivalOffer: false,
    isNewArrival: false
  },
  {
    name: "Royal Soan Papdi",
    category: "Sweets",
    description: "Crispy, flaky threads of gram and wheat flour, rich with pistachios.",
    shortDescription: "Crispy, flaky threads of gram and wheat flour, rich with pistachios.",
    price: 150,
    discountPrice: 0,
    stock: 130,
    sku: "MM-SWEET-010",
    images: [
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: false,
    isBestSeller: false,
    isFestivalOffer: false,
    isNewArrival: false
  },

  // --- FARSAN ---
  {
    name: "Teekha Sev",
    category: "Farsan",
    description: "Crispy chickpea flour noodles spiced with red chilli powder and clove.",
    shortDescription: "Crispy chickpea flour noodles spiced with red chilli powder and clove.",
    price: 120,
    discountPrice: 0,
    stock: 250,
    sku: "MM-FARSAN-001",
    images: [
      "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: true,
    isBestSeller: true,
    isFestivalOffer: false,
    isNewArrival: false
  },
  {
    name: "Premium Fafda",
    category: "Farsan",
    description: "Crispy, melt-in-the-mouth Gujarati flat snack seasoned with carom seeds.",
    shortDescription: "Crispy, melt-in-the-mouth Gujarati flat snack seasoned with carom seeds.",
    price: 140,
    discountPrice: 0,
    stock: 190,
    sku: "MM-FARSAN-002",
    images: [
      "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: true,
    isBestSeller: false,
    isFestivalOffer: false,
    isNewArrival: true
  },
  {
    name: "Bhavnagari Gathiya",
    category: "Farsan",
    description: "Soft and puffy fried gram flour logs made with freshly ground black pepper.",
    shortDescription: "Soft and puffy fried gram flour logs made with freshly ground black pepper.",
    price: 130,
    discountPrice: 0,
    stock: 110,
    sku: "MM-FARSAN-003",
    images: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: false,
    isBestSeller: false,
    isFestivalOffer: false,
    isNewArrival: false
  },
  {
    name: "Aloo Bhujia",
    category: "Farsan",
    description: "Tangy and crispy potato noodles flavored with dry mango powder and mint.",
    shortDescription: "Tangy and crispy potato noodles flavored with dry mango powder and mint.",
    price: 110,
    discountPrice: 0,
    stock: 300,
    sku: "MM-FARSAN-004",
    images: [
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: false,
    isBestSeller: false,
    isFestivalOffer: false,
    isNewArrival: false
  },
  {
    name: "Butter Chakli",
    category: "Farsan",
    description: "Crunchy spiral snack made with rice flour and white sesame seeds, rich with butter.",
    shortDescription: "Crunchy spiral snack made with rice flour and white sesame seeds, rich with butter.",
    price: 150,
    discountPrice: 0,
    stock: 140,
    sku: "MM-FARSAN-005",
    images: [
      "https://images.unsplash.com/photo-1605197561914-65022f4628ec?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: false,
    isBestSeller: true,
    isFestivalOffer: false,
    isNewArrival: false
  },
  {
    name: "Methi Khakhra",
    category: "Farsan",
    description: "Thin, crispy roasted flatbread seasoned with sun-dried fenugreek leaves.",
    shortDescription: "Thin, crispy roasted flatbread seasoned with sun-dried fenugreek leaves.",
    price: 100,
    discountPrice: 0,
    stock: 95,
    sku: "MM-FARSAN-006",
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: false,
    isBestSeller: false,
    isFestivalOffer: false,
    isNewArrival: false
  },
  {
    name: "Royal Namkeen Mix",
    category: "Farsan",
    description: "Rich mixture of spiced lentils, potato sticks, nuts, and flat rice flakes.",
    shortDescription: "Spiced lentils, potato sticks, nuts, and flat rice flakes mixture.",
    price: 120,
    discountPrice: 0,
    stock: 210,
    sku: "MM-FARSAN-007",
    images: [
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: false,
    isBestSeller: false,
    isFestivalOffer: false,
    isNewArrival: false
  },
  {
    name: "Crispy Bhakarwadi",
    category: "Farsan",
    description: "Sweet, spicy, and tangy rolled pinwheel snacks filled with poppy seeds and coconut.",
    shortDescription: "Sweet, spicy, and tangy rolled pinwheel snacks filled with poppy seeds and coconut.",
    price: 140,
    discountPrice: 0,
    stock: 170,
    sku: "MM-FARSAN-008",
    images: [
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: true,
    isBestSeller: true,
    isFestivalOffer: false,
    isNewArrival: false
  },
  {
    name: "Masala Papdi",
    category: "Farsan",
    description: "Thin, crispy deep-fried chips seasoned with carom and whole red chilli flakes.",
    shortDescription: "Thin, crispy deep-fried chips seasoned with carom and whole red chilli flakes.",
    price: 120,
    discountPrice: 0,
    stock: 125,
    sku: "MM-FARSAN-009",
    images: [
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80"
    ],
    weightOptions: ["250g", "500g", "1kg"],
    isFeatured: false,
    isBestSeller: false,
    isFestivalOffer: false,
    isNewArrival: false
  }
];

const couponsData = [
  {
    code: "FESTIVE15",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 500,
    expiryDate: new Date("2028-12-31"),
    isActive: true
  },
  {
    code: "WELCOME100",
    discountType: "flat",
    discountValue: 100,
    minOrderAmount: 1000,
    expiryDate: new Date("2028-12-31"),
    isActive: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mahalaxmi');
    console.log('Connected to MongoDB for seeding...');

    // 0. Seed Categories
    await Category.deleteMany({});
    console.log('Cleared existing categories.');
    await Category.insertMany(categoriesData);
    console.log(`Successfully seeded ${categoriesData.length} categories!`);

    // 1. Seed Products
    await Product.deleteMany({});
    console.log('Cleared existing products.');
    await Product.insertMany(productsData);
    console.log(`Successfully seeded ${productsData.length} products!`);

    // 2. Seed Coupons
    await Coupon.deleteMany({});
    console.log('Cleared existing coupons.');
    await Coupon.insertMany(couponsData);
    console.log(`Successfully seeded ${couponsData.length} coupons!`);

    console.log('Database seeding process completed! 🌟');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
