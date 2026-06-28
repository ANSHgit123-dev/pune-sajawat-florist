import { Category, Product, Occasion, Review, Addon } from "./types";

// Primary category derived from our handcrafted Pune floristry designs
export const CATEGORIES: Category[] = [
  { id: "Roses", name: "Roses", image: "/public/products/media__1782144641595.jpg", count: "Pune Florist Selection" },
  { id: "Bouquets", name: "Bouquets", image: "/public/products/media__1782144641349.jpg", count: "Pune Florist Selection" },
  { id: "Anniversary Bouquets", name: "Anniversary Bouquets", image: "/public/products/media__1782144641061.jpg", count: "Pune Florist Selection" },
  { id: "Gift Hampers", name: "Gift Hampers", image: "/public/products/media__1782144641863.jpg", count: "Pune Florist Selection" }
];

export const ADDONS: Addon[] = [
  {
    id: "addon_kitkat",
    name: "KitKat Chocolate Bar",
    price: 40,
    image: "https://borcyrarrlbwkuisjjoj.supabase.co/storage/v1/object/public/products/addon_kitkat_1782667625259.jpg"
  },
  {
    id: "addon_snickers",
    name: "Snickers Chocolate Bar",
    price: 45,
    image: "https://borcyrarrlbwkuisjjoj.supabase.co/storage/v1/object/public/products/addon_snickers_1782667617719.jpg"
  },
  {
    id: "addon_cadbury_dairy_milk",
    name: "Cadbury Dairy Milk (Maha Pack)",
    price: 55,
    image: "https://borcyrarrlbwkuisjjoj.supabase.co/storage/v1/object/public/products/addon_cadbury_dairy_milk_1782667604485.jpg"
  },
  {
    id: "addon_ferrero_rocher",
    name: "Ferrero Rocher Gift Box (24 pcs)",
    price: 499,
    image: "https://borcyrarrlbwkuisjjoj.supabase.co/storage/v1/object/public/products/addon_ferrero_rocher_1782667632289.jpg"
  }
];

// Clean list of occasions starts empty to avoid unverified placeholders
export const OCCASIONS: Occasion[] = [];

