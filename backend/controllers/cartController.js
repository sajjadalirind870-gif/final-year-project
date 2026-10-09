import Cart from "../models/cartModel.js";

// Add or Update Cart
export const addToCart = async (req, res) => {
  const { userId, product } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [product] });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === product.productId
      );

      if (index >= 0) {
        cart.items[index].quantity += product.quantity || 1;
      } else {
        cart.items.push(product);
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// Get User Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

// Remove Item
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
};

// Clear Cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};
