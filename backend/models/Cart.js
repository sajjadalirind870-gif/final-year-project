import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      name: String,
      brand: String,
      image: String,
      specs: Object,
      price: Number,
      quantity: { type: Number, default: 1 },
    },
  ],
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
