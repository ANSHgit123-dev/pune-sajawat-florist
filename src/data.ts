import { Category, Product, Occasion, Review, Addon } from "./types";

// Primary category derived from our handcrafted Pune floristry designs
export const CATEGORIES: Category[] = [
  { id: "Roses", name: "Roses", image: "/public/products/media__1782144641595.jpg", count: "Pune Florist Selection" },
  { id: "Bouquets", name: "Bouquets", image: "/public/products/media__1782144641349.jpg", count: "Pune Florist Selection" },
  { id: "Anniversary Bouquets", name: "Anniversary Bouquets", image: "/public/products/media__1782144641061.jpg", count: "Pune Florist Selection" },
  { id: "Gift Hampers", name: "Gift Hampers", image: "/public/products/media__1782144641863.jpg", count: "Pune Florist Selection" }
];

// Empty addon list to avoid dummy products or stock images
export const ADDONS: Addon[] = [];

// Clean list of occasions starts empty to avoid unverified placeholders
export const OCCASIONS: Occasion[] = [];

// Clean list of products populated with the uploaded Pune Sajawat florist inventory
export const PRODUCTS: Product[] = [
  {
    id: "prod_anniversary_balloon_roses",
    name: "Golden Anniversary Balloon & Roses Bouquet",
    title: "Golden Anniversary Balloon & Roses Bouquet",
    category: "Anniversary Bouquets",
    price: 1599,
    originalPrice: 2199,
    image: "/public/products/media__1782144641061.jpg",
    images: [
      "/public/products/media__1782144641061.jpg",
      "/public/products/media__1782147134421.jpg"
    ],
    galleryImages: [
      "/public/products/media__1782144641061.jpg",
      "/public/products/media__1782147134421.jpg"
    ],
    description: "A majestic romance bouquet featuring premium deep red roses, delicate baby's breath, and a custom helium balloon stating 'Happy Anniversary' with small red balloons floating inside. Hand-tied in a dual-layered golden mesh and black paper wrapper.",
    shortDescription: "Premium red roses bouquet with a custom Happy Anniversary balloon.",
    longDescription: "Make your anniversary unforgettable with this luxurious red rose bouquet. Crafted by our master florists in Pune, it brings together freshly plucked deep red roses, elegant baby's breath fillers, and a gorgeous transparent balloon printed with 'Happy Anniversary' containing red mini-balloons. Wrapped in signature black craft paper with golden mesh and finished with a satin ribbon bow.",
    rating: 5.0,
    reviewsCount: 14,
    isBestSeller: true,
    isNew: true,
    isTrending: true,
    isRecommended: true,
    isFeatured: true,
    isEnabled: true,
    isHidden: false,
    createdAt: "2026-06-22T21:41:12+05:30",
    sku: "SKU-ANN-ROSES",
    quantity: 25,
    lowStockAlert: 3,
    deliverySettings: {
      available: true,
      charge: 0,
      sameday: true,
      fixed: true,
      night: true,
      midnight: true,
      customChargeEnabled: false,
      customCharge: 0
    },
    addons: []
  },
  {
    id: "prod_mixed_carnations_lilies",
    name: "Sweet Grace Lilies & Carnations Bouquet",
    title: "Sweet Grace Lilies & Carnations Bouquet",
    category: "Bouquets",
    price: 1299,
    originalPrice: 1799,
    image: "/public/products/media__1782144641349.jpg",
    images: [
      "/public/products/media__1782144641349.jpg",
      "/public/products/media__1782147134484.jpg"
    ],
    galleryImages: [
      "/public/products/media__1782144641349.jpg",
      "/public/products/media__1782147134484.jpg"
    ],
    description: "An exquisite presentation bouquet showing off a combination of pink roses, pristine white carnations, elegant lilies, and purple fillers wrapped in dual-toned peach-orange paper with a white and gold bow.",
    shortDescription: "A colorful, elegant mix of pink roses, white carnations, lilies, and fillers.",
    longDescription: "Brighten up any celebration with our Sweet Grace bouquet. This masterpiece merges fresh pink roses, snowy white carnations, and lilies, all wrapped meticulously in an elegant peach-orange florist sheet. It's tied with a luxurious gold-trimmed white ribbon bow. Ideal for birthdays, get-well wishes, or expressing thanks in Pune.",
    rating: 4.9,
    reviewsCount: 9,
    isBestSeller: false,
    isNew: true,
    isTrending: true,
    isRecommended: true,
    isFeatured: true,
    isEnabled: true,
    isHidden: false,
    createdAt: "2026-06-22T21:41:12+05:30",
    sku: "SKU-MIX-PEACH",
    quantity: 30,
    lowStockAlert: 5,
    deliverySettings: {
      available: true,
      charge: 0,
      sameday: true,
      fixed: true,
      night: true,
      midnight: true,
      customChargeEnabled: false,
      customCharge: 0
    },
    addons: []
  },
  {
    id: "prod_heart_shape_peach_roses",
    name: "Royal Pink Heart Rose Bouquet",
    title: "Royal Pink Heart Rose Bouquet",
    category: "Roses",
    price: 2499,
    originalPrice: 3499,
    image: "/public/products/media__1782144641595.jpg",
    images: [
      "/public/products/media__1782144641595.jpg",
      "/public/products/media__1782147134630.jpg"
    ],
    galleryImages: [
      "/public/products/media__1782144641595.jpg",
      "/public/products/media__1782147134630.jpg"
    ],
    description: "A heart-shaped luxury bouquet consisting of soft peach-pink roses, structured meticulously in layers and wrapped in layers of premium pink paper sheets with a baby pink ribbon.",
    shortDescription: "Premium heart-shaped pink roses bouquet for express delivery.",
    longDescription: "Declare your love with our signature heart-shaped peach and pink rose arrangement. Our Pune florists handcraft this luxury bouquet by grouping premium dual-tone pink roses into a perfect heart pattern. Wrapped in layers of heavy pink craft paper and completed with a satin pink ribbon. Perfect for anniversaries, birthdays, or romantic milestones.",
    rating: 5.0,
    reviewsCount: 28,
    isBestSeller: true,
    isNew: true,
    isTrending: true,
    isRecommended: true,
    isFeatured: true,
    isEnabled: true,
    isHidden: false,
    createdAt: "2026-06-22T21:41:12+05:30",
    sku: "SKU-HEART-PINK",
    quantity: 15,
    lowStockAlert: 2,
    deliverySettings: {
      available: true,
      charge: 0,
      sameday: true,
      fixed: true,
      night: true,
      midnight: true,
      customChargeEnabled: false,
      customCharge: 0
    },
    addons: []
  },
  {
    id: "prod_baby_girl_balloon_basket",
    name: "Welcome Baby Girl Celebration Hamper",
    title: "Welcome Baby Girl Celebration Hamper",
    category: "Gift Hampers",
    price: 1999,
    originalPrice: 2799,
    image: "/public/products/media__1782144641863.jpg",
    images: [
      "/public/products/media__1782144641863.jpg",
      "/public/products/media__1782147134543.jpg"
    ],
    galleryImages: [
      "/public/products/media__1782144641863.jpg",
      "/public/products/media__1782147134543.jpg"
    ],
    description: "Celebrate a newborn baby girl's arrival with a rustic wooden crate filled with pastel yellow, orange, and pink roses, a colorful unicorn balloon, and a transparent hot air balloon saying 'It's A Baby Girl'.",
    shortDescription: "Newborn celebratory balloon floral hamper in a wooden box.",
    longDescription: "The ultimate surprise to welcome a new bundle of joy. This custom arrangement features a rustic wooden crate filled with fresh pastel yellow and peach roses, mixed with colorful baby's breath. It stands below a floating transparent balloon styled as a hot air balloon saying 'It's A Baby Girl', and features an adorable unicorn rainbow balloon on the side.",
    rating: 5.0,
    reviewsCount: 11,
    isBestSeller: true,
    isNew: true,
    isTrending: false,
    isRecommended: true,
    isFeatured: true,
    isEnabled: true,
    isHidden: false,
    createdAt: "2026-06-22T21:41:12+05:30",
    sku: "SKU-BABY-GIRL",
    quantity: 12,
    lowStockAlert: 2,
    deliverySettings: {
      available: true,
      charge: 0,
      sameday: true,
      fixed: true,
      night: true,
      midnight: true,
      customChargeEnabled: false,
      customCharge: 0
    },
    addons: []
  },
  {
    id: "prod_anthurium_blue_chrysanthemum",
    name: "Iridescent Anthurium & Sky Blue Blossom Bouquet",
    title: "Iridescent Anthurium & Sky Blue Blossom Bouquet",
    category: "Bouquets",
    price: 1499,
    originalPrice: 1999,
    image: "/public/products/media__1782144641895.jpg",
    images: [
      "/public/products/media__1782144641895.jpg",
      "/public/products/media__1782147134614.jpg"
    ],
    galleryImages: [
      "/public/products/media__1782144641895.jpg",
      "/public/products/media__1782147134614.jpg"
    ],
    description: "A contemporary florist masterpiece combining striking red Anthuriums, vibrant sky blue chrysanthemums, and soft peach roses, beautifully bound in iridescent wrapping paper.",
    shortDescription: "Red Anthuriums, blue chrysanthemums, and peach roses in iridescent wrapping.",
    longDescription: "Stand out from the crowd with this modern, vibrant floral arrangement. Perfect for grand openings, congratulations, or special events in Pune. It pairs premium red Anthuriums with electric blue chrysanthemums and delicate peach-colored roses, wrapped in custom glossy iridescent film sheets that catch the light beautifully, and tied with a matching baby pink satin ribbon.",
    rating: 4.8,
    reviewsCount: 16,
    isBestSeller: false,
    isNew: true,
    isTrending: true,
    isRecommended: true,
    isFeatured: true,
    isEnabled: true,
    isHidden: false,
    createdAt: "2026-06-22T21:41:12+05:30",
    sku: "SKU-ANTH-BLUE",
    quantity: 20,
    lowStockAlert: 4,
    deliverySettings: {
      available: true,
      charge: 0,
      sameday: true,
      fixed: true,
      night: true,
      midnight: true,
      customChargeEnabled: false,
      customCharge: 0
    },
    addons: []
  }
];

