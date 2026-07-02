const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Category = require('../models/Category');

dotenv.config();

const categoriesData = [
  {
    name: "Premium Sweets",
    description: "Indulge in our exquisite assortment of premium dry fruit sweets, handcrafted with high-quality cashews, almonds, and pure saffron.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013580/mahalaxmi/Kaju_Katli.jpg"
  },
  {
    name: "Milk Sweets",
    description: "Classic and rich Indian milk delicacies including soft pedas, malai barfis, and traditional grainy milk cakes.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013584/mahalaxmi/Kesar_Peda.jpg"
  },
  {
    name: "Laddu Varieties",
    description: "Fragrant, round delights crafted in pure ghee, featuring traditional family recipes like Motichoor and Besan Laddus.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013603/mahalaxmi/Motichoor_Laddoo.jpg"
  },
  {
    name: "Halwa & Specials",
    description: "Warm, soft, and aromatic puddings cooked with rich nuts, pure cow ghee, and traditional ingredients.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013571/mahalaxmi/Gajar__Carrot__Halwa.jpg"
  },
  {
    name: "Jamun Varieties",
    description: "Juicy, golden-fried milk dumplings soaked in delicious cardamom and rose-infused sugar syrup.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013574/mahalaxmi/Gulab_Jamun.jpg"
  },
  {
    name: "Bengali Sweets",
    description: "Soft, spongy, and syrup-soaked cottage cheese desserts made with authentic Bengali craft.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013607/mahalaxmi/Rasmalai.jpg"
  },
  {
    name: "Desi Ghee Specials",
    description: "Specially curated regional sweet treats made with 100% pure premium desi ghee for a royal taste.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013554/mahalaxmi/Choorma.jpg"
  },
  {
    name: "Pav Items",
    description: "Freshly made hot savory treats sandwiched in soft, pillowy pav buns, served with spicy and sweet chutneys.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013618/mahalaxmi/Vada_pav.jpg"
  },
  {
    name: "Single Items",
    description: "Our signature individual tea-time snacks including crispy samosas, bread pakodas, and spiced batata vadas.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013611/mahalaxmi/Samosa.jpg"
  },
  {
    name: "Bhajiya & Plates",
    description: "Freshly fried hot Indian fritters served as generous plates, perfect for a rainy evening snack.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013601/mahalaxmi/Mixed_variety_bhajiya.jpg"
  },
  {
    name: "Chaat Items",
    description: "Tangy, sweet, and spicy street-style chaats topped with chilled yogurt, fresh chutneys, and crunchy sev.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013623/mahalaxmi/___Samosa_Chaat.jpg"
  },
  {
    name: "Jalebi & Fafda Specials",
    description: "Crispy, salted Gujarati fafda combined with hot, syrup-dripping spiral jalebis. A legendary weekend breakfast.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013615/mahalaxmi/The_Jalebi_Fafda.jpg"
  },
  {
    name: "Gujarati Snacks",
    description: "Soft and spongy khaman dhoklas and traditional steamed alu wadi (patra) shallow-fried with sesame seeds.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013562/mahalaxmi/Dhokla______.jpg"
  },
  {
    name: "Sweets",
    description: "Traditional sweet delicacies including circular flower-shaped hot Imartis and syrup-rich stuffed Mawa kachoris.",
    image: "https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013576/mahalaxmi/imarti.jpg"
  }
];

