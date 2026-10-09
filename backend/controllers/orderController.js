import Order from "../models/Order.js";

// 🟢 Create Order
export const createOrder = async (req, res) => {
  try {
    const { user, products, totalAmount } = req.body;

    if (!user || !products || !totalAmount) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const order = new Order({ user, products, totalAmount });
    await order.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔵 Get All Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 🟡 Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
