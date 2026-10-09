import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

// ✅ Get Cart by userId
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Add or Update Cart
router.post("/", async (req, res) => {
  try {
    const { userId, items } = req.body;
    let cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = items;
    } else {
      cart = new Cart({ userId, items });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Cart save failed:", err);
    res.status(500).json({ message: "Failed to save cart" });
  }
});

// ✅ Clear Cart
router.delete("/:userId", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

export default router;
