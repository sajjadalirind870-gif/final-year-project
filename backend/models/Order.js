// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: String, // ✅ ObjectId se String kar do
    required: true
  },
  items: [{
    name: String,
    brand: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1
    },
    image: String,
    specs: {
      model: String,
      storage: String,
      ram: String,
      color: String
    },
    mainImage: String,
    images: [String]
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  address: {
    name: { type: String, required: true }, // ✅ Name field add karo
    province: String,
    district: String,
    city: String,
    address: String,
    postalCode: String,
    contact: String
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'stripe', 'easypaisa', 'jazzcash'],
    default: 'cod'
  },
  paid: {
    type: Boolean,
    default: false
  },
  paymentResult: {
    id: String,
    method: String,
    mobile: String
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;