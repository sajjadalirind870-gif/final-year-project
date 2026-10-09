// routes/orderRoutes.js
import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// Get all orders with user details
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// NEW: Get orders by user ID - User ke liye specific orders
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`📦 Found ${orders.length} orders for user: ${userId}`);
    
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user orders',
      error: error.message
    });
  }
});

// Create new order - UPDATED with name validation
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      address,
      paymentMethod,
      paid,
      paymentResult,
      status
    } = req.body;

    // NEW: Check if name is provided
    if (!address || !address.name) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required'
      });
    }

    const order = new Order({
      userId,
      items,
      totalAmount,
      address: {
        name: address.name, // NEW: Name field save karo
        province: address.province,
        district: address.district,
        city: address.city,
        address: address.address,
        postalCode: address.postalCode,
        contact: address.contact
      },
      paymentMethod,
      paid: paid || false,
      paymentResult,
      status: status || 'pending'
    });

    const savedOrder = await order.save();
    
    // User details ke saath response bhejo
    const orderWithUser = await Order.findById(savedOrder._id)
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: orderWithUser
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Baaki routes (update, delete) same rahenge
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
});

export default router;