// Clean list of products populated with the uploaded Pune Sajawat florist inventory
export const PRODUCTS: Product[] = [
  {
    "id": "prod_anniversary_balloon_roses",
    "name": "Golden Anniversary Balloon & Roses Bouquet",
    "title": "Golden Anniversary Balloon & Roses Bouquet",
    "category": "Anniversary Bouquets",
    "price": 3500,
    "originalPrice": 4000,
    "image": "/public/products/media__1782144641061.jpg",
    "images": [
      "/public/products/media__1782144641061.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782144641061.jpg"
    ],
    "description": "Premium red roses bouquet with a custom Happy Anniversary balloon.",
    "shortDescription": "Premium red roses bouquet with a custom Happy Anniversary balloon.",
    "longDescription": "Make your anniversary unforgettable with this luxurious red rose bouquet. Crafted by our master florists in Pune, it brings together freshly plucked deep red roses, elegant baby's breath fillers, and a gorgeous transparent balloon printed with 'Happy Anniversary' containing red mini-balloons. Wrapped in signature black craft paper with golden mesh and finished with a satin ribbon bow.",
    "rating": 5,
    "reviewsCount": 14,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-22T21:41:12+05:30",
    "sku": "SKU-ANN-ROSES",
    "quantity": 25,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 50
    },
    "addons": []
  },
  {
    "id": "prod_mixed_carnations_lilies",
    "name": "Sweet Grace Lilies & Carnations Bouquet",
    "title": "Sweet Grace Lilies & Carnations Bouquet",
    "category": "Bouquets",
    "price": 1299,
    "originalPrice": 1799,
    "image": "/public/products/media__1782144641349.jpg",
    "images": [
      "/public/products/media__1782144641349.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782144641349.jpg"
    ],
    "description": "A colorful, elegant mix of pink roses, white carnations, lilies, and fillers.",
    "shortDescription": "A colorful, elegant mix of pink roses, white carnations, lilies, and fillers.",
    "longDescription": "Brighten up any celebration with our Sweet Grace bouquet. This masterpiece merges fresh pink roses, snowy white carnations, and lilies, all wrapped meticulously in an elegant peach-orange florist sheet. It's tied with a luxurious gold-trimmed white ribbon bow. Ideal for birthdays, get-well wishes, or expressing thanks in Pune.",
    "rating": 4.9,
    "reviewsCount": 9,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-22T21:41:12+05:30",
    "sku": "SKU-MIX-PEACH",
    "quantity": 30,
    "lowStockAlert": 5,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 50
    },
    "addons": []
  },
  {
    "id": "prod_heart_shape_peach_roses",
    "name": "Royal Pink Heart Rose Bouquet",
    "title": "Royal Pink Heart Rose Bouquet",
    "category": "Rose Bouquets",
    "price": 5499,
    "originalPrice": 6499,
    "image": "/public/products/media__1782144641595.jpg",
    "images": [
      "/public/products/media__1782144641595.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782144641595.jpg"
    ],
    "description": "Premium heart-shaped pink roses bouquet for express delivery.",
    "shortDescription": "Premium heart-shaped pink roses bouquet for express delivery.",
    "longDescription": "Declare your love with our signature heart-shaped peach and pink rose arrangement. Our Pune florists handcraft this luxury bouquet by grouping premium dual-tone pink roses into a perfect heart pattern. Wrapped in layers of heavy pink craft paper and completed with a satin pink ribbon. Perfect for anniversaries, birthdays, or romantic milestones.",
    "rating": 5,
    "reviewsCount": 28,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-22T21:41:12+05:30",
    "sku": "SKU-HEART-PINK",
    "quantity": 15,
    "lowStockAlert": 2,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 50
    },
    "addons": []
  },
  {
    "id": "prod_baby_girl_balloon_basket",
    "name": "Welcome Baby Girl Celebration Hamper",
    "title": "Welcome Baby Girl Celebration Hamper",
    "category": "Gift Hampers",
    "price": 1999,
    "originalPrice": 2799,
    "image": "/public/products/media__1782144641863.jpg",
    "images": [
      "/public/products/media__1782144641863.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782144641863.jpg"
    ],
    "description": "Celebrate a newborn baby girl's arrival with a rustic wooden crate filled with pastel yellow, orange, and pink roses, a colorful unicorn balloon, and a transparent hot air balloon saying 'It's A Baby Girl'.",
    "shortDescription": "Newborn celebratory balloon floral hamper in a wooden box.",
    "longDescription": "The ultimate surprise to welcome a new bundle of joy. This custom arrangement features a rustic wooden crate filled with fresh pastel yellow and peach roses, mixed with colorful baby's breath. It stands below a floating transparent balloon styled as a hot air balloon saying 'It's A Baby Girl', and features an adorable unicorn rainbow balloon on the side.",
    "rating": 5,
    "reviewsCount": 11,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": false,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-22T21:41:12+05:30",
    "sku": "SKU-BABY-GIRL",
    "quantity": 12,
    "lowStockAlert": 2,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_anthurium_blue_chrysanthemum",
    "name": "Iridescent Anthurium & Sky Blue Blossom Bouquet",
    "title": "Iridescent Anthurium & Sky Blue Blossom Bouquet",
    "category": "Bouquets",
    "price": 1499,
    "originalPrice": 1999,
    "image": "/public/products/media__1782144641895.jpg",
    "images": [
      "/public/products/media__1782144641895.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782144641895.jpg"
    ],
    "description": "A contemporary florist masterpiece combining striking red Anthuriums, vibrant sky blue chrysanthemums, and soft peach roses, beautifully bound in iridescent wrapping paper.",
    "shortDescription": "Red Anthuriums, blue chrysanthemums, and peach roses in iridescent wrapping.",
    "longDescription": "Stand out from the crowd with this modern, vibrant floral arrangement. Perfect for grand openings, congratulations, or special events in Pune. It pairs premium red Anthuriums with electric blue chrysanthemums and delicate peach-colored roses, wrapped in custom glossy iridescent film sheets that catch the light beautifully, and tied with a matching baby pink satin ribbon.",
    "rating": 4.8,
    "reviewsCount": 16,
    "isBestSeller": false,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-22T21:41:12+05:30",
    "sku": "SKU-ANTH-BLUE",
    "quantity": 20,
    "lowStockAlert": 4,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_1782154509589_507_rustic_meadow_serenade_bouquet",
    "name": "Rustic Meadow Serenade Bouquet",
    "title": "Rustic Meadow Serenade Bouquet",
    "category": "Bouquets",
    "price": 1249,
    "originalPrice": 1699,
    "image": "/public/products/media__1782154089584-1782154491893.jpg",
    "images": [
      "/public/products/media__1782154089584-1782154491893.jpg",
      "/public/products/media__1782154089816-1782154492028.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782154089584-1782154491893.jpg",
      "/public/products/media__1782154089816-1782154492028.jpg"
    ],
    "description": "Experience the serene beauty of the Rustic Meadow Serenade Bouquet. This exquisite arrangement features a delightful blend of vibrant purples, soft pinks, and pristine white flowers, accented with unique feathery greens. Expertly hand-tied and enveloped in a crinkled brown rustic paper with a delicate white ribbon, it's an ideal choice for conveying warmth and natural charm on any special occasion.",
    "shortDescription": "A charming mix of seasonal blooms wrapped in rustic elegance, perfect for adding a touch of nature's beauty to any moment.",
    "longDescription": "Experience the serene beauty of the Rustic Meadow Serenade Bouquet. This exquisite arrangement features a delightful blend of vibrant purples, soft pinks, and pristine white flowers, accented with unique feathery greens. Expertly hand-tied and enveloped in a crinkled brown rustic paper with a delicate white ribbon, it's an ideal choice for conveying warmth and natural charm on any special occasion.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T18:55:09.621Z"
  },
  {
    "id": "prod_1782154509592_973_ethereal_dawn_bloom_bouquet",
    "name": "Ethereal Dawn Bloom Bouquet",
    "title": "Ethereal Dawn Bloom Bouquet",
    "category": "Bouquets",
    "price": 1349,
    "originalPrice": 1849,
    "image": "/public/products/media__1782154089683-1782154491946.jpg",
    "images": [
      "/public/products/media__1782154089683-1782154491946.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782154089683-1782154491946.jpg"
    ],
    "description": "Immerse yourself in the gentle charm of the Ethereal Dawn Bloom Bouquet. This captivating arrangement showcases exquisite pink lilies, tender roses, and other delicate blossoms in a palette of soft peaches and creams. Elegantly wrapped in layered, blush-toned paper and tied with a shimmering gold ribbon, it's a sublime expression of tenderness and refined beauty, perfect for a heartfelt gesture.",
    "shortDescription": "A delicate harmony of soft pastels and fresh blooms, wrapped in a chic, pleated design for graceful gifting.",
    "longDescription": "Immerse yourself in the gentle charm of the Ethereal Dawn Bloom Bouquet. This captivating arrangement showcases exquisite pink lilies, tender roses, and other delicate blossoms in a palette of soft peaches and creams. Elegantly wrapped in layered, blush-toned paper and tied with a shimmering gold ribbon, it's a sublime expression of tenderness and refined beauty, perfect for a heartfelt gesture.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T18:55:09.621Z"
  },
  {
    "id": "prod_1782154509592_874_enchanted_garden_bliss_bouquet",
    "name": "Enchanted Garden Bliss Bouquet",
    "title": "Enchanted Garden Bliss Bouquet",
    "category": "Bouquets",
    "price": 2299,
    "originalPrice": 3199,
    "image": "/public/products/media__1782154089800-1782154492006.jpg",
    "images": [
      "/public/products/media__1782154089800-1782154492006.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782154089800-1782154492006.jpg"
    ],
    "description": "Discover the captivating allure of the Enchanted Garden Bliss Bouquet. This lively arrangement features a stunning medley of graceful pink lilies, charming blue chrysanthemums, soft peach roses, and a selection of complementary seasonal blooms. Expertly arranged and stylishly wrapped in a beautiful combination of white and vibrant pink paper with a golden ribbon, it’s a perfect gift to celebrate joy, friendship, or any special occasion with a burst of color.",
    "shortDescription": "A vibrant symphony of pink lilies, blue chrysanthemums, and peach roses, wrapped in joyful pink elegance.",
    "longDescription": "Discover the captivating allure of the Enchanted Garden Bliss Bouquet. This lively arrangement features a stunning medley of graceful pink lilies, charming blue chrysanthemums, soft peach roses, and a selection of complementary seasonal blooms. Expertly arranged and stylishly wrapped in a beautiful combination of white and vibrant pink paper with a golden ribbon, it’s a perfect gift to celebrate joy, friendship, or any special occasion with a burst of color.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T18:55:09.621Z"
  },
  {
    "id": "prod_1782155283805_563_golden_radiance_sunflower___rose_embrace",
    "name": "Golden Radiance Sunflower & Rose Embrace",
    "title": "Golden Radiance Sunflower & Rose Embrace",
    "category": "Bouquets",
    "price": 1999,
    "originalPrice": 2699,
    "image": "/public/products/media__1782155137024-1782155262524.jpg",
    "images": [
      "/public/products/media__1782155137024-1782155262524.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782155137024-1782155262524.jpg"
    ],
    "description": "Celebrate life's precious moments with this stunning bouquet featuring the cheerful glow of sunflowers intertwined with the deep passion of red roses. Expertly arranged and wrapped in elegant, rustic paper, this captivating floral gift is perfect for expressing joy, admiration, and heartfelt emotions on any special occasion.",
    "shortDescription": "A vibrant fusion of sunny sunflowers and passionate red roses, beautifully wrapped to convey warmth and affection.",
    "longDescription": "Celebrate life's precious moments with this stunning bouquet featuring the cheerful glow of sunflowers intertwined with the deep passion of red roses. Expertly arranged and wrapped in elegant, rustic paper, this captivating floral gift is perfect for expressing joy, admiration, and heartfelt emotions on any special occasion.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:08:03.830Z"
  },
  {
    "id": "prod_1782155283810_367_the_grand_scarlet_romance_rose_bouquet",
    "name": "The Grand Scarlet Romance Rose Bouquet",
    "title": "The Grand Scarlet Romance Rose Bouquet",
    "category": "Rose Bouquets",
    "price": 3499,
    "originalPrice": 4725,
    "image": "/public/products/media__1782155137059-1782155262553.jpg",
    "images": [
      "/public/products/media__1782155137059-1782155262553.jpg",
      "/public/products/media__1782154089701-1782154491979.jpg",
      "/public/products/media__1782156399050-1782156479706.jpg",
      "/public/products/media__1782192638197-1782193015018.jpg",
      "/public/products/media__1782195631343-1782195640002.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782154089701-1782154491979.jpg",
      "/public/products/media__1782156399050-1782156479706.jpg",
      "/public/products/media__1782192638197-1782193015018.jpg",
      "/public/products/media__1782195631343-1782195640002.jpg"
    ],
    "description": "Declare your deepest affections with 'The Grand Scarlet Romance', a breathtaking bouquet featuring a lavish collection of premium red roses. Each bloom is perfectly complemented by ethereal baby's breath, all elegantly encased in sophisticated black and gold wrapping. This magnificent arrangement is the ultimate gesture of passionate love and devotion for anniversaries or grand romantic statements.",
    "shortDescription": "An opulent display of dozens of pristine red roses, accented with delicate baby's breath, embodying timeless love and luxury.",
    "longDescription": "Declare your deepest affections with 'The Grand Scarlet Romance', a breathtaking bouquet featuring a lavish collection of premium red roses. Each bloom is perfectly complemented by ethereal baby's breath, all elegantly encased in sophisticated black and gold wrapping. This magnificent arrangement is the ultimate gesture of passionate love and devotion for anniversaries or grand romantic statements.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:08:03.830Z"
  },
  {
    "id": "prod_1782155283810_859_serene_bloom_harmony_bouquet",
    "name": "Serene Bloom Harmony Bouquet",
    "title": "Serene Bloom Harmony Bouquet",
    "category": "Bouquets",
    "price": 1299,
    "originalPrice": 1750,
    "image": "/public/products/media__1782155137135-1782155262570.jpg",
    "images": [
      "/public/products/media__1782155137135-1782155262570.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782155137135-1782155262570.jpg"
    ],
    "description": "Discover the delicate charm of the Serene Bloom Harmony Bouquet, a delightful arrangement featuring budding lilies and a gentle mix of colourful blossoms. Wrapped in serene blue and soft gold paper with a vibrant green bow, this charming bouquet exudes understated elegance. It's an ideal choice for expressing sympathy, gratitude, or simply brightening someone's day with its peaceful beauty.",
    "shortDescription": "A delicate mix of enchanting blooms and elegant lilies, artfully wrapped in pastel hues, perfect for gentle gestures.",
    "longDescription": "Discover the delicate charm of the Serene Bloom Harmony Bouquet, a delightful arrangement featuring budding lilies and a gentle mix of colourful blossoms. Wrapped in serene blue and soft gold paper with a vibrant green bow, this charming bouquet exudes understated elegance. It's an ideal choice for expressing sympathy, gratitude, or simply brightening someone's day with its peaceful beauty.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:08:03.830Z"
  },
  {
    "id": "prod_1782155283811_567_radiant_duo_rose___lily_symphony",
    "name": "Radiant Duo Rose & Lily Symphony",
    "title": "Radiant Duo Rose & Lily Symphony",
    "category": "Bouquets",
    "price": 1799,
    "originalPrice": 2430,
    "image": "/public/products/media__1782155137232-1782155262593.jpg",
    "images": [
      "/public/products/media__1782155137232-1782155262593.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782155137232-1782155262593.jpg"
    ],
    "description": "Ignite joy with the Radiant Duo Rose & Lily Symphony, an exquisite bouquet showcasing the perfect harmony of passionate red and sunny yellow roses. Complemented by elegant lily buds and delicate baby's breath, this arrangement is beautifully presented in striking black and white paper with a luxurious ribbon. It’s an unforgettable gift for anniversaries, birthdays, or any moment deserving of grand celebration.",
    "shortDescription": "A captivating blend of fiery red and cheerful yellow roses, accented with lilies, creating a truly majestic floral statement.",
    "longDescription": "Ignite joy with the Radiant Duo Rose & Lily Symphony, an exquisite bouquet showcasing the perfect harmony of passionate red and sunny yellow roses. Complemented by elegant lily buds and delicate baby's breath, this arrangement is beautifully presented in striking black and white paper with a luxurious ribbon. It’s an unforgettable gift for anniversaries, birthdays, or any moment deserving of grand celebration.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:08:03.830Z"
  },
  {
    "id": "prod_1782155283811_209_enchanted_garden_love_hamper",
    "name": "Enchanted Garden Love Hamper",
    "title": "Enchanted Garden Love Hamper",
    "category": "Gift Hampers",
    "price": 3999,
    "originalPrice": 5400,
    "image": "/public/products/media__1782155137243-1782155262629.jpg",
    "images": [
      "/public/products/media__1782155137243-1782155262629.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782155137243-1782155262629.jpg"
    ],
    "description": "Present an unforgettable gesture of affection with the Enchanted Garden Love Hamper. This luxurious arrangement combines vibrant roses, chrysanthemums, exotic bird of paradise, and feathery pampas grass, all nestled in a chic container. Crowned with a shimmering rose gold heart balloon, it’s a truly magnificent gift designed to sweep your loved one off their feet for anniversaries, proposals, or grand declarations of love.",
    "shortDescription": "An extravagant floral basket bursting with diverse blooms, exotic accents, pampas grass, and a loving heart balloon.",
    "longDescription": "Present an unforgettable gesture of affection with the Enchanted Garden Love Hamper. This luxurious arrangement combines vibrant roses, chrysanthemums, exotic bird of paradise, and feathery pampas grass, all nestled in a chic container. Crowned with a shimmering rose gold heart balloon, it’s a truly magnificent gift designed to sweep your loved one off their feet for anniversaries, proposals, or grand declarations of love.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:08:03.830Z"
  },
  {
    "id": "prod_1782156229549_53_crimson_elegance_bloom_box",
    "name": "Crimson Elegance Bloom Box",
    "title": "Crimson Elegance Bloom Box",
    "category": "Flower Baskets",
    "price": 1899,
    "originalPrice": 2550,
    "image": "/public/products/media__1782156137000-1782156210986.jpg",
    "images": [
      "/public/products/media__1782156137000-1782156210986.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156137000-1782156210986.jpg"
    ],
    "description": "Celebrate special moments with our Crimson Elegance Bloom Box, a luxurious display featuring rich red roses symbolizing deep love and passion. Accompanied by the graceful, fragrant tuberose and delicate baby's breath, this exquisite arrangement is presented in a modern, textured black gift box, making it an unforgettable gift for any cherished occasion.",
    "shortDescription": "A breathtaking arrangement of vibrant red roses and fragrant tuberose, nestled in a chic black box, radiating timeless elegance.",
    "longDescription": "Celebrate special moments with our Crimson Elegance Bloom Box, a luxurious display featuring rich red roses symbolizing deep love and passion. Accompanied by the graceful, fragrant tuberose and delicate baby's breath, this exquisite arrangement is presented in a modern, textured black gift box, making it an unforgettable gift for any cherished occasion.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:23:49.611Z"
  },
  {
    "id": "prod_1782156229566_292_radiant_sunbeam_sunflower_bouquet",
    "name": "Radiant Sunbeam Sunflower Bouquet",
    "title": "Radiant Sunbeam Sunflower Bouquet",
    "category": "Bouquets",
    "price": 1499,
    "originalPrice": 2000,
    "image": "/public/products/media__1782156137043-1782156211021.jpg",
    "images": [
      "/public/products/media__1782156137043-1782156211021.jpg",
      "/public/products/media__1782194011085-1782194077863.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782194011085-1782194077863.jpg"
    ],
    "description": "Brighten anyone's day with the Radiant Sunbeam Sunflower Bouquet, an exuberant arrangement of fresh, golden sunflowers. Expertly crafted and wrapped in luxurious purple and gold paper, this bouquet is accented with delicate white filler flowers, creating a truly uplifting gift. Perfect for birthdays, celebrations, or simply to spread warmth and positivity.",
    "shortDescription": "A vibrant bouquet of cheerful sunflowers, wrapped in regal purple, symbolizing joy, adoration, and enduring happiness.",
    "longDescription": "Brighten anyone's day with the Radiant Sunbeam Sunflower Bouquet, an exuberant arrangement of fresh, golden sunflowers. Expertly crafted and wrapped in luxurious purple and gold paper, this bouquet is accented with delicate white filler flowers, creating a truly uplifting gift. Perfect for birthdays, celebrations, or simply to spread warmth and positivity.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:23:49.612Z"
  },
  {
    "id": "prod_1782156229566_503_blissful_blossom_tote",
    "name": "Blissful Blossom Tote",
    "title": "Blissful Blossom Tote",
    "category": "Flower Baskets",
    "price": 1699,
    "originalPrice": 2290,
    "image": "/public/products/media__1782156137204-1782156211058.jpg",
    "images": [
      "/public/products/media__1782156137204-1782156211058.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156137204-1782156211058.jpg"
    ],
    "description": "Indulge in the vibrant charm of our Blissful Blossom Tote, an enchanting arrangement brimming with fresh, multi-colored flowers. Featuring elegant white lilies, cheerful blue and white chrysanthemums, and delicate pink carnations, all nestled in a chic quilted pink bag with handles. This delightful floral tote is a perfect gift to express joy and affection on any celebratory occasion.",
    "shortDescription": "A charming mix of colorful blooms including lilies, chrysanthemums, and carnations, presented in a stylish pink tote.",
    "longDescription": "Indulge in the vibrant charm of our Blissful Blossom Tote, an enchanting arrangement brimming with fresh, multi-colored flowers. Featuring elegant white lilies, cheerful blue and white chrysanthemums, and delicate pink carnations, all nestled in a chic quilted pink bag with handles. This delightful floral tote is a perfect gift to express joy and affection on any celebratory occasion.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:23:49.612Z"
  },
  {
    "id": "prod_1782156229566_187_summer_sunshine___grace_bouquet",
    "name": "Summer Sunshine & Grace Bouquet",
    "title": "Summer Sunshine & Grace Bouquet",
    "category": "Bouquets",
    "price": 2199,
    "originalPrice": 2950,
    "image": "/public/products/media__1782156137301-1782156211075.jpg",
    "images": [
      "/public/products/media__1782156137301-1782156211075.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156137301-1782156211075.jpg"
    ],
    "description": "Capture the essence of joyful celebrations with the Summer Sunshine & Grace Bouquet. This captivating arrangement features bright sunflowers symbolizing adoration, complemented by the serene beauty of white lilies, delicate purple filler flowers, and crisp white chrysanthemums. Expertly wrapped in stylish paper with a touch of shimmer and a decorative butterfly, it's an ideal gift to convey warmth and elegance.",
    "shortDescription": "A magnificent bouquet blending vibrant sunflowers, elegant lilies, and delicate chrysanthemums, adorned with a whimsical butterfly.",
    "longDescription": "Capture the essence of joyful celebrations with the Summer Sunshine & Grace Bouquet. This captivating arrangement features bright sunflowers symbolizing adoration, complemented by the serene beauty of white lilies, delicate purple filler flowers, and crisp white chrysanthemums. Expertly wrapped in stylish paper with a touch of shimmer and a decorative butterfly, it's an ideal gift to convey warmth and elegance.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:23:49.614Z"
  },
  {
    "id": "prod_1782156229566_592_romantic_blush_serenade_bouquet",
    "name": "Romantic Blush Serenade Bouquet",
    "title": "Romantic Blush Serenade Bouquet",
    "category": "Bouquets",
    "price": 1999,
    "originalPrice": 2700,
    "image": "/public/products/media__1782156137367-1782156211102.jpg",
    "images": [
      "/public/products/media__1782156137367-1782156211102.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156137367-1782156211102.jpg"
    ],
    "description": "Express your deepest sentiments with the Romantic Blush Serenade Bouquet. This exquisite arrangement combines the timeless passion of red roses, the serene elegance of white lilies, and the tender charm of pink chrysanthemums and delicate filler flowers. Artfully wrapped in soft pastel blue and golden paper, tied with a vibrant bow, it's a perfect gift to convey love, admiration, and heartfelt wishes.",
    "shortDescription": "An enchanting mix of red roses, elegant lilies, and soft chrysanthemums, beautifully wrapped for a truly romantic gesture.",
    "longDescription": "Express your deepest sentiments with the Romantic Blush Serenade Bouquet. This exquisite arrangement combines the timeless passion of red roses, the serene elegance of white lilies, and the tender charm of pink chrysanthemums and delicate filler flowers. Artfully wrapped in soft pastel blue and golden paper, tied with a vibrant bow, it's a perfect gift to convey love, admiration, and heartfelt wishes.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:23:49.615Z"
  },
  {
    "id": "prod_1782156502875_859_enchanting_pink_lily___rose_serenity_bouquet",
    "name": "Enchanting Pink Lily & Rose Serenity Bouquet",
    "title": "Enchanting Pink Lily & Rose Serenity Bouquet",
    "category": "Bouquets",
    "price": 1699,
    "originalPrice": 2299,
    "image": "/public/products/media__1782156398757-1782156479582.jpg",
    "images": [
      "/public/products/media__1782156398757-1782156479582.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156398757-1782156479582.jpg"
    ],
    "description": "Discover profound elegance with this enchanting bouquet, featuring vibrant pink lilies, pristine white and yellow roses, and cheerful white chrysanthemums. Adorned with delicate baby's breath and lush greens, it’s artfully wrapped in rich brown and floral paper. Perfect for expressing heartfelt emotions on any special occasion.",
    "shortDescription": "A captivating blend of pink lilies, delicate roses, and chrysanthemums, wrapped in elegant floral paper, conveying pure serenity.",
    "longDescription": "Discover profound elegance with this enchanting bouquet, featuring vibrant pink lilies, pristine white and yellow roses, and cheerful white chrysanthemums. Adorned with delicate baby's breath and lush greens, it’s artfully wrapped in rich brown and floral paper. Perfect for expressing heartfelt emotions on any special occasion.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:28:22.938Z"
  },
  {
    "id": "prod_1782156502885_909_romantic_ruby_red_anniversary_rose_delight",
    "name": "Romantic Ruby Red Anniversary Rose Delight",
    "title": "Romantic Ruby Red Anniversary Rose Delight",
    "category": "Anniversary Bouquets",
    "price": 3499,
    "originalPrice": 4729,
    "image": "/public/products/media__1782156398789-1782156479641.jpg",
    "images": [
      "/public/products/media__1782156398789-1782156479641.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156398789-1782156479641.jpg"
    ],
    "description": "Celebrate your timeless love with this breathtaking anniversary bouquet. Fifty opulent ruby red roses are expertly arranged and adorned with delicate baby's breath, all elegantly wrapped in black and gold. The stunning 'Happy Anniversary' bubble balloon adds a unique, festive touch, making it a perfect symbol of enduring affection.",
    "shortDescription": "A grand bouquet of fifty ruby red roses, exquisitely wrapped, crowned with a 'Happy Anniversary' bubble balloon for your beloved.",
    "longDescription": "Celebrate your timeless love with this breathtaking anniversary bouquet. Fifty opulent ruby red roses are expertly arranged and adorned with delicate baby's breath, all elegantly wrapped in black and gold. The stunning 'Happy Anniversary' bubble balloon adds a unique, festive touch, making it a perfect symbol of enduring affection.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:28:22.938Z"
  },
  {
    "id": "prod_1782156502885_142_vibrant_sunshine_bloom_fusion_bouquet",
    "name": "Vibrant Sunshine Bloom Fusion Bouquet",
    "title": "Vibrant Sunshine Bloom Fusion Bouquet",
    "category": "Bouquets",
    "price": 1799,
    "originalPrice": 2429,
    "image": "/public/products/media__1782156399003-1782156479668.jpg",
    "images": [
      "/public/products/media__1782156399003-1782156479668.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156399003-1782156479668.jpg"
    ],
    "description": "Brighten any day with this vibrant and cheerful bouquet, featuring bold sunflowers, elegant lilies, lush pink carnations, and gentle white roses. Enhanced with delicate baby's breath and greens, this arrangement is artfully wrapped in modern lavender and shimmering gold paper, making it an exquisite gift for joy and celebration.",
    "shortDescription": "A cheerful medley of radiant sunflowers, delicate lilies, carnations, and roses, beautifully presented in striking lavender and gold.",
    "longDescription": "Brighten any day with this vibrant and cheerful bouquet, featuring bold sunflowers, elegant lilies, lush pink carnations, and gentle white roses. Enhanced with delicate baby's breath and greens, this arrangement is artfully wrapped in modern lavender and shimmering gold paper, making it an exquisite gift for joy and celebration.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:28:22.939Z"
  },
  {
    "id": "prod_1782156502885_517_blissful_birthday_pink_lily_floral_dome",
    "name": "Blissful Birthday Pink Lily Floral Dome",
    "title": "Blissful Birthday Pink Lily Floral Dome",
    "category": "Birthday Bouquets",
    "price": 2499,
    "originalPrice": 3379,
    "image": "/public/products/media__1782156399190-1782156479725.jpg",
    "images": [
      "/public/products/media__1782156399190-1782156479725.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156399190-1782156479725.jpg"
    ],
    "description": "Celebrate a special birthday with this exquisite floral arrangement, showcasing elegant pink lilies and charming chrysanthemums, nestled amongst delicate baby's breath. The centerpiece is a clear 'Happy Birthday' bubble dome, adding a personalized and festive touch. A truly unique and heartwarming gift to make their day unforgettable.",
    "shortDescription": "A delightful birthday floral arrangement featuring pink lilies and chrysanthemums, topped with a 'Happy Birthday' bubble dome.",
    "longDescription": "Celebrate a special birthday with this exquisite floral arrangement, showcasing elegant pink lilies and charming chrysanthemums, nestled amongst delicate baby's breath. The centerpiece is a clear 'Happy Birthday' bubble dome, adding a personalized and festive touch. A truly unique and heartwarming gift to make their day unforgettable.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:28:22.941Z"
  },
  {
    "id": "prod_1782156776882_717_crimson_charm_rose___chrysanthemum_bouquet",
    "name": "Crimson Charm Rose & Chrysanthemum Bouquet",
    "title": "Crimson Charm Rose & Chrysanthemum Bouquet",
    "category": "Rose Bouquets",
    "price": 1799,
    "originalPrice": 2499,
    "image": "/public/products/media__1782156660991-1782156751902.jpg",
    "images": [
      "/public/products/media__1782156660991-1782156751902.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156660991-1782156751902.jpg"
    ],
    "description": "Vibrant pink roses and fresh green chrysanthemums intertwine, creating a captivating bouquet of joyous hues, elegantly presented.",
    "shortDescription": "Vibrant pink roses and fresh green chrysanthemums intertwine, creating a captivating bouquet of joyous hues, elegantly presented.",
    "longDescription": "Unveil the 'Crimson Charm,' a delightful rose bouquet that perfectly blends the vivacious spirit of bright pink roses with the refreshing vibrancy of green chrysanthemums. Adorned with delicate purple fillers and wrapped in chic white and pink paper with subtle gold accents, this arrangement is tied with a charming purple and green bow, ideal for conveying heartfelt emotions.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:32:56.908Z"
  },
  {
    "id": "prod_1782156776882_37_radiant_sunflower_serenade_bouquet",
    "name": "Radiant Sunflower Serenade Bouquet",
    "title": "Radiant Sunflower Serenade Bouquet",
    "category": "Bouquets",
    "price": 1599,
    "originalPrice": 2199,
    "image": "/public/products/media__1782156661065-1782156751924.jpg",
    "images": [
      "/public/products/media__1782156661065-1782156751924.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156661065-1782156751924.jpg"
    ],
    "description": "Experience pure sunshine with this vibrant bouquet of cheerful sunflowers, elegantly arranged with lush greenery and delicate accents.",
    "shortDescription": "Experience pure sunshine with this vibrant bouquet of cheerful sunflowers, elegantly arranged with lush greenery and delicate accents.",
    "longDescription": "Embrace the warmth of the 'Radiant Sunflower Serenade,' a captivating bouquet showcasing the majestic beauty of bright sunflowers. Artfully combined with lush green foliage and subtle pink fillers, this arrangement is thoughtfully wrapped in rustic brown and soft pink paper, making it a perfect gift to brighten anyone's day and spread happiness.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:32:56.912Z"
  },
  {
    "id": "prod_1782156776882_620_monochrome_elegance_chocolate_delight_hamper",
    "name": "Monochrome Elegance Chocolate Delight Hamper",
    "title": "Monochrome Elegance Chocolate Delight Hamper",
    "category": "Gift Hampers",
    "price": 1799,
    "originalPrice": 2499,
    "image": "/public/products/media__1782156661156-1782156751963.jpg",
    "images": [
      "/public/products/media__1782156661156-1782156751963.jpg",
      "/public/products/media__1782194857061-1782194881005.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782194857061-1782194881005.jpg"
    ],
    "description": "A sophisticated collection of Cadbury Dairy Milk and Ferrero Rocher chocolates, exquisitely presented in a stylish checkered hamper.",
    "shortDescription": "A sophisticated collection of Cadbury Dairy Milk and Ferrero Rocher chocolates, exquisitely presented in a stylish checkered hamper.",
    "longDescription": "Presenting the 'Monochrome Elegance Chocolate Delight Hamper,' a refined selection for the discerning chocolate lover. This luxurious basket features an generous array of classic Cadbury Dairy Milk bars paired with the rich, nutty indulgence of Ferrero Rocher. Housed in a striking black and white checkered bag and adorned with a shimmering silver bow, it’s an impeccable gift for any celebration.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:32:56.912Z"
  },
  {
    "id": "prod_1782157052243_20_sweet_indulgence_symphony",
    "name": "Sweet Indulgence Symphony",
    "title": "Sweet Indulgence Symphony",
    "category": "Chocolate Bouquets",
    "price": 1699,
    "originalPrice": 2299,
    "image": "/public/products/media__1782156941777-1782157027869.jpg",
    "images": [
      "/public/products/media__1782156941777-1782157027869.jpg",
      "/public/products/media__1782156661154-1782156751945.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156661154-1782156751945.jpg"
    ],
    "description": "Presenting the \"Sweet Indulgence Symphony,\" a beautifully arranged collection of Cadbury Dairy Milk Silk, classic Dairy Milk, Borneville, and exquisite gold-wrapped chocolates. Housed in a chic pink quilted bag with an elegant ribbon, this chocolate bouquet is the perfect gesture of affection and celebration, ensuring pure delight with every bite.",
    "shortDescription": "A luxurious pink basket overflowing with premium Cadbury chocolates, a delightful treat for every special moment.",
    "longDescription": "Presenting the \"Sweet Indulgence Symphony,\" a beautifully arranged collection of Cadbury Dairy Milk Silk, classic Dairy Milk, Borneville, and exquisite gold-wrapped chocolates. Housed in a chic pink quilted bag with an elegant ribbon, this chocolate bouquet is the perfect gesture of affection and celebration, ensuring pure delight with every bite.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:37:32.292Z"
  },
  {
    "id": "prod_1782157052254_762_radiant_sparkle_blooms_basket",
    "name": "Radiant Sparkle Blooms Basket",
    "title": "Radiant Sparkle Blooms Basket",
    "category": "Flower Baskets",
    "price": 2199,
    "originalPrice": 2975,
    "image": "/public/products/media__1782156941833-1782157027905.jpg",
    "images": [
      "/public/products/media__1782156941833-1782157027905.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156941833-1782157027905.jpg"
    ],
    "description": "Celebrate milestones with the \"Radiant Sparkle Blooms Basket,\" a breathtaking arrangement featuring cheerful sunflowers, romantic red and pink roses, elegant lilies, and delicate baby's breath. Presented in a sophisticated black basket adorned with sparkling details and a charming butterfly, this basket is an ideal gift for anniversaries, birthdays, or to simply brighten someone's day with its radiant charm.",
    "shortDescription": "A vibrant medley of sunflowers, roses, and lilies in a dazzling black sparkling basket, celebrating joy and beauty.",
    "longDescription": "Celebrate milestones with the \"Radiant Sparkle Blooms Basket,\" a breathtaking arrangement featuring cheerful sunflowers, romantic red and pink roses, elegant lilies, and delicate baby's breath. Presented in a sophisticated black basket adorned with sparkling details and a charming butterfly, this basket is an ideal gift for anniversaries, birthdays, or to simply brighten someone's day with its radiant charm.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:37:32.293Z"
  },
  {
    "id": "prod_1782157052254_275_velvet_dream_chocolate_delight",
    "name": "Velvet Dream Chocolate Delight",
    "title": "Velvet Dream Chocolate Delight",
    "category": "Chocolate Bouquets",
    "price": 1599,
    "originalPrice": 2165,
    "image": "/public/products/media__1782156941920-1782157027950.jpg",
    "images": [
      "/public/products/media__1782156941920-1782157027950.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156941920-1782157027950.jpg"
    ],
    "description": "Indulge in the \"Velvet Dream Chocolate Delight,\" a splendid assortment of rich Cadbury Dairy Milk Silk, intense Bournville, and classic Dairy Milk chocolates. Elegantly arranged in a lavender-hued bag with charming polka-dot ribbon, this chocolate bouquet is a sophisticated treat. It promises a cascade of flavors, making it an exquisite gift for chocolate connoisseurs and celebrations alike.",
    "shortDescription": "An enchanting purple hamper filled with Cadbury Silk, Bournville, and Dairy Milk, a perfect indulgence.",
    "longDescription": "Indulge in the \"Velvet Dream Chocolate Delight,\" a splendid assortment of rich Cadbury Dairy Milk Silk, intense Bournville, and classic Dairy Milk chocolates. Elegantly arranged in a lavender-hued bag with charming polka-dot ribbon, this chocolate bouquet is a sophisticated treat. It promises a cascade of flavors, making it an exquisite gift for chocolate connoisseurs and celebrations alike.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:37:32.293Z"
  },
  {
    "id": "prod_1782157052254_128_golden_radiance_hand_tied_bouquet",
    "name": "Golden Radiance Hand Tied Bouquet",
    "title": "Golden Radiance Hand Tied Bouquet",
    "category": "Bouquets",
    "price": 1899,
    "originalPrice": 2569,
    "image": "/public/products/media__1782156941996-1782157028016.jpg",
    "images": [
      "/public/products/media__1782156941996-1782157028016.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782156941996-1782157028016.jpg"
    ],
    "description": "Embrace the warmth of nature with our \"Golden Radiance Hand-Tied Bouquet.\" This exquisite arrangement combines the sunny disposition of sunflowers, the majestic beauty of yellow lilies, and the heartfelt passion of red roses, complemented by delicate fillers. Expertly wrapped in natural-toned paper and tied with a vibrant red ribbon, it's a perfect expression of joy, adoration, and enduring affection.",
    "shortDescription": "A sun-kissed bouquet of cheerful sunflowers, elegant yellow lilies, and passionate red roses, wrapped in rustic charm.",
    "longDescription": "Embrace the warmth of nature with our \"Golden Radiance Hand-Tied Bouquet.\" This exquisite arrangement combines the sunny disposition of sunflowers, the majestic beauty of yellow lilies, and the heartfelt passion of red roses, complemented by delicate fillers. Expertly wrapped in natural-toned paper and tied with a vibrant red ribbon, it's a perfect expression of joy, adoration, and enduring affection.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:37:32.297Z"
  },
  {
    "id": "prod_1782157052254_685_enchanted_lilies_rose_harmony",
    "name": "Enchanted Lilies Rose Harmony",
    "title": "Enchanted Lilies Rose Harmony",
    "category": "Bouquets",
    "price": 1799,
    "originalPrice": 2435,
    "image": "/public/products/media__1782156942031-1782157028088.jpg",
    "images": [
      "/public/products/media__1782156942031-1782157028088.jpg",
      "/public/products/media__1782157156571-1782157254295.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782157156571-1782157254295.jpg"
    ],
    "description": "Discover the enchanting allure of the \"Enchanted Lilies & Rose Harmony\" bouquet. This captivating arrangement showcases grand yellow lilies as its centerpiece, gracefully complemented by tender peach roses, mystical purple blooms, and ethereal baby's breath. Thoughtfully wrapped in a soft pink paper and secured with a luxurious gold ribbon, it's an ideal gift to convey admiration, celebration, or heartfelt sentiments with refined elegance.",
    "shortDescription": "An elegant bouquet featuring resplendent yellow lilies, soft peach roses, and charming purple accents, wrapped in delicate pink.",
    "longDescription": "Discover the enchanting allure of the \"Enchanted Lilies & Rose Harmony\" bouquet. This captivating arrangement showcases grand yellow lilies as its centerpiece, gracefully complemented by tender peach roses, mystical purple blooms, and ethereal baby's breath. Thoughtfully wrapped in a soft pink paper and secured with a luxurious gold ribbon, it's an ideal gift to convey admiration, celebration, or heartfelt sentiments with refined elegance.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:37:32.300Z"
  },
  {
    "name": "Royal Purple Cadbury & Ferrero Hamper",
    "title": "Royal Purple Cadbury & Ferrero Hamper",
    "category": "Chocolate Bouquets",
    "price": 1699,
    "originalPrice": 2399,
    "image": "/public/products/media__1782157156320-1782157254204.jpg",
    "images": [
      "/public/products/media__1782157156320-1782157254204.jpg",
      "/public/products/media__1782194856970-1782194881003.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782157156320-1782157254204.jpg",
      "/public/products/media__1782194856970-1782194881003.jpg"
    ],
    "description": "A luxurious purple hamper filled with Cadbury Dairy Milk Silk and golden Ferrero Rocher chocolates.",
    "shortDescription": "A luxurious purple hamper filled with Cadbury Dairy Milk Silk and golden Ferrero Rocher chocolates.",
    "longDescription": "Indulge their sweet tooth with this premium chocolate hamper. Features a curated selection of Cadbury Dairy Milk Silk bars and golden Ferrero Rocher hazelnut chocolates wrapped in elegant gold mesh, beautifully presented in a stylish pink-and-purple gift bag with a satin bow. A perfect gift for birthdays, romantic surprises, or festive celebrations in Pune.",
    "id": "prod_1782193906209_747_royal_purple_cadbury___ferrero_hamper",
    "createdAt": "2026-06-23T05:51:46.209Z",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true
  },
  {
    "name": "Carnation & Chrysanthemum Harvest Bouquet",
    "title": "Carnation & Chrysanthemum Harvest Bouquet",
    "category": "Bouquets",
    "price": 1499,
    "originalPrice": 2099,
    "image": "/public/products/media__1782157156435-1782157254242.jpg",
    "images": [
      "/public/products/media__1782157156435-1782157254242.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782157156435-1782157254242.jpg"
    ],
    "description": "A warm and radiant hand-tied bouquet of red carnations and golden chrysanthemums.",
    "shortDescription": "A warm and radiant hand-tied bouquet of red carnations and golden chrysanthemums.",
    "longDescription": "Celebrate the season with this rich and vibrant hand-tied bouquet. Carefully curated with fresh red carnations, golden-yellow chrysanthemums, and rich green fillers, wrapped beautifully in dual-tone red and brown craft paper, finished with a golden ribbon. Perfect for birthdays, anniversaries, or corporate congratulations in Pune.",
    "id": "prod_1782193906209_656_carnation___chrysanthemum_harvest_bouquet",
    "createdAt": "2026-06-23T05:51:46.209Z",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true
  },
  {
    "name": "Lavender Dream Carnation & Lily Bouquet",
    "title": "Lavender Dream Carnation & Lily Bouquet",
    "category": "Bouquets",
    "price": 1799,
    "originalPrice": 2499,
    "image": "/public/products/media__1782157156490-1782157254262.jpg",
    "images": [
      "/public/products/media__1782157156490-1782157254262.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782157156490-1782157254262.jpg"
    ],
    "description": "A delicate mix of white carnations, pink lilies, and purple blooms in lavender wrapping.",
    "shortDescription": "A delicate mix of white carnations, pink lilies, and purple blooms in lavender wrapping.",
    "longDescription": "Express your softest sentiments with this gorgeous pastel bouquet. Featuring snowy white carnations, a large pink lily, purple carnations, and delicate baby's breath, artistically hand-tied in lavender craft paper with a matching ribbon. Excellent for expressing gratitude, apologies, or warm wishes in Pune.",
    "id": "prod_1782193906210_596_lavender_dream_carnation___lily_bouquet",
    "createdAt": "2026-06-23T05:51:46.210Z",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true
  },
  {
    "id": "prod_1782157281084_365_media__1782157156553_jpg",
    "name": "Golden Sunshine Sunflower Bouquet",
    "title": "Golden Sunshine Sunflower Bouquet",
    "category": "Bouquets",
    "price": 1699,
    "originalPrice": 2250,
    "image": "/public/products/media__1782157156553-1782157254279.jpg",
    "images": [
      "/public/products/media__1782157156553-1782157254279.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782157156553-1782157254279.jpg"
    ],
    "description": "Capture the essence of joy and optimism with our Golden Sunshine Sunflower Bouquet. Featuring a striking collection of vibrant sunflowers, symbolizing adoration and longevity, beautifully accented by clouds of delicate baby's breath. Encased in a modern black and gold wrapping, tied with a luxurious gold ribbon, this bouquet is an impeccable choice to brighten any day and spread unwavering happiness.",
    "shortDescription": "Radiant sunflowers perfectly paired with delicate baby's breath, presented in a chic black wrap for a stunning contrast.",
    "longDescription": "Capture the essence of joy and optimism with our Golden Sunshine Sunflower Bouquet. Featuring a striking collection of vibrant sunflowers, symbolizing adoration and longevity, beautifully accented by clouds of delicate baby's breath. Encased in a modern black and gold wrapping, tied with a luxurious gold ribbon, this bouquet is an impeccable choice to brighten any day and spread unwavering happiness.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-22T19:41:21.115Z"
  },
  {
    "id": "prod_1782193263397_349_sweet_indulgence_chocolate_bouquet",
    "name": "Sweet Indulgence Chocolate Bouquet",
    "title": "Sweet Indulgence Chocolate Bouquet",
    "category": "Chocolate Bouquets",
    "price": 1899,
    "originalPrice": 2599,
    "image": "/public/products/media__1782192638267-1782193015056.jpg",
    "images": [
      "/public/products/media__1782192638267-1782193015056.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782192638267-1782193015056.jpg"
    ],
    "description": "This tempting chocolate bouquet is a perfect treat for anyone with a sweet tooth. Featuring an assortment of beloved Cadbury Dairy Milk bars and colorful Gems chocolates, artfully arranged and wrapped in elegant pastel and gold papers. It's a joyful and delicious gift, ideal for birthdays, celebrations, or just to send a moment of pure bliss.",
    "shortDescription": "A delightful bouquet of Cadbury Dairy Milk bars and Gems chocolates, beautifully wrapped for a sweet surprise.",
    "longDescription": "This tempting chocolate bouquet is a perfect treat for anyone with a sweet tooth. Featuring an assortment of beloved Cadbury Dairy Milk bars and colorful Gems chocolates, artfully arranged and wrapped in elegant pastel and gold papers. It's a joyful and delicious gift, ideal for birthdays, celebrations, or just to send a moment of pure bliss.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-23T05:41:03.438Z"
  },
  {
    "id": "prod_1782193263398_93_golden_glamour_rose_bouquet",
    "name": "Golden Glamour Rose Bouquet",
    "title": "Golden Glamour Rose Bouquet",
    "category": "Rose Bouquets",
    "price": 2799,
    "originalPrice": 3799,
    "image": "/public/products/media__1782192638314-1782193015065.jpg",
    "images": [
      "/public/products/media__1782192638314-1782193015065.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782192638314-1782193015065.jpg"
    ],
    "description": "Experience opulence with this stunning bouquet featuring a harmonious blend of classic red roses and unique gold-painted roses. Enhanced with delicate baby's breath and presented in a sophisticated black and gold paper wrap, tied with a vibrant red bow. This arrangement is designed to impress, perfect for grand celebrations, milestone anniversaries, or making an unforgettable impression.",
    "shortDescription": "A breathtaking fusion of passionate red and radiant gold roses, elegantly wrapped for a truly luxurious statement.",
    "longDescription": "Experience opulence with this stunning bouquet featuring a harmonious blend of classic red roses and unique gold-painted roses. Enhanced with delicate baby's breath and presented in a sophisticated black and gold paper wrap, tied with a vibrant red bow. This arrangement is designed to impress, perfect for grand celebrations, milestone anniversaries, or making an unforgettable impression.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "createdAt": "2026-06-23T05:41:03.439Z"
  },
  {
    "name": "Sunset Glow Orange Rose Bouquet",
    "title": "Sunset Glow Orange Rose Bouquet",
    "category": "Rose Bouquets",
    "price": 1799,
    "originalPrice": 2499,
    "image": "/public/products/media__1782194011109-1782194077879.jpg",
    "images": [
      "/public/products/media__1782194011109-1782194077879.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782194011109-1782194077879.jpg"
    ],
    "description": "A classic bouquet of premium orange roses with delicate baby's breath.",
    "shortDescription": "A classic bouquet of premium orange roses with delicate baby's breath.",
    "longDescription": "Express your warm enthusiasm and passion with this elegant orange rose bouquet. Hand-crafted with premium fresh orange roses, baby's breath fillers, and green foliage, wrapped carefully in cream craft sheet and tied with a gold ribbon bow. Same-day express delivery in Pune.",
    "id": "prod_1782194077935_162_sunset_glow_orange_rose_bouquet",
    "createdAt": "2026-06-23T05:54:37.935Z",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true
  },
  {
    "name": "Golden Fields Mixed Meadow Bouquet",
    "title": "Golden Fields Mixed Meadow Bouquet",
    "category": "Bouquets",
    "price": 1999,
    "originalPrice": 2799,
    "image": "/public/products/media__1782194011153-1782194077890.jpg",
    "images": [
      "/public/products/media__1782194011153-1782194077890.jpg",
      "/public/products/media__1782194856920-1782194881002.jpg",
      "/public/products/media__1782195149897-1782195160001.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782194011153-1782194077890.jpg",
      "/public/products/media__1782194856920-1782194881002.jpg",
      "/public/products/media__1782195149897-1782195160001.jpg"
    ],
    "description": "A luxury arrangement of sunflowers, white roses, and maroon chrysanthemums.",
    "shortDescription": "A luxury arrangement of sunflowers, white roses, and maroon chrysanthemums.",
    "longDescription": "Add natural splendour to any room with this exquisite mixed bouquet. Combining fresh sunflowers, premium white roses, deep maroon chrysanthemums, and white aster fillers in a luxurious white-mesh hand-tied wrap. A beautiful centerpiece for celebrations, anniversaries, or housewarmings in Pune.",
    "id": "prod_1782194077935_176_golden_fields_mixed_meadow_bouquet",
    "createdAt": "2026-06-23T05:54:37.935Z",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true
  },
  {
    "name": "Sweet Pink Lily & Carnation Harmony",
    "title": "Sweet Pink Lily & Carnation Harmony",
    "category": "Bouquets",
    "price": 1899,
    "originalPrice": 2699,
    "image": "/public/products/media__1782194011167-1782194077904.jpg",
    "images": [
      "/public/products/media__1782194011167-1782194077904.jpg",
      "/public/products/media__1782194011219-1782194077916.jpg",
      "/public/products/media__1782194856872-1782194881001.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782194011167-1782194077904.jpg",
      "/public/products/media__1782194011219-1782194077916.jpg",
      "/public/products/media__1782194856872-1782194881001.jpg"
    ],
    "description": "A gorgeous mix of pink lilies, pink carnations, and purple blooms in a green wrap.",
    "shortDescription": "A gorgeous mix of pink lilies, pink carnations, and purple blooms in a green wrap.",
    "longDescription": "A luxurious pastel bouquet featuring fresh pink stargazer lilies, soft pink carnations, and vibrant purple chrysanthemums. Meticulously wrapped in dual-tone green and pink craft paper, tied with a premium satin bow. Ideal for romantic gestures, Mother's Day, or expressing appreciation in Pune.",
    "id": "prod_1782194077935_239_sweet_pink_lily___carnation_harmony",
    "createdAt": "2026-06-23T05:54:37.935Z",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true
  },
  {
    "name": "Pastel Meadow Sunflower Symphony",
    "title": "Pastel Meadow Sunflower Symphony",
    "category": "Bouquets",
    "price": 1499,
    "originalPrice": 2099,
    "image": "/public/products/media__1782194250291-1782194416555.jpg",
    "images": [
      "/public/products/media__1782194250291-1782194416555.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782194250291-1782194416555.jpg"
    ],
    "description": "A beautiful sunflower bouquet with pink asters and white carnations.",
    "shortDescription": "A beautiful sunflower bouquet with pink asters and white carnations.",
    "longDescription": "Bring pure joy and warmth with this unique sunflower arrangement. Featuring a premium large sunflower surrounded by pink chrysanthemums, snowy white carnations, and fresh greens, wrapped beautifully in pastel green and pink paper with a silver ribbon bow. Perfect for congratulations, get-well wishes, or birthdays in Pune.",
    "id": "prod_1782194416596_198_pastel_meadow_sunflower_symphony",
    "createdAt": "2026-06-23T06:00:16.596Z",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true
  },
  {
    "id": "prod_1782194881004_midnight_truffle_rose_chocolate",
    "name": "Midnight Truffle & Rose Chocolate Bouquet",
    "title": "Midnight Truffle & Rose Chocolate Bouquet",
    "category": "Chocolate Bouquets",
    "price": 1899,
    "originalPrice": 2699,
    "image": "/public/products/media__1782194857039-1782194881004.jpg",
    "images": [
      "/public/products/media__1782194857039-1782194881004.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782194857039-1782194881004.jpg"
    ],
    "description": "An exquisite chocolate bouquet featuring premium chocolate truffles and deep red roses wrapped in a luxurious black paper wrapper with a purple bow.",
    "shortDescription": "A premium chocolate bouquet of truffles and roses in a midnight black wrapper.",
    "longDescription": "Celebrate milestones with this luxurious chocolate bouquet. Crafted with premium chocolate truffles, fresh red roses, and baby's breath, it's hand-tied in a dual-layered textured black paper wrapper and finished with a purple satin ribbon bow. Perfect for birthdays, anniversaries, or romantic surprises in Pune.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-23T06:09:53.315Z",
    "sku": "SKU-CHO-MIDNIGHT",
    "quantity": 20,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_1782195160002_scarlet_radiance_rose_bag_box",
    "name": "Scarlet Radiance Rose Gift Bag Box",
    "title": "Scarlet Radiance Rose Gift Bag Box",
    "category": "Flower Baskets",
    "price": 1999,
    "originalPrice": 2799,
    "image": "/public/products/media__1782195149924-1782195160002.jpg",
    "images": [
      "/public/products/media__1782195149924-1782195160002.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782195149924-1782195160002.jpg"
    ],
    "description": "A premium pink gift bag box filled with vibrant red roses, white carnations, and lush green leaves, tied with a matching red bow.",
    "shortDescription": "A luxurious red rose arrangement in a pink gift bag box with handles.",
    "longDescription": "Surprise someone special in Pune with this gorgeous rose arrangement. Handcrafted by local florists, it features fresh red roses and delicate white carnations elegantly presented in a modern pink quilted gift bag box with handles. Finished with a luxury red satin bow. Perfect for romantic moments, anniversaries, and expressions of love.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-23T06:13:30.149Z",
    "sku": "SKU-FLW-SCARLET-BAG",
    "quantity": 15,
    "lowStockAlert": 2,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_1782195160003_luxurious_red_heart_rose_bouquet",
    "name": "Luxurious Red Heart Rose Bouquet",
    "title": "Luxurious Red Heart Rose Bouquet",
    "category": "Rose Bouquets",
    "price": 2999,
    "originalPrice": 3999,
    "image": "/public/products/media__1782195149962-1782195160003.jpg",
    "images": [
      "/public/products/media__1782195149962-1782195160003.jpg",
      "/public/products/media__1782195149999-1782195160004.jpg",
      "/public/products/media__1782195150022-1782195160005.jpg",
      "/public/products/media__1782195368270-1782195380005.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782195149962-1782195160003.jpg",
      "/public/products/media__1782195149999-1782195160004.jpg",
      "/public/products/media__1782195150022-1782195160005.jpg",
      "/public/products/media__1782195368270-1782195380005.jpg"
    ],
    "description": "An opulent heart-shaped bouquet of premium red roses and white baby's breath, wrapped in black and gold paper.",
    "shortDescription": "A magnificent heart-shaped red rose bouquet wrapped in black and gold.",
    "longDescription": "Express your ultimate love with this stunning heart-shaped red rose bouquet. Combining premium long-stemmed red roses and delicate baby's breath arranged into a perfect heart pattern. Elegantly wrapped in black craft sheets with gold border accents and finished with a red satin bow. An unforgettable romantic gesture for proposals, anniversaries, or special celebrations in Pune.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-23T06:13:30.149Z",
    "sku": "SKU-ROS-HEART-LUX",
    "quantity": 10,
    "lowStockAlert": 2,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_1782195380001_graceful_lily_peach_rose",
    "name": "Graceful Lily & Peach Rose Meadow Bouquet",
    "title": "Graceful Lily & Peach Rose Meadow Bouquet",
    "category": "Bouquets",
    "price": 2299,
    "originalPrice": 3199,
    "image": "/public/products/media__1782195368115-1782195380001.jpg",
    "images": [
      "/public/products/media__1782195368115-1782195380001.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782195368115-1782195380001.jpg"
    ],
    "description": "A premium floral arrangement featuring pink lilies, soft peach roses, purple carnations, and elegant white gladiolus wrapped in peach-gold mesh wrapping.",
    "shortDescription": "A grand mixed bouquet of pink stargazer lilies, peach roses, and purple carnations.",
    "longDescription": "Bring pure joy and elegance with this luxurious mixed bouquet. Meticulously handcrafted by our expert Pune florists, it merges fresh pink stargazer lilies, soft peach-toned roses, white gladiolus stems, and purple carnations. Hand-tied in a signature double-layered peach and golden mesh florist sheet. Perfect for birthdays, major congratulations, and milestones.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-23T06:17:49.614Z",
    "sku": "SKU-MIX-PEACH-GLAD",
    "quantity": 15,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_1782195380002_pure_elegance_white_rose",
    "name": "Pure Elegance White Rose Bouquet",
    "title": "Pure Elegance White Rose Bouquet",
    "category": "Rose Bouquets",
    "price": 1799,
    "originalPrice": 2499,
    "image": "/public/products/media__1782195368143-1782195380002.jpg",
    "images": [
      "/public/products/media__1782195368143-1782195380002.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782195368143-1782195380002.jpg"
    ],
    "description": "A classic bouquet of premium fresh white roses, nestled in pink baby's breath, wrapped in a white paper wrapper with black heart patterns.",
    "shortDescription": "A classic and pristine bouquet of white roses and pink baby's breath.",
    "longDescription": "Express purity, innocence, and deep respect with this gorgeous white rose bouquet. Hand-crafted with premium fresh white roses, surrounded by delicate pink baby's breath fillers, wrapped beautifully in a designer white craft paper printed with small black hearts, and finished with a pink satin ribbon bow. Same-day delivery across Pune.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-23T06:17:49.614Z",
    "sku": "SKU-ROS-WHITE-PURE",
    "quantity": 20,
    "lowStockAlert": 4,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_1782195380003_sunny_fields_chocolate_ferrero",
    "name": "Sunny Fields Chocolate & Ferrero Hamper",
    "title": "Sunny Fields Chocolate & Ferrero Hamper",
    "category": "Chocolate Bouquets",
    "price": 1599,
    "originalPrice": 2199,
    "image": "/public/products/media__1782195368174-1782195380003.jpg",
    "images": [
      "/public/products/media__1782195368174-1782195380003.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782195368174-1782195380003.jpg"
    ],
    "description": "A bright yellow gift bag filled with Cadbury Dairy Milk chocolate bars and golden Ferrero Rocher wrapped in rustic mesh, tied with a blue checkered ribbon.",
    "shortDescription": "A cheerful yellow hamper filled with Cadbury Dairy Milk and Ferrero Rocher.",
    "longDescription": "Brighten their day with this charming chocolate hamper. Features a curated selection of Cadbury Dairy Milk bars and golden Ferrero Rocher hazelnut chocolates wrapped in rustic mesh, beautifully presented in a sunny yellow gift box bag and tied with a sky blue checkered gingham bow. A perfect gift for birthdays or children in Pune.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-23T06:17:49.614Z",
    "sku": "SKU-CHO-SUNNY-FIELDS",
    "quantity": 25,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_1782195380004_sweet_blossom_chocolate_floral",
    "name": "Sweet Blossom Chocolate & Floral Hamper",
    "title": "Sweet Blossom Chocolate & Floral Hamper",
    "category": "Gift Hampers",
    "price": 2499,
    "originalPrice": 3499,
    "image": "/public/products/media__1782195368202-1782195380004.jpg",
    "images": [
      "/public/products/media__1782195368202-1782195380004.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782195368202-1782195380004.jpg"
    ],
    "description": "A premium designer gift bag filled with Cadbury Dairy Milk, Bournville, fresh white roses, stargazer lilies, red berries, and pampas grass.",
    "shortDescription": "A luxury floral and chocolate hamper with Dairy Milk, Bournville, and fresh flowers.",
    "longDescription": "Celebrate milestones with this unique, double-delight hamper. Features a luxury designer white gift bag filled with fresh white roses, stargazer lilies, red berry accents, and Cadbury Dairy Milk Silk/Bournville chocolate bars, topped with a dual black-and-red satin bow. Pune Sajawat Florist's signature creation for birthdays, anniversaries, or corporate celebrations.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-23T06:17:49.614Z",
    "sku": "SKU-HAM-SWEET-BLOSSOM",
    "quantity": 12,
    "lowStockAlert": 2,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_1782195640001_golden_romance_rose_ferrero",
    "name": "Golden Romance Rose & Ferrero Heart",
    "title": "Golden Romance Rose & Ferrero Heart",
    "category": "Chocolate Bouquets",
    "price": 2499,
    "originalPrice": 3499,
    "image": "/public/products/media__1782195631293-1782195640001.jpg",
    "images": [
      "/public/products/media__1782195631293-1782195640001.jpg",
      "/public/products/media__1782197313279-1782197330001.jpg",
      "/public/products/media__1782197313439-1782197330004.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782195631293-1782195640001.jpg",
      "/public/products/media__1782197313279-1782197330001.jpg",
      "/public/products/media__1782197313439-1782197330004.jpg"
    ],
    "description": "A premium heart-shaped arrangement featuring fresh red roses forming the border and golden Ferrero Rocher chocolates inside, tied with a silver-blue bow.",
    "shortDescription": "A luxurious heart arrangement of fresh red roses and Ferrero Rocher.",
    "longDescription": "Express your romantic feelings with the Golden Romance Rose & Ferrero Heart. Combining premium fresh red roses forming a perfect outer heart border and golden Ferrero Rocher chocolates nestled in the center. Adorned with delicate baby's breath and a sheer glittering silver-blue ribbon bow. An exceptional choice for proposals, anniversaries, or special celebrations in Pune.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-23T06:21:56.076Z",
    "sku": "SKU-CHO-GOLDEN-HEART",
    "quantity": 15,
    "lowStockAlert": 2,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_1782195640003_sweet_harvest_lychee_heart",
    "name": "Sweet Harvest Lychee Heart Bouquet",
    "title": "Sweet Harvest Lychee Heart Bouquet",
    "category": "Gift Hampers",
    "price": 1999,
    "originalPrice": 2799,
    "image": "/public/products/media__1782195631380-1782195640003.jpg",
    "images": [
      "/public/products/media__1782195631380-1782195640003.jpg",
      "/public/products/media__1782197313344-1782197330002.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782195631380-1782195640003.jpg",
      "/public/products/media__1782197313344-1782197330002.jpg"
    ],
    "description": "A unique heart-shaped gourmet fruit bouquet of fresh red lychees, accented with baby's breath and wrapped in black craft sheets.",
    "shortDescription": "A unique heart-shaped bouquet of fresh red lychees and baby's breath.",
    "longDescription": "Surprise them with a unique and healthy treat! The Sweet Harvest Lychee Heart Bouquet features fresh, handpicked red lychee fruits arranged in a beautiful heart shape, surrounded by delicate white baby's breath. Hand-wrapped in premium black craft paper with a red ribbon bow. A wonderful and delicious gift for birthdays, anniversaries, or get-well wishes in Pune.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-23T06:21:56.077Z",
    "sku": "SKU-HAM-LYCHEE-HEART",
    "quantity": 10,
    "lowStockAlert": 2,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_1782195640005_regal_splendour_rose_lily",
    "name": "Regal Splendour Rose & Lily Bloom Box",
    "title": "Regal Splendour Rose & Lily Bloom Box",
    "category": "Flower Baskets",
    "price": 2299,
    "originalPrice": 3199,
    "image": "/public/products/media__1782195631473-1782195640005.jpg",
    "images": [
      "/public/products/media__1782195631473-1782195640005.jpg",
      "/public/products/media__1782195631418-1782195640004.jpg",
      "/public/products/media__1782197313467-1782197330005.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782195631473-1782195640005.jpg",
      "/public/products/media__1782195631418-1782195640004.jpg",
      "/public/products/media__1782197313467-1782197330005.jpg"
    ],
    "description": "A luxury arrangement in a round red box basket with a gold base, featuring pink snapdragons, white lilies, pink roses, white chrysanthemums, and butterflies.",
    "shortDescription": "A premium arrangement of pink snapdragons, white lilies, and roses in a red gift box.",
    "longDescription": "Add regal elegance to any space with this stunning floral box arrangement. Features pink snapdragons, large white lilies, fresh pink roses, white chrysanthemums, and green button chrysanthemums arranged in a modern red box basket with a golden base. Adorned with delicate decorative butterflies and a glittering silver bow. A perfect centerpiece for celebrations in Pune.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-23T06:21:56.077Z",
    "sku": "SKU-FLW-REGAL-SPLEN",
    "quantity": 12,
    "lowStockAlert": 2,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_1782197330003_charming_pink_balloon_blossom",
    "name": "Charming Pink Balloon & Blossom Bouquet",
    "title": "Charming Pink Balloon & Blossom Bouquet",
    "category": "Bouquets",
    "price": 1999,
    "originalPrice": 2799,
    "image": "/public/products/media__1782197313385-1782197330003.jpg",
    "images": [
      "/public/products/media__1782197313385-1782197330003.jpg"
    ],
    "galleryImages": [
      "/public/products/media__1782197313385-1782197330003.jpg"
    ],
    "description": "A gorgeous mixed bouquet of pink chrysanthemums, white roses, and blue spray baby's breath, with pink balloons inside a large bubble balloon.",
    "shortDescription": "A stunning mixed bouquet topped with a transparent bubble balloon filled with pink balloons.",
    "longDescription": "Surprise your loved ones with the Charming Pink Balloon & Blossom Bouquet. Handcrafted by our expert Pune florists, it combines soft pink chrysanthemums, pristine white roses, and a cloud of blue spray baby's breath. It is crowned with a large, transparent helium bubble balloon containing three metallic pink mini-balloons, wrapped beautifully in dual cream and newspaper-style craft papers. Perfect for birthdays, romantic surprises, or milestone celebrations.",
    "rating": 5,
    "reviewsCount": 1,
    "isBestSeller": true,
    "isNew": true,
    "isTrending": true,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-23T06:50:11.460Z",
    "sku": "SKU-BOU-BALLOON-PINK",
    "quantity": 15,
    "lowStockAlert": 2,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_chocolate_truffle",
    "name": "Chocolate Truffle Cake",
    "title": "Chocolate Truffle Cake",
    "category": "Cakes",
    "price": 699,
    "originalPrice": 899,
    "image": "/public/products/prod_cake_chocolate_truffle.jpg",
    "images": [
      "/public/products/prod_cake_chocolate_truffle.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_chocolate_truffle.jpg"
    ],
    "description": "Classic eggless chocolate truffle cake glazed with rich ganache.",
    "shortDescription": "Classic eggless chocolate truffle cake glazed with rich ganache.",
    "longDescription": "Indulge in our signature Chocolate Truffle Cake, baked to perfection by expert bakers in Pune. Featuring layers of moist eggless chocolate sponge filled and frosted with rich dark chocolate ganache, decorated with chocolate flakes and hand-rolled truffles.",
    "rating": 4.8,
    "reviewsCount": 22,
    "isBestSeller": true,
    "isNew": false,
    "isTrending": true,
    "isRecommended": false,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.816Z",
    "sku": "SKU-CAKE-CHOCOLATE_TRUFFLE",
    "quantity": 34,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_black_forest",
    "name": "Classic Black Forest Cake",
    "title": "Classic Black Forest Cake",
    "category": "Cakes",
    "price": 599,
    "originalPrice": 799,
    "image": "/public/products/prod_cake_black_forest.jpg",
    "images": [
      "/public/products/prod_cake_black_forest.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_black_forest.jpg"
    ],
    "description": "Classic German style black forest cake with cherries and fresh cream.",
    "shortDescription": "Classic German style black forest cake with cherries and fresh cream.",
    "longDescription": "Our German-inspired Black Forest Cake layers moist chocolate sponge cake with fresh whipped cream and sour red cherries, finished with a generous dusting of chocolate shavings and cherry toppings.",
    "rating": 4.6,
    "reviewsCount": 11,
    "isBestSeller": false,
    "isNew": false,
    "isTrending": false,
    "isRecommended": true,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-BLACK_FOREST",
    "quantity": 25,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_red_velvet",
    "name": "Royal Red Velvet Cake",
    "title": "Royal Red Velvet Cake",
    "category": "Cakes",
    "price": 899,
    "originalPrice": 1199,
    "image": "/public/products/prod_cake_red_velvet.jpg",
    "images": [
      "/public/products/prod_cake_red_velvet.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_red_velvet.jpg"
    ],
    "description": "Velvety crimson sponge layered with sweet cream cheese frosting.",
    "shortDescription": "Velvety crimson sponge layered with sweet cream cheese frosting.",
    "longDescription": "Experience pure romance with our Royal Red Velvet Cake. Boasting classic crimson layers with a hint of cocoa, frosted with premium, velvety cream cheese frosting and decorated with red velvet crumbs.",
    "rating": 4.9,
    "reviewsCount": 15,
    "isBestSeller": true,
    "isNew": false,
    "isTrending": true,
    "isRecommended": false,
    "isFeatured": true,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-RED_VELVET",
    "quantity": 16,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_butterscotch",
    "name": "Crunchy Butterscotch Cake",
    "title": "Crunchy Butterscotch Cake",
    "category": "Cakes",
    "price": 649,
    "originalPrice": 849,
    "image": "/public/products/prod_cake_butterscotch.jpg",
    "images": [
      "/public/products/prod_cake_butterscotch.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_butterscotch.jpg"
    ],
    "description": "Soft butterscotch sponge layered with caramel cream and crunchy praline.",
    "shortDescription": "Soft butterscotch sponge layered with caramel cream and crunchy praline.",
    "longDescription": "Satisfy your cravings with this delectable Butterscotch Cake. Crafted with fluffy butterscotch sponge, layered with rich butterscotch cream, and covered with home-made golden praline crunch.",
    "rating": 4.9,
    "reviewsCount": 26,
    "isBestSeller": false,
    "isNew": false,
    "isTrending": false,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-BUTTERSCOTCH",
    "quantity": 32,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_pineapple",
    "name": "Tropical Pineapple Cake",
    "title": "Tropical Pineapple Cake",
    "category": "Cakes",
    "price": 549,
    "originalPrice": 749,
    "image": "/public/products/prod_cake_pineapple.jpg",
    "images": [
      "/public/products/prod_cake_pineapple.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_pineapple.jpg"
    ],
    "description": "Freshly whipped cream cake layered with juicy pineapple chunks.",
    "shortDescription": "Freshly whipped cream cake layered with juicy pineapple chunks.",
    "longDescription": "A crowd favorite in Pune! This Tropical Pineapple Cake features a light vanilla sponge soaked in pineapple syrup, layered with fresh whipped cream and sweet pineapple chunks, garnished with cherry and pineapple slices.",
    "rating": 4.5,
    "reviewsCount": 23,
    "isBestSeller": false,
    "isNew": false,
    "isTrending": false,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-PINEAPPLE",
    "quantity": 25,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_fresh_fruit",
    "name": "Premium Fresh Fruit Cake",
    "title": "Premium Fresh Fruit Cake",
    "category": "Cakes",
    "price": 999,
    "originalPrice": 1299,
    "image": "/public/products/prod_cake_fresh_fruit.jpg",
    "images": [
      "/public/products/prod_cake_fresh_fruit.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_fresh_fruit.jpg"
    ],
    "description": "Vanilla sponge layered with fresh custard cream and loaded with seasonal fruits.",
    "shortDescription": "Vanilla sponge layered with fresh custard cream and loaded with seasonal fruits.",
    "longDescription": "Celebrate healthy indulgence with our Premium Fresh Fruit Cake. It is loaded with kiwi, apple, grapes, pineapple, orange, and pomegranate on a bed of fresh whipped cream and soft vanilla sponge.",
    "rating": 4.5,
    "reviewsCount": 12,
    "isBestSeller": false,
    "isNew": false,
    "isTrending": false,
    "isRecommended": true,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-FRESH_FRUIT",
    "quantity": 25,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_ferrero_rocher",
    "name": "Luxurious Ferrero Rocher Cake",
    "title": "Luxurious Ferrero Rocher Cake",
    "category": "Cakes",
    "price": 1499,
    "originalPrice": 1899,
    "image": "/public/products/prod_cake_ferrero_rocher.jpg",
    "images": [
      "/public/products/prod_cake_ferrero_rocher.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_ferrero_rocher.jpg"
    ],
    "description": "Decadent hazelnut chocolate cake decorated with Ferrero Rocher truffles.",
    "shortDescription": "Decadent hazelnut chocolate cake decorated with Ferrero Rocher truffles.",
    "longDescription": "Our premium Ferrero Rocher Cake features chocolate hazelnut sponge layered with Nutella glaze, crunchy wafer bits, toasted hazelnuts, topped with original Ferrero Rocher chocolates.",
    "rating": 4.5,
    "reviewsCount": 8,
    "isBestSeller": true,
    "isNew": false,
    "isTrending": false,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-FERRERO_ROCHER",
    "quantity": 29,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_kitkat_chocolate",
    "name": "KitKat Celebration Chocolate Cake",
    "title": "KitKat Celebration Chocolate Cake",
    "category": "Cakes",
    "price": 1199,
    "originalPrice": 1499,
    "image": "/public/products/prod_cake_kitkat_chocolate.jpg",
    "images": [
      "/public/products/prod_cake_kitkat_chocolate.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_kitkat_chocolate.jpg"
    ],
    "description": "Rich chocolate cake surrounded by KitKat bars and topped with gems.",
    "shortDescription": "Rich chocolate cake surrounded by KitKat bars and topped with gems.",
    "longDescription": "The ultimate chocolate party cake! A moist chocolate cake loaded with chocolate fudge, surrounded by a border of crispy KitKat bars, and crowned with colorful gems.",
    "rating": 4.5,
    "reviewsCount": 14,
    "isBestSeller": false,
    "isNew": true,
    "isTrending": false,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-KITKAT_CHOCOLATE",
    "quantity": 19,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_blueberry_cheesecake",
    "name": "New York Blueberry Cheesecake",
    "title": "New York Blueberry Cheesecake",
    "category": "Cakes",
    "price": 1299,
    "originalPrice": 1599,
    "image": "/public/products/prod_cake_blueberry_cheesecake.jpg",
    "images": [
      "/public/products/prod_cake_blueberry_cheesecake.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_blueberry_cheesecake.jpg"
    ],
    "description": "Creamy baked cheesecake topped with sweet wild blueberry compote.",
    "shortDescription": "Creamy baked cheesecake topped with sweet wild blueberry compote.",
    "longDescription": "Indulge in the rich, velvety texture of our New York style Blueberry Cheesecake. Features a buttery graham cracker crust, a dense cream cheese filling, topped with luscious blueberry glaze.",
    "rating": 4.8,
    "reviewsCount": 24,
    "isBestSeller": false,
    "isNew": true,
    "isTrending": true,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-BLUEBERRY_CHEESECAKE",
    "quantity": 22,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_vanilla_celebration",
    "name": "Elegant Vanilla Celebration Cake",
    "title": "Elegant Vanilla Celebration Cake",
    "category": "Cakes",
    "price": 599,
    "originalPrice": 799,
    "image": "/public/products/prod_cake_vanilla_celebration.jpg",
    "images": [
      "/public/products/prod_cake_vanilla_celebration.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_vanilla_celebration.jpg"
    ],
    "description": "Classic double layered vanilla bean cake with white frosting.",
    "shortDescription": "Classic double layered vanilla bean cake with white frosting.",
    "longDescription": "Simple, timeless, and delicious. Our Vanilla Celebration Cake uses pure Madagascar vanilla bean extract for a aromatic sponge, layered with vanilla buttercream and decorated with elegant white swirls.",
    "rating": 4.6,
    "reviewsCount": 15,
    "isBestSeller": false,
    "isNew": false,
    "isTrending": false,
    "isRecommended": true,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-VANILLA_CELEBRATION",
    "quantity": 15,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_strawberry_shortcake",
    "name": "Fresh Strawberry Shortcake",
    "title": "Fresh Strawberry Shortcake",
    "category": "Cakes",
    "price": 699,
    "originalPrice": 899,
    "image": "/public/products/prod_cake_strawberry_shortcake.jpg",
    "images": [
      "/public/products/prod_cake_strawberry_shortcake.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_strawberry_shortcake.jpg"
    ],
    "description": "Seasonal fresh strawberry and whipped cream cake.",
    "shortDescription": "Seasonal fresh strawberry and whipped cream cake.",
    "longDescription": "Made with Mahabaleshwar's finest fresh strawberries, this light vanilla sponge cake is layered with sliced strawberries and sweet cream, finished with whole glazed strawberries on top.",
    "rating": 4.6,
    "reviewsCount": 26,
    "isBestSeller": false,
    "isNew": false,
    "isTrending": false,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-STRAWBERRY_SHORTCAKE",
    "quantity": 23,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_mango_mousse",
    "name": "Alphonso Mango Mousse Cake",
    "title": "Alphonso Mango Mousse Cake",
    "category": "Cakes",
    "price": 799,
    "originalPrice": 999,
    "image": "/public/products/prod_cake_mango_mousse.jpg",
    "images": [
      "/public/products/prod_cake_mango_mousse.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_mango_mousse.jpg"
    ],
    "description": "Light, airy mango mousse cake made with real Alphonso mango pulp.",
    "shortDescription": "Light, airy mango mousse cake made with real Alphonso mango pulp.",
    "longDescription": "Our seasonal Alphonso Mango Mousse Cake features a delicate vanilla base topped with a smooth, light, and fruity mango mousse, finished with a bright mango gel glaze.",
    "rating": 4.8,
    "reviewsCount": 17,
    "isBestSeller": false,
    "isNew": false,
    "isTrending": false,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-MANGO_MOUSSE",
    "quantity": 30,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_lemon_drizzle",
    "name": "Zesty Lemon Drizzle Cake",
    "title": "Zesty Lemon Drizzle Cake",
    "category": "Cakes",
    "price": 549,
    "originalPrice": 749,
    "image": "/public/products/prod_cake_lemon_drizzle.jpg",
    "images": [
      "/public/products/prod_cake_lemon_drizzle.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_lemon_drizzle.jpg"
    ],
    "description": "Moist lemon sponge soaked in zesty lemon syrup with a sugar glaze.",
    "shortDescription": "Moist lemon sponge soaked in zesty lemon syrup with a sugar glaze.",
    "longDescription": "Refreshingly tangy and sweet, our Zesty Lemon Drizzle Cake is infused with fresh lemon zest and juice, soaked in a sweet lemon syrup, and drizzled with a light sugar glaze.",
    "rating": 4.7,
    "reviewsCount": 27,
    "isBestSeller": false,
    "isNew": false,
    "isTrending": false,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-LEMON_DRIZZLE",
    "quantity": 18,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_carrot_cream_cheese",
    "name": "Spiced Carrot & Walnut Cake",
    "title": "Spiced Carrot & Walnut Cake",
    "category": "Cakes",
    "price": 749,
    "originalPrice": 949,
    "image": "/public/products/prod_cake_carrot_cream_cheese.jpg",
    "images": [
      "/public/products/prod_cake_carrot_cream_cheese.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_carrot_cream_cheese.jpg"
    ],
    "description": "Moist spiced carrot cake loaded with walnuts and cream cheese frosting.",
    "shortDescription": "Moist spiced carrot cake loaded with walnuts and cream cheese frosting.",
    "longDescription": "A wholesome classic made with grated fresh carrots, cinnamon spice, chopped walnuts, and layered with smooth, tangy cream cheese frosting.",
    "rating": 4.9,
    "reviewsCount": 27,
    "isBestSeller": false,
    "isNew": false,
    "isTrending": false,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-CARROT_CREAM_CHEESE",
    "quantity": 33,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_coffee_mocha",
    "name": "Espresso Coffee Mocha Cake",
    "title": "Espresso Coffee Mocha Cake",
    "category": "Cakes",
    "price": 699,
    "originalPrice": 899,
    "image": "/public/products/prod_cake_coffee_mocha.jpg",
    "images": [
      "/public/products/prod_cake_coffee_mocha.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_coffee_mocha.jpg"
    ],
    "description": "Rich chocolate sponge layered with espresso-infused buttercream.",
    "shortDescription": "Rich chocolate sponge layered with espresso-infused buttercream.",
    "longDescription": "For the coffee lovers in Pune! Combining rich dark chocolate sponge with intense espresso buttercream, dusted with cocoa powder and topped with dark chocolate coffee beans.",
    "rating": 4.8,
    "reviewsCount": 23,
    "isBestSeller": false,
    "isNew": false,
    "isTrending": false,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-COFFEE_MOCHA",
    "quantity": 27,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_tiramisu_celebration",
    "name": "Royal Tiramisu Celebration Cake",
    "title": "Royal Tiramisu Celebration Cake",
    "category": "Cakes",
    "price": 999,
    "originalPrice": 1299,
    "image": "/public/products/prod_cake_tiramisu_celebration.jpg",
    "images": [
      "/public/products/prod_cake_tiramisu_celebration.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_tiramisu_celebration.jpg"
    ],
    "description": "Italian classic layered with coffee-soaked ladyfingers and mascarpone.",
    "shortDescription": "Italian classic layered with coffee-soaked ladyfingers and mascarpone.",
    "longDescription": "Our cake version of the famous Italian dessert. Fluffy espresso-soaked sponge layered with velvety mascarpone cheese cream, elegantly dusted with dark French cocoa powder.",
    "rating": 4.7,
    "reviewsCount": 10,
    "isBestSeller": false,
    "isNew": false,
    "isTrending": false,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-TIRAMISU_CELEBRATION",
    "quantity": 34,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_white_forest",
    "name": "Exquisite White Forest Cake",
    "title": "Exquisite White Forest Cake",
    "category": "Cakes",
    "price": 649,
    "originalPrice": 849,
    "image": "/public/products/prod_cake_white_forest.jpg",
    "images": [
      "/public/products/prod_cake_white_forest.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_white_forest.jpg"
    ],
    "description": "Vanilla sponge with white chocolate flakes, cherries, and fresh cream.",
    "shortDescription": "Vanilla sponge with white chocolate flakes, cherries, and fresh cream.",
    "longDescription": "A delicious twist on the classic! White Forest Cake layers light vanilla sponge with sweet red cherries and whipped cream, coated with snow-white chocolate curls.",
    "rating": 4.9,
    "reviewsCount": 29,
    "isBestSeller": false,
    "isNew": false,
    "isTrending": false,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-WHITE_FOREST",
    "quantity": 27,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
  },
  {
    "id": "prod_cake_rainbow_celebration",
    "name": "Vibrant Rainbow Layer Cake",
    "title": "Vibrant Rainbow Layer Cake",
    "category": "Cakes",
    "price": 1399,
    "originalPrice": 1799,
    "image": "/public/products/prod_cake_rainbow_celebration.jpg",
    "images": [
      "/public/products/prod_cake_rainbow_celebration.jpg"
    ],
    "galleryImages": [
      "/public/products/prod_cake_rainbow_celebration.jpg"
    ],
    "description": "Six colorful layers of vanilla sponge with smooth white cream.",
    "shortDescription": "Six colorful layers of vanilla sponge with smooth white cream.",
    "longDescription": "Bring joy to any celebration with our 6-layered Rainbow Cake! Each layer boasts a different color of the rainbow, separated and frosted with a smooth vanilla frosting, topped with rainbow sprinkles.",
    "rating": 4.6,
    "reviewsCount": 10,
    "isBestSeller": false,
    "isNew": true,
    "isTrending": false,
    "isRecommended": false,
    "isFeatured": false,
    "isEnabled": true,
    "isHidden": false,
    "createdAt": "2026-06-26T13:34:05.818Z",
    "sku": "SKU-CAKE-RAINBOW_CELEBRATION",
    "quantity": 15,
    "lowStockAlert": 3,
    "deliverySettings": {
      "available": true,
      "charge": 0,
      "sameday": true,
      "fixed": true,
      "night": true,
      "midnight": true,
      "customChargeEnabled": false,
      "customCharge": 0
    },
    "addons": []
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

