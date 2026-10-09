// src/components/Cart.jsx
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaShoppingBag,
  FaPlus,
  FaMinus,
  FaCreditCard,
  FaMobileAlt,
  FaCheckCircle,
  FaShippingFast,
  FaBox,
  FaCheck,
  FaClock,
  FaEye,
  FaHistory,
  FaTimes,
  FaUser,
  FaMapMarkerAlt,
  FaFilter,
  FaSearch,
  FaExclamationTriangle,
  FaUndo,
  FaHome,
  FaStore
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// ---------- CONFIG ----------
const API_BASE = "http://localhost:5000";
const STRIPE_PUBLISHABLE_KEY = "pk_test_51SKHmjCOERTbhH9RddV0CnjUGdLDqObaOnxR7HCjSjFXVFaTQEgigrDfTKSmpPKZLn2kFOtTtiwDniWFfvr1JO5E00Tx68uvBW";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const pakistanProvinces = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Kashmir",
];

// Helper functions
const getStorageInfo = (item) => {
  return item.specs?.rom || item.specs?.storage || item.storage || "128GB";
};

const getPriceInfo = (item) => {
  return item.specs?.price || item.price || 0;
};

const getModelInfo = (item) => {
  return item.specs?.model || item.name || "Unknown Model";
};

const getBrandInfo = (item) => {
  return item.brand || "N/A";
};

const getRamInfo = (item) => {
  return item.specs?.ram || "8GB";
};