export const GALLERY_ITEMS: any[] = [];


export const REVIEWS: Review[] = [];

export const WHY_CHOOSE_US = [
  {
    title: "90 Min Super Fast Delivery",
    description: "Forgot a moment? We deliver fresh arrangements rapidly straight to any door in Pune.",
    icon: "Truck"
  },
  {
    title: "100% Real Shop Images Only",
    description: "No stock photos or AI-generated fakes. What you see is exactly what our master florists hand-craft in Pune.",
    icon: "Flower2"
  },
  {
    title: "Vetted Local Florist Designers",
    description: "Over 15+ years crafting standard and custom premium bouquets and majestic stage arrangements.",
    icon: "Sparkles"
  },
  {
    title: "Easy Checkout via WhatsApp",
    description: "No complicated signups. Choose your product, customize text in 1 click, and talk directly on WhatsApp.",
    icon: "MessageSquare"
  }
];

// Delivery Pin/Area validation helper
export const PUNE_AREAS = [
  { postcode: "411014", name: "Kharadi" },
  { postcode: "411006", name: "Yerawada / Viman Nagar" },
  { postcode: "411011", name: "Koregaon Park" },
  { postcode: "411028", name: "Hadapsar" },
  { postcode: "411001", name: "Pune Station / Camp" },
  { postcode: "411045", name: "Baner" },
  { postcode: "411057", name: "Hinjawadi" },
  { postcode: "411007", name: "Aundh" },
  { postcode: "411013", name: "Magarpatta" },
  { postcode: "411036", name: "Kalyani Nagar" },
  { postcode: "411048", name: "Wanowrie / Kondhwa" },
  { postcode: "411015", name: "Dhanori" }
];