const productsData = [
  // ─── PREMIUM SWEETS ───
  {
    name: "Kaju Katli",
    category: "Premium Sweets",
    description: "Traditional diamond-shaped cashew fudge decorated with premium edible silver leaf. Crafted using A-grade cashews and double-refined sugar syrup.",
    shortDescription: "Traditional diamond-shaped cashew fudge decorated with premium silver leaf.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013580/mahalaxmi/Kaju_Katli.jpg"],
    variants: [
      { weight: "100gm", price: 100, stock: 100 },
      { weight: "250gm", price: 250, stock: 100 },
      { weight: "500gm", price: 500, stock: 100 },
      { weight: "1kg", price: 1000, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: true,
    tags: ["kaju", "cashew", "katli", "premium", "silver"],
    seoTitle: "Buy Premium Kaju Katli Online | Mahalaxmi Mithaiwala",
    seoDescription: "Order premium Kaju Katli online. Handcrafted diamond-shaped cashew fudge made with 100% pure cashews and decorated with premium silver leaf."
  },

  // ─── MILK SWEETS ───
  {
    name: "Malai Barfi",
    category: "Milk Sweets",
    description: "Super soft and rich milk fudge made by reducing sweet milk and layering it with fresh cream (malai), garnished with pistachios and almonds.",
    shortDescription: "Super soft and rich milk fudge made with fresh cream and garnished with pistachios.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013595/mahalaxmi/malai_barfi.jpg"],
    variants: [
      { weight: "100gm", price: 80, stock: 100 },
      { weight: "250gm", price: 200, stock: 100 },
      { weight: "500gm", price: 400, stock: 100 },
      { weight: "1kg", price: 800, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: false,
    tags: ["milk", "barfi", "malai", "khoya", "sweet"],
    seoTitle: "Fresh Malai Barfi Online | Mahalaxmi Mithaiwala",
    seoDescription: "Savor the rich, melt-in-the-mouth taste of our Malai Barfi. Made with fresh milk cream and garnished with dry fruits."
  },
  {
    name: "Malai Peda",
    category: "Milk Sweets",
    description: "Classic round milk pedas prepared from rich condensed milk solids, cardamoms, and pure ghee. A perfect offering for festive celebrations.",
    shortDescription: "Classic round milk pedas prepared from rich condensed milk and cardamoms.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013586/mahalaxmi/Kesarpeda.jpg"],
    variants: [
      { weight: "100gm", price: 80, stock: 100 },
      { weight: "250gm", price: 200, stock: 100 },
      { weight: "500gm", price: 400, stock: 100 },
      { weight: "1kg", price: 800, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: true,
    tags: ["peda", "malai", "milk", "khoya", "tradition"],
    seoTitle: "Traditional Malai Peda | Mahalaxmi Mithaiwala",
    seoDescription: "Buy traditional Malai Peda online. Prepared with pure condensed milk solids and flavored with aromatic cardamoms."
  },
  {
    name: "Bagdi Dudh Peda",
    category: "Milk Sweets",
    description: "A rustic, highly caramelized specialty peda native to regional heritage. Prepared by slow-roasting milk solids to a rich brown color with a deep smoky sweet flavor.",
    shortDescription: "Caramelized specialty peda prepared by slow-roasting milk solids.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013566/mahalaxmi/dudh_peda.jpg"],
    variants: [
      { weight: "100gm", price: 80, stock: 100 },
      { weight: "250gm", price: 200, stock: 100 },
      { weight: "500gm", price: 400, stock: 100 },
      { weight: "1kg", price: 800, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: false,
    tags: ["peda", "bagdi", "dudh", "caramel", "smoky"],
    seoTitle: "Authentic Bagdi Dudh Peda | Mahalaxmi Mithaiwala",
    seoDescription: "Experience the deep caramelized taste of regional Bagdi Dudh Peda, slow-roasted to perfection for an unforgettable rich flavor."
  },
  {
    name: "Kesar Peda",
    category: "Milk Sweets",
    description: "Premium saffron-infused milk pedas crafted with concentrated milk solids, organic saffron threads, and flavored with green cardamom.",
    shortDescription: "Premium saffron-infused milk pedas crafted with organic saffron and cardamom.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013584/mahalaxmi/Kesar_Peda.jpg"],
    variants: [
      { weight: "100gm", price: 80, stock: 100 },
      { weight: "250gm", price: 200, stock: 100 },
      { weight: "500gm", price: 400, stock: 100 },
      { weight: "1kg", price: 800, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: false,
    tags: ["peda", "kesar", "saffron", "milk", "yellow"],
    seoTitle: "Saffron Kesar Peda Online | Mahalaxmi Mithaiwala",
    seoDescription: "Order rich Kesar Peda loaded with real saffron threads and aromatic cardamom. The ultimate festive sweet treat."
  },
  {
    name: "Milk Cake",
    category: "Milk Sweets",
    description: "Classic grainy-textured Indian milk cake prepared by slow-boiling milk for hours, curdled slightly, and sweetened to golden-brown perfection.",
    shortDescription: "Classic grainy-textured Indian milk cake cooked to a golden-brown sweet finish.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013599/mahalaxmi/milk_cake.jpg"],
    variants: [
      { weight: "100gm", price: 60, stock: 100 },
      { weight: "250gm", price: 150, stock: 100 },
      { weight: "500gm", price: 300, stock: 100 },
      { weight: "1kg", price: 600, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: true,
    tags: ["milkcake", "grainy", "khoya", "brown", "cake"],
    seoTitle: "Grainy Traditional Milk Cake | Mahalaxmi Mithaiwala",
    seoDescription: "Order the legendary grainy Milk Cake online. Slow-cooked to develop its iconic two-tone color and rich caramelized core."
  },
  {
    name: "White Milk Cake",
    category: "Milk Sweets",
    description: "A delicate, lighter version of the traditional milk cake. Cooked gently to retain its pristine ivory white color and soft, velvety texture.",
    shortDescription: "Delicate, velvety version of milk cake cooked gently to retain its ivory white color.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013620/mahalaxmi/white_mc.jpg"],
    variants: [
      { weight: "100gm", price: 60, stock: 100 },
      { weight: "250gm", price: 150, stock: 100 },
      { weight: "500gm", price: 300, stock: 100 },
      { weight: "1kg", price: 600, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: false,
    tags: ["milkcake", "white", "velvet", "cream", "soft"],
    seoTitle: "Premium White Milk Cake | Mahalaxmi Mithaiwala",
    seoDescription: "Buy premium White Milk Cake online. Features a delicate, soft texture and rich, fresh milk aroma."
  },

  // ─── LADDU VARIETIES ───
  {
    name: "Moti Chur Laddu",
    category: "Laddu Varieties",
    description: "Tiny gram flour pearls (boondi) deep fried in pure ghee, simmered in saffron syrup, and pressed into round laddus with melon seeds.",
    shortDescription: "Ghee-fried tiny gram flour pearls simmered in saffron syrup and pressed with melon seeds.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013603/mahalaxmi/Motichoor_Laddoo.jpg"],
    variants: [
      { weight: "100gm", price: 40, stock: 100 },
      { weight: "250gm", price: 100, stock: 100 },
      { weight: "500gm", price: 200, stock: 100 },
      { weight: "1kg", price: 400, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: true,
    tags: ["laddu", "ladoo", "motichoor", "boondi", "ghee"],
    seoTitle: "Pure Ghee Motichoor Laddu | Mahalaxmi Mithaiwala",
    seoDescription: "Authentic Motichoor Laddus fried in pure cow ghee and infused with saffron and cardamoms. Perfect for gifting and celebrations."
  },
  {
    name: "Besan Laddu",
    category: "Laddu Varieties",
    description: "Traditional aromatic laddus made by slow-roasting coarse gram flour (besan) in pure desi ghee until golden, mixed with cardamom and sugar.",
    shortDescription: "Traditional aromatic laddus made from slow-roasted coarse gram flour and pure desi ghee.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013549/mahalaxmi/Besan_ladoo.jpg"],
    variants: [
      { weight: "100gm", price: 40, stock: 100 },
      { weight: "250gm", price: 100, stock: 100 },
      { weight: "500gm", price: 200, stock: 100 },
      { weight: "1kg", price: 400, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: true,
    tags: ["laddu", "besan", "gramflour", "roasted", "ghee"],
    seoTitle: "Aromatic Besan Laddu Online | Mahalaxmi Mithaiwala",
    seoDescription: "Buy rich, slow-roasted Besan Laddus. Made with premium gram flour, pure cow ghee, and flavored with green cardamom."
  },
  {
    name: "Coconut Dry Fruit Laddu",
    category: "Laddu Varieties",
    description: "Healthy and energizing laddus packed with grated coconut, dates, figs, almonds, cashews, and raisins, lightly bound with pure ghee.",
    shortDescription: "Healthy and energizing laddus packed with grated coconut and premium dry fruits.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013556/mahalaxmi/coconut_laddu.jpg"],
    variants: [
      { weight: "100gm", price: 60, stock: 100 },
      { weight: "250gm", price: 150, stock: 100 },
      { weight: "500gm", price: 300, stock: 100 },
      { weight: "1kg", price: 600, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: false,
    tags: ["laddu", "coconut", "dryfruit", "healthy", "energy"],
    seoTitle: "Healthy Coconut Dry Fruit Laddu | Mahalaxmi Mithaiwala",
    seoDescription: "Savor our healthy Coconut Dry Fruit Laddus. Sugar-free binding with premium dates, nuts, and freshly grated coconut."
  },
  {
    name: "Methi Desi Ghee Laddu",
    category: "Laddu Varieties",
    description: "Traditional wellness laddus containing roasted fenugreek (methi) seeds, whole wheat flour, gum (gond), and dry fruits, cooked in pure desi ghee. Excellent for joint health and winters.",
    shortDescription: "Traditional wellness laddus containing roasted fenugreek, wheat flour, and dry fruits in pure ghee.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013561/mahalaxmi/desi_laddu.jpg"],
    variants: [
      { weight: "100gm", price: 60, stock: 100 },
      { weight: "250gm", price: 150, stock: 100 },
      { weight: "500gm", price: 300, stock: 100 },
      { weight: "1kg", price: 600, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: false,
    tags: ["laddu", "methi", "wellness", "healthy", "gond", "winter"],
    seoTitle: "Wellness Methi Desi Ghee Laddu | Mahalaxmi Mithaiwala",
    seoDescription: "Buy traditional Methi Laddus prepared in pure cow ghee. Packed with nutrients, fenugreek, edible gum, and premium nuts for optimum health."
  },

  // ─── HALWA & SPECIALS ───
  {
    name: "Mumbai Special Halwa",
    category: "Halwa & Specials",
    description: "Also known as Karachi Halwa or Ice Halwa, this is a chewy, translucent cornflour-based sweet loaded with pistachios, almonds, and cardamoms.",
    shortDescription: "Chewy, translucent cornflour-based sweet loaded with pistachios and almonds.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013592/mahalaxmi/Lauki_Halwa___Dudhi_ka_Halwa.jpg"],
    variants: [
      { weight: "100gm", price: 40, stock: 100 },
      { weight: "250gm", price: 100, stock: 100 },
      { weight: "500gm", price: 200, stock: 100 },
      { weight: "1kg", price: 400, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: true,
    tags: ["halwa", "mumbai", "karachi", "chewy", "orange"],
    seoTitle: "Famous Mumbai Special Halwa | Mahalaxmi Mithaiwala",
    seoDescription: "Order the famous chewy and translucent Mumbai Special Halwa. Loaded with crunchy nuts and made in pure cow ghee."
  },
  {
    name: "Gajar Halwa (Desi Ghee)",
    category: "Halwa & Specials",
    description: "Rich winter carrot pudding simmered with milk, sugar, cardamoms, and a generous amount of pure desi ghee, heavily garnished with cashew nuts.",
    shortDescription: "Rich winter carrot pudding cooked in pure desi ghee and garnished with cashew nuts.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013571/mahalaxmi/Gajar__Carrot__Halwa.jpg"],
    variants: [
      { weight: "100gm", price: 60, stock: 100 },
      { weight: "250gm", price: 150, stock: 100 },
      { weight: "500gm", price: 300, stock: 100 },
      { weight: "1kg", price: 600, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: true,
    tags: ["halwa", "gajar", "carrot", "winter", "ghee", "warm"],
    seoTitle: "Desi Ghee Gajar Halwa | Mahalaxmi Mithaiwala",
    seoDescription: "Relish the warmth of our Desi Ghee Gajar Halwa. Prepared with fresh grated carrots, whole milk, and premium cashews."
  },
  {
    name: "Dudhi Halwa (Desi Ghee)",
    category: "Halwa & Specials",
    description: "Traditional bottle gourd (lauki/dudhi) pudding slow-cooked with fresh khoya, sugar, cardamoms, and pure desi ghee, offering a delicate sweet taste.",
    shortDescription: "Traditional bottle gourd pudding slow-cooked with fresh khoya and pure desi ghee.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013567/mahalaxmi/dudhi_Halwa.webp"],
    variants: [
      { weight: "100gm", price: 60, stock: 100 },
      { weight: "250gm", price: 150, stock: 100 },
      { weight: "500gm", price: 300, stock: 100 },
      { weight: "1kg", price: 600, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: false,
    tags: ["halwa", "dudhi", "lauki", "gourd", "khoya", "ghee"],
    seoTitle: "Lauki Dudhi Halwa Online | Mahalaxmi Mithaiwala",
    seoDescription: "Order fresh, aromatic Dudhi Halwa made with tender bottle gourd, fresh khoya, and cooked in pure cow ghee."
  },
  {
    name: "Daal Halwa (Desi Ghee)",
    category: "Halwa & Specials",
    description: "Royal Moong Dal Halwa made by slow-roasting yellow lentils in an equal proportion of pure desi ghee, sweetened and spiced with saffron and cardamom.",
    shortDescription: "Royal Moong Dal Halwa slow-roasted in pure desi ghee and spiced with saffron.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013558/mahalaxmi/daal_halwa.jpg"],
    variants: [
      { weight: "100gm", price: 60, stock: 100 },
      { weight: "250gm", price: 150, stock: 100 },
      { weight: "500gm", price: 300, stock: 100 },
      { weight: "1kg", price: 600, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: false,
    tags: ["halwa", "daal", "moong", "lentil", "royal", "ghee"],
    seoTitle: "Moong Dal Halwa (Desi Ghee) | Mahalaxmi Mithaiwala",
    seoDescription: "Experience the royal taste of Moong Dal Halwa online. Made by roasting yellow lentils in premium desi ghee for a rich, granular texture."
  },

  // ─── JAMUN VARIETIES ───
  {
    name: "Gulab Jamun",
    category: "Jamun Varieties",
    description: "Classic soft, berry-sized milk-solid dumplings, deep-fried in pure ghee and soaked in a sweet sugar syrup infused with green cardamom and rose water.",
    shortDescription: "Soft milk-solid dumplings deep-fried in ghee and soaked in cardamom rose syrup.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013574/mahalaxmi/Gulab_Jamun.jpg"],
    variants: [
      { weight: "100gm", price: 40, stock: 100 },
      { weight: "250gm", price: 100, stock: 100 },
      { weight: "500gm", price: 200, stock: 100 },
      { weight: "1kg", price: 400, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: true,
    tags: ["jamun", "gulab", "dumplings", "rose", "syrup"],
    seoTitle: "Soft Gulab Jamun Online | Mahalaxmi Mithaiwala",
    seoDescription: "Buy classic soft Gulab Jamuns online. Made with pure khoya and soaked in aromatic cardamom and rose-infused sugar syrup."
  },
  {
    name: "Anguri Gulab Jamun",
    category: "Jamun Varieties",
    description: "Delightful grape-sized miniature gulab jamuns. Perfectly portioned, soft, and syrup-soaked, making them a great addition to desserts like rabri.",
    shortDescription: "Delightful grape-sized miniature gulab jamuns soaked in syrup.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013542/mahalaxmi/anguri_gj.jpg"],
    variants: [
      { weight: "100gm", price: 40, stock: 100 },
      { weight: "250gm", price: 100, stock: 100 },
      { weight: "500gm", price: 200, stock: 100 },
      { weight: "1kg", price: 400, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: false,
    tags: ["jamun", "anguri", "mini", "grape", "syrup"],
    seoTitle: "Mini Anguri Gulab Jamun | Mahalaxmi Mithaiwala",
    seoDescription: "Order bite-sized Anguri Gulab Jamuns. These miniature treats are soft, juicy, and ideal for mixing with cold rabri."
  },
  {
    name: "Kala Jamun",
    category: "Jamun Varieties",
    description: "A variation of gulab jamun where the dumplings are fried at a higher temperature to caramelize the sugar, giving them a dark, almost black crust and a rich, firm texture.",
    shortDescription: "Dark, caramelized dumplings with a rich outer crust and a soft sweet core.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013581/mahalaxmi/kala_jamun.jpg"],
    variants: [
      { weight: "100gm", price: 40, stock: 100 },
      { weight: "250gm", price: 100, stock: 100 },
      { weight: "500gm", price: 200, stock: 100 },
      { weight: "1kg", price: 400, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: true,
    tags: ["jamun", "kala", "black", "caramelized", "firm"],
    seoTitle: "Caramelized Kala Jamun | Mahalaxmi Mithaiwala",
    seoDescription: "Order premium Kala Jamuns online. Fried to a beautiful dark, caramelized finish, featuring a rich, firm exterior and a soft sweet center."
  },
  {
    name: "Malai Jamun",
    category: "Jamun Varieties",
    description: "Premium large gulab jamuns sliced open and generously stuffed with fresh, sweetened milk cream (malai) and chopped pistachios.",
    shortDescription: "Premium large gulab jamuns sliced and stuffed with fresh sweetened milk cream.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013596/mahalaxmi/malai_jamun.jpg"],
    variants: [
      { weight: "100gm", price: 60, stock: 100 },
      { weight: "250gm", price: 150, stock: 100 },
      { weight: "500gm", price: 300, stock: 100 },
      { weight: "1kg", price: 600, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: false,
    tags: ["jamun", "malai", "stuffed", "cream", "royal"],
    seoTitle: "Stuffed Malai Jamun Online | Mahalaxmi Mithaiwala",
    seoDescription: "Indulge in our exquisite Malai Jamuns. Fried golden, split open, and stuffed with luxurious sweetened cream and nuts."
  },

  // ─── BENGALI SWEETS ───
  {
    name: "Rasgulla",
    category: "Bengali Sweets",
    description: "Authentic, extremely soft and spongy cottage cheese (chhena) balls cooked and soaked in light, clear sugar syrup. Light and refreshing.",
    shortDescription: "Spongy cottage cheese balls cooked and soaked in light, clear sugar syrup.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013608/mahalaxmi/rosogullah.jpg"],
    variants: [
      { weight: "1 Piece", price: 25, stock: 100 },
      { weight: "5 Pieces", price: 125, stock: 100 },
      { weight: "12 Pieces", price: 300, stock: 100 }
    ],
    stock: 300,
    featured: true,
    bestseller: true,
    tags: ["bengali", "rasgulla", "spongy", "chhena", "syrup"],
    seoTitle: "Spongy Bengali Rasgulla | Mahalaxmi Mithaiwala",
    seoDescription: "Enjoy the melt-in-your-mouth soft texture of authentic Bengali Rasgullas. Made with fresh, high-quality chhena in light sugar syrup."
  },
  {
    name: "Rajbhog",
    category: "Bengali Sweets",
    description: "A grander cousin of the rasgulla, these larger chhena balls are stuffed with dry fruits like almonds and pistachios and flavored with saffron and cardamom.",
    shortDescription: "Large saffron-flavored chhena balls stuffed with almonds and pistachios.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013588/mahalaxmi/Kesharia_Rajbhog.jpg"],
    variants: [
      { weight: "1 Piece", price: 25, stock: 100 },
      { weight: "5 Pieces", price: 125, stock: 100 },
      { weight: "12 Pieces", price: 300, stock: 100 }
    ],
    stock: 300,
    featured: false,
    bestseller: true,
    tags: ["bengali", "rajbhog", "saffron", "stuffed", "royal"],
    seoTitle: "Royal Bengali Rajbhog | Mahalaxmi Mithaiwala",
    seoDescription: "Order grand Rajbhogs online. Large, soft chhena spheres loaded with rich dry fruits and infused with saffron syrup."
  },
  {
    name: "Ras Kadam",
    category: "Bengali Sweets",
    description: "A multi-layered sweet with a small rasgulla at the center, coated with a soft layer of sweetened khoya, and rolled in crunchy dry poppy seeds or grated dry khoya.",
    shortDescription: "Multi-layered sweet with a mini rasgulla core coated with sweet khoya.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013590/mahalaxmi/Kheer_Kadam.jpg"],
    variants: [
      { weight: "1 Piece", price: 25, stock: 100 },
      { weight: "5 Pieces", price: 125, stock: 100 },
      { weight: "12 Pieces", price: 300, stock: 100 }
    ],
    stock: 300,
    featured: false,
    bestseller: false,
    tags: ["bengali", "raskadam", "khoya", "layered", "poppy"],
    seoTitle: "Traditional Ras Kadam Sweet | Mahalaxmi Mithaiwala",
    seoDescription: "Savor the unique layers of Ras Kadam. A juicy rasgulla shell coated in creamy khoya fudge and rolled in tiny poppy seeds."
  },
  {
    name: "Rasmalai",
    category: "Bengali Sweets",
    description: "Soft, flattened chhena discs poached in sugar syrup and soaked in thick, sweetened milk (rabri) infused with saffron, cardamom, and pistachios.",
    shortDescription: "Soft, flattened chhena discs soaked in thick, saffron-sweetened milk.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013607/mahalaxmi/Rasmalai.jpg"],
    variants: [
      { weight: "1 Piece", price: 50, stock: 100 },
      { weight: "5 Pieces", price: 250, stock: 100 },
      { weight: "10 Pieces", price: 500, stock: 100 }
    ],
    stock: 300,
    featured: true,
    bestseller: true,
    tags: ["bengali", "rasmalai", "rabri", "saffron", "milk"],
    seoTitle: "Fresh Bengali Rasmalai | Mahalaxmi Mithaiwala",
    seoDescription: "Treat yourself to fresh, velvety Rasmalai. Melt-in-the-mouth chhena discs immersed in rich, saffron-spiced milk."
  },
  {
    name: "Anguri (Bengali)",
    category: "Bengali Sweets",
    description: "Bite-sized baby rasgullas served in sweet, condensed saffron milk rabri, offering a burst of sweet milk flavor in every bite.",
    shortDescription: "Bite-sized baby rasgullas served in sweet, condensed saffron milk rabri.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013608/mahalaxmi/rosogullah.jpg"],
    variants: [
      { weight: "1 Piece", price: 60, stock: 100 },
      { weight: "5 Pieces", price: 300, stock: 100 },
      { weight: "10 Pieces", price: 600, stock: 100 }
    ],
    stock: 300,
    featured: false,
    bestseller: false,
    tags: ["bengali", "anguri", "mini", "rabri", "milk"],
    seoTitle: "Anguri Bengali Sweets Online | Mahalaxmi Mithaiwala",
    seoDescription: "Order mini Anguri sweets served in creamy, cardamom-infused saffron rabri. Perfect dessert portions."
  },
  {
    name: "Malai Sandwich",
    category: "Bengali Sweets",
    description: "A popular Bengali dessert made of flattened chhena discs sliced and sandwiched with rich, flavored khoya stuffing, decorated with pistachios and saffron threads.",
    shortDescription: "Flattened chhena discs sliced and sandwiched with rich, flavored khoya stuffing.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013583/mahalaxmi/Kesar_Malai_Sandwich.jpg"],
    variants: [
      { weight: "1 Piece", price: 50, stock: 100 },
      { weight: "5 Pieces", price: 250, stock: 100 },
      { weight: "10 Pieces", price: 500, stock: 100 }
    ],
    stock: 300,
    featured: true,
    bestseller: false,
    tags: ["bengali", "sandwich", "malai", "khoya", "stuffed"],
    seoTitle: "Delicious Malai Sandwich | Mahalaxmi Mithaiwala",
    seoDescription: "Indulge in our exquisite Malai Sandwich. Two soft chhena slices holding a luxurious layer of cardamom-scented khoya."
  },
  {
    name: "Cham Cham",
    category: "Bengali Sweets",
    description: "Traditional boat-shaped Bengali sweet made from fresh chhena, cooked in light syrup, stuffed with mawa, and rolled in desiccated coconut flakes.",
    shortDescription: "Traditional boat-shaped Bengali sweet stuffed with mawa and rolled in coconut.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013555/mahalaxmi/Chum_Chum_Reci.jpg"],
    variants: [
      { weight: "1 Piece", price: 50, stock: 100 },
      { weight: "5 Pieces", price: 250, stock: 100 },
      { weight: "10 Pieces", price: 500, stock: 100 }
    ],
    stock: 300,
    featured: false,
    bestseller: false,
    tags: ["bengali", "chamcham", "coconut", "mawa", "orange"],
    seoTitle: "Traditional Bengali Cham Cham | Mahalaxmi Mithaiwala",
    seoDescription: "Order colorful and delicious Cham Cham sweets online. Garnished with rich mawa stuffing and fine coconut flakes."
  },

  // ─── DESI GHEE SPECIALS ───
  {
    name: "Rajasthani Churma Laddu",
    category: "Desi Ghee Specials",
    description: "A rich Rajasthani delicacy made by frying whole wheat flour dumplings in pure cow ghee, crushing them coarsely, and blending with jaggery, nuts, and cardamoms before rolling into dense, flavorful laddus.",
    shortDescription: "Rich Rajasthani wheat flour laddus prepared with jaggery, nuts, and high quantities of pure cow ghee.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013554/mahalaxmi/Choorma.jpg"],
    variants: [
      { weight: "100gm", price: 60, stock: 100 },
      { weight: "250gm", price: 150, stock: 100 },
      { weight: "500gm", price: 300, stock: 100 },
      { weight: "1kg", price: 600, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: true,
    tags: ["churma", "rajasthani", "ghee", "jaggery", "wheat", "heavy"],
    seoTitle: "Pure Ghee Rajasthani Churma Laddu | Mahalaxmi Mithaiwala",
    seoDescription: "Order authentic Rajasthani Churma Laddus. Prepared using coarse wheat flour, melted jaggery, and premium cow ghee for a rich, heavy traditional flavor."
  },

  // ─── NASTA MENU: PAV ITEMS ───
  {
    name: "Samosa Pav",
    category: "Pav Items",
    description: "Crispy spiced potato samosa sandwiched in a fresh, soft pav bun with sweet tamarind chutney, spicy garlic chutney, and green chillies.",
    shortDescription: "Crispy spiced potato samosa sandwiched in a fresh, soft pav bun with traditional chutneys.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013610/mahalaxmi/Samosa_Pav.jpg"],
    variants: [
      { weight: "1 Portion", price: 25, stock: 100 }
    ],
    stock: 100,
    featured: true,
    bestseller: true,
    tags: ["samosa", "pav", "snack", "mumbai", "streetfood", "nasta"],
    seoTitle: "Mumbai Samosa Pav Online | Mahalaxmi Mithaiwala",
    seoDescription: "Order freshly prepared Mumbai style Samosa Pav online. Served hot with sweet tamarind, dry garlic, and mint chutney."
  },
  {
    name: "Vada Pav",
    category: "Pav Items",
    description: "The legendary Mumbai street food. A deep-fried spiced potato dumpling (batata vada) placed inside a soft sliced pav, layered with spicy dry garlic chutney and green chutney.",
    shortDescription: "The legendary Mumbai batata vada sandwiched in soft pav with dry garlic chutney.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013618/mahalaxmi/Vada_pav.jpg"],
    variants: [
      { weight: "1 Portion", price: 22, stock: 100 }
    ],
    stock: 100,
    featured: true,
    bestseller: true,
    tags: ["vada", "pav", "wada", "mumbai", "burger", "streetfood", "nasta"],
    seoTitle: "Authentic Mumbai Vada Pav | Mahalaxmi Mithaiwala",
    seoDescription: "Savor the taste of authentic Mumbai Vada Pav. Deep-fried spiced potato dumpling sandwiched in fresh pav with dry garlic chutney."
  },
  {
    name: "Bhajiya Pav",
    category: "Pav Items",
    description: "Freshly fried hot onion pakodas (bhajiya) stuffed inside a buttered soft pav bun, served with sweet and spicy chutneys.",
    shortDescription: "Freshly fried hot onion pakodas stuffed inside a soft pav bun with chutneys.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013551/mahalaxmi/Bhajiya_Pav_.jpg"],
    variants: [
      { weight: "1 Portion", price: 25, stock: 100 }
    ],
    stock: 100,
    featured: false,
    bestseller: false,
    tags: ["bhajiya", "pav", "onion", "pakoda", "fritters", "streetfood", "nasta"],
    seoTitle: "Crispy Bhajiya Pav Online | Mahalaxmi Mithaiwala",
    seoDescription: "Get freshly made, crispy Bhajiya Pav delivered to your doorstep. Golden onion fritters in a buttered soft bun."
  },

  // ─── NASTA MENU: SINGLE ITEMS ───
  {
    name: "Samosa",
    category: "Single Items",
    description: "Golden-crisp triangular pastry shell stuffed with a savory filling of spiced mashed potatoes, green peas, coriander, and traditional Indian spices.",
    shortDescription: "Golden-crisp triangular pastry stuffed with spiced potatoes and green peas.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013611/mahalaxmi/Samosa.jpg"],
    variants: [
      { weight: "1 Piece", price: 22, stock: 150 }
    ],
    stock: 150,
    featured: false,
    bestseller: true,
    tags: ["samosa", "potato", "crispy", "pastry", "single", "nasta"],
    seoTitle: "Crispy Golden Samosa Online | Mahalaxmi Mithaiwala",
    seoDescription: "Buy our signature golden-crisp Samosas online. Filled with perfectly spiced potatoes and green peas."
  },
  {
    name: "Vada",
    category: "Single Items",
    description: "Deep-fried spiced potato dumpling coated in a seasoned chickpea flour batter. Crispy on the outside, soft and flavorful inside.",
    shortDescription: "Deep-fried spiced potato dumpling coated in a seasoned chickpea flour batter.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013547/mahalaxmi/Batatavada.jpg"],
    variants: [
      { weight: "1 Piece", price: 18, stock: 150 }
    ],
    stock: 150,
    featured: false,
    bestseller: false,
    tags: ["vada", "batata", "potato", "dumpling", "fried", "single", "nasta"],
    seoTitle: "Classic Batata Vada Online | Mahalaxmi Mithaiwala",
    seoDescription: "Order hot, deep-fried spiced potato Batata Vadas. Made with a seasoned chickpea batter coating."
  },
  {
    name: "Bread Pakoda",
    category: "Single Items",
    description: "Classic tea-time snack featuring a spiced potato sandwich dipped in seasoned gram flour batter and deep-fried to a perfect golden finish.",
    shortDescription: "Classic tea-time snack featuring a spiced potato sandwich dipped in gram flour batter and deep-fried.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013539/mahalaxmi/Aalu_Wadi.jpg"],
    variants: [
      { weight: "1 Piece", price: 25, stock: 120 }
    ],
    stock: 120,
    featured: true,
    bestseller: false,
    tags: ["bread", "pakoda", "potato", "sandwich", "fried", "single", "nasta"],
    seoTitle: "Golden Fried Bread Pakoda | Mahalaxmi Mithaiwala",
    seoDescription: "Enjoy the perfect crunch of our Bread Pakoda. Spiced potato sandwich deep-fried in seasoned gram flour batter."
  },

  // ─── NASTA MENU: BHAJIYA & PLATES ───
  {
    name: "Mix Bhajiya Plate",
    category: "Bhajiya & Plates",
    description: "An assortment of freshly fried hot fritters including potato, onion, spinach, and green chilli bhajiya, served with sweet tamarind and spicy mint chutneys.",
    shortDescription: "An assortment of freshly fried hot fritters served with sweet and spicy chutneys.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013601/mahalaxmi/Mixed_variety_bhajiya.jpg"],
    variants: [
      { weight: "100gm", price: 35, stock: 100 },
      { weight: "250gm", price: 88, stock: 100 },
      { weight: "500gm", price: 176, stock: 100 },
      { weight: "1kg", price: 352, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: true,
    tags: ["bhajiya", "mix", "pakoda", "fritters", "plate", "assorted", "nasta"],
    seoTitle: "Assorted Mix Bhajiya Plate | Mahalaxmi Mithaiwala",
    seoDescription: "Order a piping hot Mix Bhajiya Plate. Features a crunchy variety of onion, potato, and spinach fritters served with authentic chutneys."
  },
  {
    name: "Pyaz Bhajiya",
    category: "Bhajiya & Plates",
    description: "Crispy onion fritters (kanda bhajiya) made with sliced onions, chickpea flour, green chillies, and spices, fried to a crunchy golden texture.",
    shortDescription: "Crispy onion fritters made with sliced onions, chickpea flour, and green chillies.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013557/mahalaxmi/Crispy_Onion_Bhaji.jpg"],
    variants: [
      { weight: "100gm", price: 40, stock: 100 },
      { weight: "250gm", price: 100, stock: 100 },
      { weight: "500gm", price: 200, stock: 100 },
      { weight: "1kg", price: 400, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: false,
    tags: ["bhajiya", "pyaz", "onion", "kanda", "crispy", "fritters", "nasta"],
    seoTitle: "Crispy Pyaz Kanda Bhajiya | Mahalaxmi Mithaiwala",
    seoDescription: "Buy crispy, golden Pyaz Bhajiya online. Made with thinly sliced sweet onions, seasoned gram flour, and fried fresh."
  },

  // ─── NASTA MENU: CHAAT ITEMS ───
  {
    name: "Dahi Chaat Kachori",
    category: "Chaat Items",
    description: "Crispy khasta kachori crushed and topped with boiled potatoes, chilled sweetened yogurt, tangy tamarind chutney, spicy green chutney, sev, and fresh coriander.",
    shortDescription: "Crispy khasta kachori topped with sweet yogurt, tangy chutneys, sev, and fresh coriander.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013579/mahalaxmi/kachori.jpg"],
    variants: [
      { weight: "1 Plate", price: 50, stock: 100 }
    ],
    stock: 100,
    featured: true,
    bestseller: false,
    tags: ["chaat", "kachori", "dahi", "yogurt", "streetfood", "tasty", "nasta"],
    seoTitle: "Chilled Dahi Chaat Kachori | Mahalaxmi Mithaiwala",
    seoDescription: "Treat yourself to a crunchy Dahi Chaat Kachori. Layered with sweetened yogurt, tangy chutneys, and fine sev."
  },
  {
    name: "Dahi Chaat Samosa",
    category: "Chaat Items",
    description: "Two crispy samosas crushed and layered with boiled chickpeas, fresh yogurt, sweet tamarind chutney, spicy mint-coriander chutney, sev, and pomegranate seeds.",
    shortDescription: "Two crushed samosas layered with chickpeas, fresh yogurt, chutneys, and sev.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013623/mahalaxmi/___Samosa_Chaat.jpg"],
    variants: [
      { weight: "1 Plate", price: 50, stock: 100 }
    ],
    stock: 100,
    featured: false,
    bestseller: true,
    tags: ["chaat", "samosa", "dahi", "yogurt", "chole", "streetfood", "nasta"],
    seoTitle: "Spicy Dahi Samosa Chaat | Mahalaxmi Mithaiwala",
    seoDescription: "Order mouthwatering Dahi Samosa Chaat online. Features crushed potato samosas topped with spiced chickpeas, fresh yogurt, and savory toppings."
  },

  // ─── NASTA MENU: JALEBI & FAFDA SPECIALS ───
  {
    name: "Jalebi Fafda Combo",
    category: "Jalebi & Fafda Specials",
    description: "The ultimate Sunday breakfast combination. A perfect pairing of crispy, salted chickpea flour ribbons (fafda) and hot, syrup-dripping spiral jalebis, served with raw papaya sambharo and fried green chillies.",
    shortDescription: "Perfect pairing of crispy salted fafda and hot syrup-soaked jalebi.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013615/mahalaxmi/The_Jalebi_Fafda.jpg"],
    variants: [
      { weight: "100gm Jalebi + 100gm Fafda", price: 90, stock: 100 }
    ],
    stock: 100,
    featured: true,
    bestseller: true,
    tags: ["jalebi", "fafda", "combo", "breakfast", "gujarati", "special", "nasta"],
    seoTitle: "Authentic Jalebi Fafda Combo | Mahalaxmi Mithaiwala",
    seoDescription: "Order the classic Gujarati Sunday breakfast. Features crispy salted fafda ribbons paired with hot syrup-dripping jalebis."
  },
  {
    name: "Jalebi",
    category: "Jalebi & Fafda Specials",
    description: "Crispy, golden-fried spiral dessert made from fermented batter, soaked in hot cardamom and saffron-infused sugar syrup. Served fresh and warm.",
    shortDescription: "Crispy, golden-fried spiral dessert soaked in hot cardamom saffron sugar syrup.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013578/mahalaxmi/Jalebi.jpg"],
    variants: [
      { weight: "100gm", price: 40, stock: 100 },
      { weight: "250gm", price: 100, stock: 100 },
      { weight: "500gm", price: 200, stock: 100 },
      { weight: "1kg", price: 400, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: true,
    tags: ["jalebi", "sweet", "spiral", "saffron", "syrup", "nasta"],
    seoTitle: "Hot Saffron Jalebi Online | Mahalaxmi Mithaiwala",
    seoDescription: "Get piping hot, syrup-rich Saffron Jalebis delivered. Fried to golden perfection and soaked in pure sugar syrup."
  },
  {
    name: "Fafda",
    category: "Jalebi & Fafda Specials",
    description: "Traditional crispy Gujarati snack made from premium gram flour, seasoned with carom seeds and black pepper, rolled out into thin ribbons, and fried. Served with papaya chutney.",
    shortDescription: "Traditional crispy Gujarati gram flour ribbons seasoned with carom seeds.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013568/mahalaxmi/Fafda.jpg"],
    variants: [
      { weight: "100gm", price: 50, stock: 100 },
      { weight: "250gm", price: 125, stock: 100 },
      { weight: "500gm", price: 250, stock: 100 },
      { weight: "1kg", price: 500, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: false,
    tags: ["fafda", "gujarati", "crispy", "gramflour", "snack", "nasta"],
    seoTitle: "Traditional Crispy Fafda | Mahalaxmi Mithaiwala",
    seoDescription: "Buy traditional crispy Fafda ribbons seasoned with ajwain and black pepper. Serves perfectly with raw papaya chutney."
  },

  // ─── NASTA MENU: GUJARATI SNACKS ───
  {
    name: "Khaman Dhokla",
    category: "Gujarati Snacks",
    description: "Soft, fluffy, and spongy steamed savory cakes made from fermented gram flour, tempered with mustard seeds, curry leaves, and green chillies, garnished with fresh coriander.",
    shortDescription: "Soft, fluffy, and spongy steamed savory cakes made from fermented gram flour.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013562/mahalaxmi/Dhokla______.jpg"],
    variants: [
      { weight: "100gm", price: 40, stock: 100 },
      { weight: "250gm", price: 100, stock: 100 },
      { weight: "500gm", price: 200, stock: 100 },
      { weight: "1kg", price: 400, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: true,
    tags: ["dhokla", "khaman", "steamed", "fluffy", "spongy", "gujarati", "nasta"],
    seoTitle: "Soft & Spongy Khaman Dhokla | Mahalaxmi Mithaiwala",
    seoDescription: "Order soft, freshly-steamed Khaman Dhokla. Fluffy gram flour cakes finished with a mustard and curry leaf tempering."
  },
  {
    name: "Aalu Wadi (Patra)",
    category: "Gujarati Snacks",
    description: "Traditional steamed colocasia leaves smeared with a spicy, sweet, and tangy gram flour paste, rolled up, sliced, and shallow-fried with sesame and mustard seeds.",
    shortDescription: "Steamed colocasia leaves rolled with spiced gram flour paste and shallow-fried.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013539/mahalaxmi/Aalu_Wadi.jpg"],
    variants: [
      { weight: "100gm", price: 40, stock: 100 },
      { weight: "250gm", price: 100, stock: 100 },
      { weight: "500gm", price: 200, stock: 100 },
      { weight: "1kg", price: 400, stock: 100 }
    ],
    stock: 400,
    featured: false,
    bestseller: false,
    tags: ["patra", "aluwadi", "colocasia", "steamed", "fried", "gujarati", "nasta"],
    seoTitle: "Traditional Gujarati Patra (Alu Wadi) | Mahalaxmi Mithaiwala",
    seoDescription: "Buy traditional Alu Wadi Patra online. Steamed colocasia leaf rolls stuffed with tangy chickpea paste and shallow-fried."
  },

  // ─── NASTA MENU: SWEETS ───
  {
    name: "Imarti",
    category: "Sweets",
    description: "A traditional circular flower-shaped sweet made from black gram flour (urad dal) batter, deep-fried in ghee, and soaked in cardamom-infused sugar syrup. Similar to jalebi but richer and softer.",
    shortDescription: "Traditional flower-shaped sweet made from urad dal and soaked in sugar syrup.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013576/mahalaxmi/imarti.jpg"],
    variants: [
      { weight: "100gm", price: 40, stock: 100 },
      { weight: "250gm", price: 100, stock: 100 },
      { weight: "500gm", price: 200, stock: 100 },
      { weight: "1kg", price: 400, stock: 100 }
    ],
    stock: 400,
    featured: true,
    bestseller: true,
    tags: ["imarti", "sweet", "uraddal", "flower", "ghee", "syrup", "nasta"],
    seoTitle: "Traditional Flower Imarti | Mahalaxmi Mithaiwala",
    seoDescription: "Indulge in rich, flower-shaped Imartis made with premium black gram flour and soaked in fragrant cardamom sugar syrup."
  },
  {
    name: "Mawa Kachori",
    category: "Sweets",
    description: "A decadent Rajasthani specialty. A crisp, flaky pastry crust stuffed with a rich filling of sweetened mawa (milk solids), almonds, pistachios, and cardamoms, dipped in sugar syrup.",
    shortDescription: "Decadent crisp pastry stuffed with rich sweetened mawa and dry fruits.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013598/mahalaxmi/mawa_kachori.jpg"],
    variants: [
      { weight: "1 Piece", price: 50, stock: 100 }
    ],
    stock: 100,
    featured: false,
    bestseller: true,
    tags: ["kachori", "mawa", "khoya", "sweet", "rajasthani", "royal", "nasta"],
    seoTitle: "Decadent Sweet Mawa Kachori | Mahalaxmi Mithaiwala",
    seoDescription: "Order rich, syrup-soaked Mawa Kachoris. Crisp golden pastry stuffed with a sweet milk-solid and dry fruit center."
  },
  {
    name: "Mawa Samosa",
    category: "Sweets",
    description: "A unique sweet twist on the classic samosa. Crispy pastry pockets filled with a luxurious blend of sweetened mawa, coconut flakes, cardamoms, and dry fruits, dipped in light syrup.",
    shortDescription: "Crispy sweet pastry pockets filled with sweetened mawa, coconut, and dry fruits.",
    images: ["https://res.cloudinary.com/dq5cgh8zr/image/upload/v1783013599/mahalaxmi/mawa_samosa.jpg"],
    variants: [
      { weight: "1 Piece", price: 50, stock: 100 }
    ],
    stock: 100,
    featured: false,
    bestseller: false,
    tags: ["samosa", "mawa", "sweet", "khoya", "pastry", "unique", "nasta"],
    seoTitle: "Royal Sweet Mawa Samosa | Mahalaxmi Mithaiwala",
    seoDescription: "Buy unique Mawa Samosas online. Golden pastry triangles loaded with sweet mawa fudge, coconut, and chopped nuts."
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
