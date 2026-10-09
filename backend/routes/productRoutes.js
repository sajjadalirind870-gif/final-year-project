import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// 🟢 Add Product
router.post("/add", async (req, res) => {
  try {
    const { type, condition, brand, specs, mainImage } = req.body;

    if (!brand || !specs?.price || !type || !mainImage) {
      return res
        .status(400)
        .json({ message: "Brand, Type, Price & Image are required" });
    }

    const newProduct = new Product({
      name: specs?.model || brand,
      type,
      condition: type === "Old" ? condition : "New",
      brand,
      specs,
      price: Number(specs.price),
      mainImage,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "✅ Product added successfully!", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
});

// 🟡 Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// 🟠 Get Product By ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
});

/// 🔵 Update Product
router.put("/:id", async (req, res) => {
  try {
    const { type, condition, brand, specs, mainImage } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "❌ Product not found" });
    }

    product.type = type;
    product.condition = type === "Old" ? condition : "New";
    product.brand = brand;
    product.specs = specs;
    product.mainImage = mainImage;
    product.price = specs.price;

    const updatedProduct = await product.save();
    res.json({ message: "✅ Product updated successfully!", product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Error updating product", error: err.message });
  }
});

// 🔴 Delete Product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "❌ Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Error deleting product", error: err.message });
  }
});

router.get("/premium/mobiles", async (req, res) => {
  try {
    const premiumMobiles = await Product.find({
      "specs.price": { $gte: 200000 },
      type: "New"
    }).sort({ "specs.price": -1 }).limit(10);

    // Format data for frontend
    const formattedMobiles = premiumMobiles.map(mobile => ({
      model: mobile.specs?.model || mobile.name,
      ram: mobile.specs?.ram || "Not specified",
      price: mobile.specs?.price,
      img: mobile.mainImage,
      brand: mobile.brand
    }));

    res.status(200).json(formattedMobiles);
  } catch (err) {
    res.status(500).json({ 
      message: "Error fetching premium mobiles", 
      error: err.message 
    });
  }
});

export default router;
