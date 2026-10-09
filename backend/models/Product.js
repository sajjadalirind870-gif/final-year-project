import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    condition: { type: String },
    brand: { type: String, required: true },
    specs: {
      model: String,
      ram: String,
      rom: String,
      battery: String,
      frontCamera: String,
      backCamera: String,
      processor: String,
      display: String,
      color: String,
      price: Number,
    },
    stock: { type: Number, default: 0 },
    mainImage: { type: String },
    extraImages: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