const Cart = ({ cart = [], setCart }) => {
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    province: "",
    district: "",
    city: "",
    address: "",
    postalCode: "",
    contact: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showSuccess, setShowSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  
  // Order management states
  const [orderStatus, setOrderStatus] = useState("");
  const [orderId, setOrderId] = useState("");
  const [finalOrderAmount, setFinalOrderAmount] = useState(0);
  const [paymentSuccessAmount, setPaymentSuccessAmount] = useState(0);

  // Enhanced orders management
  const [userOrders, setUserOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [ordersFilter, setOrdersFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [actionSuccess, setActionSuccess] = useState(null);

  const userId = "demoUser";

  const totalAmount = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + (getPriceInfo(item) * (item.quantity || 1)),
      0
    );
  }, [cart]);

  // Enhanced fetch user orders with filters
  const fetchUserOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch(`${API_BASE}/api/orders/user/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      let orders = [];
      if (data.success && Array.isArray(data.orders)) {
        orders = data.orders;
      } else if (Array.isArray(data)) {
        orders = data;
      } else if (data.orders && Array.isArray(data.orders)) {
        orders = data.orders;
      }

      // Apply filters and sorting
      let filteredOrders = orders.filter(order => {
        if (ordersFilter === "all") return true;
        return order.status === ordersFilter;
      });

      // Apply search
      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
          order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.address?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items?.some(item => 
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.specs?.model?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      // Apply sorting
      filteredOrders.sort((a, b) => {
        switch(sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "price_high":
            return (b.totalAmount || 0) - (a.totalAmount || 0);
          case "price_low":
            return (a.totalAmount || 0) - (b.totalAmount || 0);
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });

      setUserOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setUserOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Delete order function - ONLY for cancelled or delivered orders
  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUserOrders(prev => prev.filter(order => order._id !== orderId));
        setDeleteConfirm(null);
        if (selectedOrder && selectedOrder._id === orderId) {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }
        setActionSuccess("Order deleted successfully!");
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order");
    }
  };

  // Cancel order function
  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled"
        }),
      });

      if (response.ok) {
        // Update local state immediately
        setUserOrders(prev => 
          prev.map(order => 
            order._id === orderId 
              ? { ...order, status: "cancelled" }
              : order
          )
        );
        
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: "cancelled" }));
        }
        
        setCancelConfirm(null);
        setActionSuccess("Order cancelled successfully!");
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Error cancelling order. Please try again.");
    }
  };

  // Check if order can be deleted (only cancelled or delivered)
  const canDeleteOrder = (order) => {
    return order.status === "cancelled" || order.status === "delivered";
  };

  // Check if order can be cancelled (only pending or paid)
  const canCancelOrder = (order) => {
    return order.status === "pending" || order.status === "paid";
  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        const local = localStorage.getItem("cart");
        if (local) {
          setCart(JSON.parse(local));
          return;
        }

        const res = await fetch(`${API_BASE}/api/cart/${userId}`);
        const data = await res.json();
        if (data?.items?.length > 0) {
          setCart(data.items);
          localStorage.setItem("cart", JSON.stringify(data.items));
        }
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    if (cart && cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      fetch(`${API_BASE}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items: cart }),
      }).catch((err) => console.error("Cart save failed:", err));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const handleQuantity = (index, type) => {
    const newCart = [...cart];
    if (type === "increment") {
      newCart[index].quantity = (newCart[index].quantity || 1) + 1;
    } else if (type === "decrement") {
      newCart[index].quantity = Math.max(
        (newCart[index].quantity || 1) - 1,
        1
      );
    }
    setCart(newCart);
  };

  const handleRemove = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const validate = () => {
    if (!shippingInfo.name || !shippingInfo.province || !shippingInfo.district || !shippingInfo.city || !shippingInfo.address || !shippingInfo.postalCode || !shippingInfo.contact) {
      alert("⚠️ Please fill all delivery details properly.");
      return false;
    }
    if (!/^03\d{9}$/.test(shippingInfo.contact)) {
      alert("⚠️ Invalid contact number!");
      return false;
    }
    return true;
  };

  const handleOrder = async () => {
    if (!cart.length) return alert("Your cart is empty.");
    if (!validate()) return;
    setProcessing(true);

    const orderTotal = totalAmount;
    setFinalOrderAmount(orderTotal);
    setPaymentSuccessAmount(orderTotal);

    // ✅ ENHANCED: Properly format cart items for order with storage
    const orderItems = cart.map(item => ({
      name: item.name,
      brand: item.brand,
      specs: {
        model: item.specs?.model || item.name,
        ram: item.specs?.ram || "8GB",
        rom: item.specs?.rom || "128GB",  // ✅ STORAGE FIXED
        battery: item.specs?.battery || "N/A",
        frontCamera: item.specs?.frontCamera || "N/A", 
        backCamera: item.specs?.backCamera || "N/A",
        processor: item.specs?.processor || "N/A",
        display: item.specs?.display || "N/A",
        color: item.specs?.color || "N/A",
        price: item.specs?.price || item.price || 0
      },
      mainImage: item.mainImage || item.image || item.images?.[0],
      quantity: item.quantity || 1,
      price: item.specs?.price || item.price || 0
    }));

    if (paymentMethod === "cod") {
      try {
        const orderResponse = await fetch(`${API_BASE}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            items: orderItems,  // ✅ ENHANCED ITEMS USE KARO
            totalAmount: orderTotal,
            address: { 
              name: shippingInfo.name,
              province: shippingInfo.province, 
              district: shippingInfo.district, 
              city: shippingInfo.city, 
              address: shippingInfo.address, 
              postalCode: shippingInfo.postalCode, 
              contact: shippingInfo.contact 
            },
            paymentMethod,
            paid: false,
            status: "pending"
          }),
        });

        const orderData = await orderResponse.json();
        
        if (orderData.order?._id) {
          setOrderId(orderData.order._id);
        }

        await fetch(`${API_BASE}/api/cart/${userId}`, { method: "DELETE" });

        localStorage.removeItem("cart");
        setCart([]);
        setProcessing(false);
        setOrderStatus("pending");
        setShowSuccess(true);
      } catch (err) {
        setProcessing(false);
        alert("Order failed. Try again.");
      }
    } else if (paymentMethod === "stripe") {
      setProcessing(false);
      setShowPaymentModal(true);
    }
  };

  const finalizeOrder = async (paymentResult = {}) => {
    try {
      const orderTotal = finalOrderAmount || totalAmount;
      
      // ✅ ENHANCED: Properly format cart items for order with storage
      const orderItems = cart.map(item => ({
        name: item.name,
        brand: item.brand,
        specs: {
          model: item.specs?.model || item.name,
          ram: item.specs?.ram || "8GB",
          rom: item.specs?.rom || "128GB",  // ✅ STORAGE FIXED
          battery: item.specs?.battery || "N/A",
          frontCamera: item.specs?.frontCamera || "N/A", 
          backCamera: item.specs?.backCamera || "N/A",
          processor: item.specs?.processor || "N/A",
          display: item.specs?.display || "N/A",
          color: item.specs?.color || "N/A",
          price: item.specs?.price || item.price || 0
        },
        mainImage: item.mainImage || item.image || item.images?.[0],
        quantity: item.quantity || 1,
        price: item.specs?.price || item.price || 0
      }));
      
      const orderResponse = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          items: orderItems,  // ✅ ENHANCED ITEMS USE KARO
          totalAmount: orderTotal,
          address: { 
            name: shippingInfo.name,
            province: shippingInfo.province, 
            district: shippingInfo.district, 
            city: shippingInfo.city, 
            address: shippingInfo.address, 
            postalCode: shippingInfo.postalCode, 
            contact: shippingInfo.contact 
          },
          paymentMethod: "stripe",
          paid: true,
          paymentResult,
          status: "paid"
        }),
      });

      const orderData = await orderResponse.json();
      
      if (orderData.order?._id) {
        setOrderId(orderData.order._id);
      }

      await fetch(`${API_BASE}/api/cart/${userId}`, { method: "DELETE" });

      localStorage.removeItem("cart");
      setCart([]);
      setProcessing(false);
      setShowPaymentModal(false);
      
      setShowPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentSuccess(false);
        setOrderStatus("paid");
        setShowSuccess(true);
      }, 2500);
      
    } catch (err) {
      console.error("Finalize order error:", err);
      alert("Order finalization failed. Contact admin.");
      setProcessing(false);
    }
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 'paid':
        return { icon: FaCheckCircle, color: 'text-green-400', text: 'Payment Received' };
      case 'pending':
        return { icon: FaClock, color: 'text-yellow-400', text: 'Pending Payment' };
      case 'processing':
        return { icon: FaBox, color: 'text-blue-400', text: 'Processing' };
      case 'shipped':
        return { icon: FaShippingFast, color: 'text-purple-400', text: 'Shipped' };
      case 'delivered':
        return { icon: FaCheck, color: 'text-green-400', text: 'Delivered' };
      case 'cancelled':
        return { icon: FaTimes, color: 'text-red-400', text: 'Cancelled' };
      default:
        return { icon: FaClock, color: 'text-gray-400', text: 'Pending' };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "paid": return "bg-blue-500";
      case "processing": return "bg-purple-500";
      case "shipped": return "bg-indigo-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const StatusIcon = getStatusInfo(orderStatus).icon;
  const statusColor = getStatusInfo(orderStatus).color;
  const statusText = getStatusInfo(orderStatus).text;

  const displayAmount = showSuccess ? (finalOrderAmount || totalAmount) : totalAmount;

  // Enhanced Orders Section with Premium UI
  const renderOrdersSection = () => (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      {/* Orders Header with Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-yellow-400">My Orders</h3>
          <p className="text-gray-300">Manage and track your orders</p>
        </div>
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <div className="bg-white/5 rounded-lg px-3 py-2">
            <span className="text-sm text-gray-300">Total Orders: </span>
            <span className="text-white font-bold">{userOrders.length}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a0033] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        
        <select 
          value={ordersFilter}
          onChange={(e) => setOrdersFilter(e.target.value)}
          className="bg-[#1a0033] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-[#1a0033] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_high">Price: High to Low</option>
          <option value="price_low">Price: Low to High</option>
        </select>

        <button
          onClick={fetchUserOrders}
          className="bg-pink-500 hover:bg-pink-400 px-4 py-2 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2"
        >
          <FaFilter />
          Apply
        </button>
      </div>

      {ordersLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading your orders...</p>
          <p className="text-gray-500 text-sm">Please wait while we fetch your order history</p>
        </div>
      ) : userOrders.length === 0 ? (
        <div className="text-center py-12">
          <FaShoppingBag className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-xl mb-2">No orders found</p>
          <p className="text-gray-500 text-sm mb-6">You haven't placed any orders yet or no orders match your filters.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowOrders(false)}
              className="bg-pink-500 hover:bg-pink-400 px-6 py-3 rounded-full font-semibold text-white transition-all flex items-center gap-2"
            >
              <FaStore />
              Explore Products
            </button>
            <button
              onClick={() => {
                setOrdersFilter("all");
                setSearchTerm("");
                setSortBy("newest");
              }}
              className="bg-blue-500 hover:bg-blue-400 px-6 py-3 rounded-full font-semibold text-white transition-all flex items-center gap-2"
            >
              <FaUndo />
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4 border border-white/10 hover:border-pink-400 transition-all cursor-pointer group"
              onClick={() => {
                setSelectedOrder(order);
                setShowOrderDetails(true);
              }}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-white text-lg">Order #{order._id?.slice(-8)}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} text-white`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                {/* Order Actions */}
                <div className="flex items-center gap-2 mt-3 lg:mt-0">
                  {/* Only show Cancel button for orders that can be cancelled */}
                  {canCancelOrder(order) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCancelConfirm(order._id);
                      }}
                      className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-lg font-semibold text-white transition-all text-sm"
                    >
                     Cancel Order
                    </button>
                  )}
                  
                  {/* Only show Delete button for orders that can be deleted */}
                  {canDeleteOrder(order) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(order._id);
                      }}
                      className="p-2 text-red-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                      title="Delete Order"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300 mb-3">
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-400" />
                  <span className="truncate">{order.address?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMobileAlt className="text-green-400" />
                  <span>{order.address?.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-purple-400" />
                  <span className="truncate">{order.address?.city}, {order.address?.province}</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <p className="text-green-400 font-bold text-xl">
                  Rs {order.totalAmount?.toLocaleString()}
                </p>
                <div className="flex items-center gap-3 mt-2 lg:mt-0">
                  <span className="text-sm text-gray-400">
                    {order.items?.length} item{order.items?.length > 1 ? 's' : ''}
                  </span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                    <FaEye />
                    View Details
                  </button>
                </div>
              </div>

              {/* Order Items Preview - FIXED STORAGE DISPLAY */}
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {order.items?.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-center gap-3 min-w-0 bg-white/5 rounded-lg p-2 flex-shrink-0">
                      <img
                        src={item.mainImage || item.image || item.images?.[0] || "https://via.placeholder.com/50"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {getModelInfo(item)}
                        </p>
                        <p className="text-xs text-gray-400">
                          RAM: {getRamInfo(item)} | Storage: {getStorageInfo(item)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity || 1} • Rs {((getPriceInfo(item)) * (item.quantity || 1)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 4 && (
                    <div className="flex items-center justify-center bg-white/5 rounded-lg p-4 flex-shrink-0">
                      <span className="text-gray-400 text-sm">
                        +{order.items.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  // Enhanced Order Details Modal - FIXED STORAGE DISPLAY
  const renderOrderDetailsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#0a0022] to-[#2a0038] border border-white/10 rounded-2xl p-6 max-w-6xl w-full max-h-[95vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-pink-400">Order Details</h2>
          <button
            onClick={() => setShowOrderDetails(false)}
            className="text-gray-400 hover:text-white text-xl p-2 rounded-lg hover:bg-white/10 transition-all"
          >
            <FaTimes />
          </button>
        </div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4">
            <div className="text-blue-400 text-sm mb-1">Order Total</div>
            <div className="text-2xl font-bold text-white">Rs {selectedOrder.totalAmount?.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4">
            <div className="text-green-400 text-sm mb-1">Items</div>
            <div className="text-2xl font-bold text-white">{selectedOrder.items?.length}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4">
            <div className="text-purple-400 text-sm mb-1">Order Date</div>
            <div className="text-lg font-bold text-white">
              {new Date(selectedOrder.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="text-yellow-400 text-sm mb-1">Status</div>
            <div className={`text-lg font-bold ${getStatusColor(selectedOrder.status)} px-3 py-1 rounded-full text-center`}>
              {selectedOrder.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Items - FIXED STORAGE DISPLAY */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Order Items</h3>
            <div className="space-y-4">
              {selectedOrder.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={item.mainImage || item.image || item.images?.[0] || "https://via.placeholder.com/80"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-white text-lg">{getModelInfo(item)}</p>
                      <p className="text-sm text-gray-300">Brand: {getBrandInfo(item)}</p>
                      <p className="text-sm text-gray-300">
                        RAM: {getRamInfo(item)} | Storage: {getStorageInfo(item)}
                      </p>
                      <p className="text-sm text-gray-300">
                        {item.specs?.battery && `Battery: ${item.specs.battery} | `}
                        {item.specs?.display && `Display: ${item.specs.display}`}
                      </p>
                      <p className="text-sm text-gray-300">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <p className="text-green-400 font-bold text-lg">
                    Rs {((getPriceInfo(item)) * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping and Payment Info */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Shipping Address</h3>
              {selectedOrder.address && (
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-blue-400 text-lg" />
                    <div>
                      <p className="font-semibold text-white">{selectedOrder.address.name}</p>
                      <p className="text-sm">{selectedOrder.address.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-red-400 text-lg" />
                    <div>
                      <p className="text-white">{selectedOrder.address.address}</p>
                      <p className="text-sm">
                        {selectedOrder.address.city}, {selectedOrder.address.district}, {selectedOrder.address.province}
                      </p>
                      <p className="text-sm">Postal Code: {selectedOrder.address.postalCode}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Payment Information</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="text-white font-semibold">
                    {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className={`font-semibold ${selectedOrder.paid ? 'text-green-400' : 'text-yellow-400'}`}>
                    {selectedOrder.paid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Total Amount:</span>
                  <span className="text-green-400 font-bold">
                    Rs {selectedOrder.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Order Actions</h3>
              <div className="flex flex-wrap gap-3">
                {/* Only show Cancel button for orders that can be cancelled */}
                {canCancelOrder(selectedOrder) && (
                  <button
                    onClick={() => setCancelConfirm(selectedOrder._id)}
                    className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-lg font-semibold text-white transition-all flex items-center gap-2"
                  >
                    <FaTimes />
                    Cancel Order
                  </button>
                )}
                
                {/* Only show Delete button for orders that can be deleted */}
                {canDeleteOrder(selectedOrder) && (
                  <button
                    onClick={() => setDeleteConfirm(selectedOrder._id)}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold text-white transition-all flex items-center gap-2"
                  >
                    <FaTrash />
                    Delete Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Cancel Confirmation Modal
  const renderCancelConfirmation = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#0a0022] to-[#2a0038] border border-white/10 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-yellow-400 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Cancel Order?</h3>
          <p className="text-gray-300 mb-6">
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setCancelConfirm(null)}
              className="bg-gray-500 hover:bg-gray-400 px-6 py-2 rounded-lg font-semibold text-white transition-all flex items-center gap-2"
            >
              <FaUndo />
              Keep Order
            </button>
            <button
              onClick={() => cancelOrder(cancelConfirm)}
              className="bg-red-500 hover:bg-red-400 px-6 py-2 rounded-lg font-semibold text-white transition-all flex items-center gap-2"
            >
              <FaTimes />
              Cancel Order
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Delete Confirmation Modal
  const renderDeleteConfirmation = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#0a0022] to-[#2a0038] border border-white/10 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-400 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Delete Order?</h3>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete this order? This action cannot be undone and all order data will be permanently lost.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="bg-gray-500 hover:bg-gray-400 px-6 py-2 rounded-lg font-semibold text-white transition-all flex items-center gap-2"
            >
              <FaUndo />
              Keep Order
            </button>
            <button
              onClick={() => deleteOrder(deleteConfirm)}
              className="bg-red-500 hover:bg-red-400 px-6 py-2 rounded-lg font-semibold text-white transition-all flex items-center gap-2"
            >
              <FaTrash />
              Delete Order
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Success Message Modal
  const renderSuccessMessage = () => (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20"
      >
        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-2xl" />
          <div>
            <p className="font-semibold">Success!</p>
            <p className="text-sm opacity-90">{actionSuccess}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Payment Success Modal - Fixed position
  if (showPaymentSuccess) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-center p-8 w-full max-w-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <FaCheck className="text-6xl text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
          >
            Payment Successful!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-2"
          >
            Your payment of <span className="text-green-400 font-bold">Rs {paymentSuccessAmount.toLocaleString()}</span> has been processed.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-400"
          >
            Redirecting to order confirmation...
          </motion.p>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.6, duration: 2 }}
            className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-4"
          />
        </motion.div>
      </div>
    );
  }

  // Order Success Modal - Fixed position
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-center p-8 w-full max-w-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-black rounded-3xl border border-white/10"
        >
          <StatusIcon className={`text-6xl ${statusColor} mb-4 mx-auto`} />
          <h1 className="text-4xl font-bold mb-2">Order Placed Successfully 🎉</h1>
          
          {orderId && (
            <p className="text-lg text-gray-300 mb-2">
              Order ID: <span className="text-pink-400 font-bold">#{orderId.slice(-8)}</span>
            </p>
          )}
          
          <p className="text-lg text-gray-300 mb-2">
            Order Status: <span className={`${statusColor} font-bold`}>{statusText}</span>
          </p>
          <p className="text-lg text-gray-300 mb-2">
            Total Amount: <span className="text-green-400 font-bold">Rs {displayAmount.toLocaleString()}</span>
          </p>
          <p className="text-lg text-gray-300 mb-6">
            Thank you for shopping with <span className="text-pink-400">MobileBazar!</span>
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/products")}
              className="bg-pink-500 hover:bg-pink-400 px-6 py-3 rounded-full font-semibold text-white transition-all shadow-lg flex items-center gap-2"
            >
              <FaStore />
              Explore More Products
            </button>
            <button
              onClick={() => {
                setShowSuccess(false);
                setShowOrders(true);
                fetchUserOrders();
              }}
              className="bg-blue-500 hover:bg-blue-400 px-6 py-3 rounded-full font-semibold text-white transition-all shadow-lg flex items-center gap-2"
            >
              <FaEye />
              View My Orders
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0022] via-[#1a0033] to-[#35004d] text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Action Success Message */}
        {actionSuccess && renderSuccessMessage()}

        {/* Header with Enhanced Order History Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-pink-400">Your Cart</h2>
            <p className="text-gray-300 mt-2">
              {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <button
            onClick={() => {
              setShowOrders(!showOrders);
              if (!showOrders) {
                fetchUserOrders();
              }
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 px-6 py-3 rounded-full font-semibold text-white transition-all flex items-center gap-2 shadow-lg"
          >
            <FaHistory />
            {showOrders ? "Hide Orders" : "Show My Orders"}
            {userOrders.length > 0 && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {userOrders.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 justify-center">
          {/* Left Side - Either Cart Items OR Orders */}
          <div className="flex-1 max-w-4xl space-y-6">
            {showOrders ? (
              renderOrdersSection()
            ) : (
              /* Cart Items Section - FIXED STORAGE DISPLAY */
              <>
                {cart.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-gray-400 gap-4 py-20">
                    <motion.div animate={{ y: [-10, 0, -10] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <FaShoppingBag className="text-6xl text-pink-400" />
                    </motion.div>
                    <p className="text-lg font-semibold">Your cart is empty!</p>
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() => navigate("/products")}
                        className="bg-pink-500 hover:bg-pink-400 px-6 py-2 rounded-full font-semibold text-white transition-all flex items-center gap-2"
                      >
                        <FaStore />
                        Explore Products
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  cart.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between bg-white/10 border border-white/10 p-5 rounded-2xl shadow-xl backdrop-blur-md hover:shadow-[0_0_25px_rgba(255,0,255,0.2)] transition-all">
                      <div className="flex items-center gap-4">
                        <img src={item.mainImage || item.image || item.images?.[0] || "https://via.placeholder.com/100"} alt={item.name} className="w-24 h-24 object-cover rounded-xl shadow-lg" />
                        <div>
                          <h3 className="text-xl font-semibold">{getModelInfo(item)}</h3>
                          <p className="text-gray-300 text-sm"><span className="text-pink-400 font-medium">Brand:</span> {getBrandInfo(item)}</p>
                          <p className="text-gray-300 text-sm"><span className="text-pink-400 font-medium">RAM:</span> {getRamInfo(item)}</p>
                          <p className="text-gray-300 text-sm"><span className="text-pink-400 font-medium">Storage:</span> {getStorageInfo(item)}</p>
                          <p className="text-emerald-400 font-bold mt-1">Rs {((getPriceInfo(item)) * (item.quantity || 1)).toLocaleString()}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => handleQuantity(i, "decrement")} className="bg-pink-500 px-2 rounded-full"><FaMinus /></button>
                            <span>{item.quantity || 1}</span>
                            <button onClick={() => handleQuantity(i, "increment")} className="bg-pink-500 px-2 rounded-full"><FaPlus /></button>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleRemove(i)} className="text-red-400 hover:text-red-500 transition-all"><FaTrash className="text-2xl" /></button>
                    </motion.div>
                  ))
                )}
              </>
            )}
          </div>

          {/* Right - Checkout Section - Only show when cart has items AND not showing orders */}
          {cart.length > 0 && !showOrders && (
            <div className="w-full lg:w-96">
              <motion.div 
                initial={{ opacity: 0, x: 40 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="sticky top-10 bg-white/10 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6"
              >
                <h2 className="text-3xl font-bold mb-3 text-yellow-400">Checkout</h2>

                {/* Address Section */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter your full name"
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                      className="w-full bg-[#1a0033] border border-gray-500 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <select 
                    value={shippingInfo.province} 
                    onChange={(e) => setShippingInfo({...shippingInfo, province: e.target.value})} 
                    className="w-full bg-[#1a0033] text-white border border-gray-500 p-3 rounded-lg"
                  >
                    <option value="" className="text-gray-500">Select Province</option>
                    {pakistanProvinces.map((p) => (
                      <option key={p} value={p} className="text-white bg-[#1a0033]">{p}</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Enter District" 
                    value={shippingInfo.district} 
                    onChange={(e) => setShippingInfo({...shippingInfo, district: e.target.value})} 
                    className="w-full bg-[#1a0033] border border-gray-500 p-3 rounded-lg text-white" 
                  />
                  <input 
                    type="text" 
                    placeholder="Enter City" 
                    value={shippingInfo.city} 
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})} 
                    className="w-full bg-[#1a0033] border border-gray-500 p-3 rounded-lg text-white" 
                  />
                  <input 
                    type="text" 
                    placeholder="Street / Apartment" 
                    value={shippingInfo.address} 
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})} 
                    className="w-full bg-[#1a0033] border border-gray-500 p-3 rounded-lg text-white" 
                  />
                  <input 
                    type="text" 
                    placeholder="Postal Code" 
                    value={shippingInfo.postalCode} 
                    onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})} 
                    className="w-full bg-[#1a0033] border border-gray-500 p-3 rounded-lg text-white" 
                  />
                  <input 
                    type="text" 
                    placeholder="03XXXXXXXXX" 
                    value={shippingInfo.contact} 
                    onChange={(e) => setShippingInfo({...shippingInfo, contact: e.target.value})} 
                    className="w-full bg-[#1a0033] border border-gray-500 p-3 rounded-lg text-white" 
                  />
                </div>

                {/* Payment Section */}
                <div className="space-y-2 mt-4">
                  <h3 className="text-lg font-semibold text-yellow-400">Select Payment Method:</h3>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-pink-400" />
                    Cash on Delivery 💵
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="payment" value="stripe" checked={paymentMethod === "stripe"} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-pink-400" />
                    <FaCreditCard className="inline text-lg mr-1 text-blue-400" /> Pay Online
                  </label>
                </div>

                {/* Summary */}
                <div className="border-t border-gray-600 pt-4 text-gray-200 space-y-2">
                  <div className="flex justify-between"><span>Subtotal</span><span>Rs {totalAmount.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xl font-bold text-white"><span>Total</span><span>Rs {totalAmount.toLocaleString()}</span></div>
                </div>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleOrder} disabled={processing} className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-4 rounded-full font-bold text-lg mt-4 shadow-lg">
                  {processing ? "Processing..." : "Place Order"}
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <Elements stripe={stripePromise}>
          <PaymentModal
            totalAmount={finalOrderAmount || totalAmount}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={(paymentResult) => finalizeOrder(paymentResult)}
          />
        </Elements>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && renderOrderDetailsModal()}

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && renderCancelConfirmation()}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && renderDeleteConfirmation()}
    </div>
  );
};

export default Cart;

/* ---------------------- Enhanced PaymentModal component ---------------------- */
function PaymentModal({ totalAmount = 0, onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [selected, setSelected] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  const amountInPaisa = Math.round(Number(totalAmount || 0) * 100);

  const cardElementOptions = {
    style: {
      base: {
        color: "#fff",
        "::placeholder": { color: "#9ca3af" },
        fontSize: "16px",
      },
    },
    hidePostalCode: true,
  };

  const handleCardPayment = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/payment/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaisa }),
      });
      const data = await res.json();
      if (!data?.clientSecret) throw new Error("No client secret from server");

      const cardElement = elements.getElement(CardElement);
      const confirm = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: "Customer" },
        },
      });

      if (confirm.error) {
        alert(confirm.error.message || "Payment failed");
        setProcessing(false);
        return;
      }

      if (confirm.paymentIntent && confirm.paymentIntent.status === "succeeded") {
        onSuccess({ id: confirm.paymentIntent.id, method: "card" });
      } else {
        alert("Payment not completed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleMobileWallet = async () => {
    if (!/^03\d{9}$/.test(mobileNumber)) {
      alert("Enter valid mobile number (03XXXXXXXXX)");
      return;
    }
    setProcessing(true);
    try {
      setTimeout(() => {
        onSuccess({ id: `mobile-${Date.now()}`, method: selected, mobile: mobileNumber });
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Mobile payment failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl bg-gradient-to-br from-[#0b002b] to-[#2a0038] rounded-3xl p-6 text-white shadow-2xl border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Secure Payment</h3>
          <button onClick={onClose} className="text-gray-300 hover:text-white">✕</button>
        </div>

        <p className="text-gray-300 mb-4">Choose a payment method and complete secure checkout (test mode).</p>

        {/* Options */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button onClick={() => setSelected("card")} className={`p-3 rounded-xl text-left ${selected === "card" ? "ring-2 ring-pink-400 bg-white/5" : "bg-white/3"}`}>
            <div className="flex items-center gap-2">
              <FaCreditCard className="text-2xl text-blue-300" />
              <div>
                <div className="font-semibold">Debit / Credit</div>
                <div className="text-xs text-gray-300">Visa, MasterCard</div>
              </div>
            </div>
          </button>

          <button onClick={() => setSelected("easypaisa")} className={`p-3 rounded-xl text-left ${selected === "easypaisa" ? "ring-2 ring-pink-400 bg-white/5" : "bg-white/3"}`}>
            <div className="flex items-center gap-2">
              <FaMobileAlt className="text-2xl text-green-300" />
              <div>
                <div className="font-semibold">EasyPaisa</div>
                <div className="text-xs text-gray-300">Mobile wallet</div>
              </div>
            </div>
          </button>

          <button onClick={() => setSelected("jazzcash")} className={`p-3 rounded-xl text-left ${selected === "jazzcash" ? "ring-2 ring-pink-400 bg-white/5" : "bg-white/3"}`}>
            <div className="flex items-center gap-2">
              <FaMobileAlt className="text-2xl text-yellow-300" />
              <div>
                <div className="font-semibold">JazzCash</div>
                <div className="text-xs text-gray-300">Mobile wallet</div>
              </div>
            </div>
          </button>
        </div>

        {/* Selected form */}
        <div className="mb-4">
          {selected === "card" ? (
            <div className="space-y-3 bg-white/5 p-4 rounded-lg">
              <label className="text-xs text-gray-300">Card Details</label>
              <div className="bg-[#0f1530] p-3 rounded">
                <CardElement options={cardElementOptions} />
              </div>
              <div className="text-xs text-gray-400">Use Stripe test card: 4242 4242 4242 4242 (any future expiry, any CVC)</div>
            </div>
          ) : (
            <div className="space-y-3 bg-white/5 p-4 rounded-lg">
              <label className="text-xs text-gray-300">Mobile Number</label>
              <input value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="03XXXXXXXXX" className="w-full p-3 rounded bg-[#0f1530] text-white border border-white/10" />
              <div className="text-xs text-gray-400">We will simulate mobile wallet payment for test.</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="text-sm text-gray-300">Amount</div>
            <div className="text-xl font-bold">Rs {Number(totalAmount).toLocaleString()}</div>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">Cancel</button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={selected === "card" ? handleCardPayment : handleMobileWallet} className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-semibold">
              {processing ? "Processing..." : "Pay Now"}
            </motion.button>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-4">Payment handled securely via Stripe (test mode).</div>
      </motion.div>
    </div>
  );
}