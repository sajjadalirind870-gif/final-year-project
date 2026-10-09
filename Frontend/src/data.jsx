export const products = [
  {
    id: 1,
    name: "iPhone 15",
    price: 1500,
    description: "Latest iPhone with amazing camera and performance.",
    image: "/images/iphone15.jpg", // download karke public/images me rakhna
    specifications: {
      display: "6.7 inch Super Retina XDR OLED",
      processor: "A17 Bionic chip",
      camera: "48MP + 12MP dual rear cameras",
      battery: "4500 mAh",
      storage: "128GB / 256GB / 512GB",
      os: "iOS 18",
    },
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    price: 1200,
    description: "High-end Samsung phone with great display and performance.",
    image: "/images/samsungS24.jpg", // download karke public/images me rakhna
    specifications: {
      display: "6.8 inch Dynamic AMOLED 2X",
      processor: "Exynos 2400 / Snapdragon 8 Gen 3",
      camera: "200MP + 12MP + 10MP triple rear cameras",
      battery: "5000 mAh",
      storage: "128GB / 256GB / 512GB",
      os: "Android 14",
    },
  },
  {
    id: 3,
    name: "MacBook Pro 16\"",
    price: 2500,
    description: "Powerful MacBook for developers and designers.",
    image: "/images/macbookpro16.jpg", // download karke public/images me rakhna
    specifications: {
      display: "16-inch Liquid Retina XDR",
      processor: "Apple M2 Pro / M2 Max",
      ram: "16GB / 32GB / 64GB",
      storage: "512GB / 1TB / 2TB SSD",
      graphics: "Integrated 19-core GPU (M2 Pro) / 38-core GPU (M2 Max)",
      os: "macOS Sonoma",
    },
  },
];

export default products;