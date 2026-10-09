import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaBox,
  FaShippingFast,
  FaCheck,
  FaTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaCreditCard,
  FaMoneyBillWave,
  FaShoppingBag,
  FaExclamationTriangle,
  FaTrash,
  FaUserCircle,
  FaMobileAlt,
  FaArrowLeft,
  FaShoppingCart,
  FaTag,
  FaCalendar,
  FaIdCard,
  FaBarcode,
  FaStar,
  FaGem,
  FaCrown,
  FaShieldAlt,
  FaAward,
  FaRocket,
  FaGlobe,
  FaTruck,
  FaHome,
  FaCity,
  FaMapPin,
  FaReceipt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [error, setError] = useState("");
  
  // Modal ke states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [messagePosition, setMessagePosition] = useState({ top: 0, left: 0, visible: false });

  const navigate = useNavigate();

  // Order status options
  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-500", icon: <FaClock className="inline mr-1" /> },
    { value: "paid", label: "Paid", color: "bg-blue-500", icon: <FaCheckCircle className="inline mr-1" /> },
    { value: "processing", label: "Processing", color: "bg-purple-500", icon: <FaBox className="inline mr-1" /> },
    { value: "shipped", label: "Shipped", color: "bg-indigo-500", icon: <FaShippingFast className="inline mr-1" /> },
    { value: "out-for-delivery", label: "Out for Delivery", color: "bg-orange-500", icon: <FaTruck className="inline mr-1" /> },
    { value: "delivered", label: "Delivered", color: "bg-green-500", icon: <FaCheck className="inline mr-1" /> },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500", icon: <FaTimes className="inline mr-1" /> },
  ];

  useEffect(() => {
    const adminRoutes = ['/admin/dashboard', '/admin/add-product', '/admin/products', '/admin/orders'];
    
    const currentRoute = window.location.pathname;
    const lastRoute = localStorage.getItem('lastAdminRoute');
    
    if (adminRoutes.includes(currentRoute)) {
      if (!lastRoute || lastRoute !== currentRoute) {
        localStorage.setItem('lastAdminRoute', currentRoute);
      }
    }
  }, []);

  const handleBackToDashboard = () => {
    navigate("/admin/dashboard");
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Success message auto hide
  useEffect(() => {
    if (successMessage && !messagePosition.visible) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, messagePosition.visible]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      
      const apiUrl = `${API_BASE}/api/orders`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      let ordersArray = [];
      
      if (Array.isArray(data)) {
        ordersArray = data;
      } else if (data.orders && Array.isArray(data.orders)) {
        ordersArray = data.orders;
      } else if (data.success && Array.isArray(data.orders)) {
        ordersArray = data.orders;
      } else {
        ordersArray = [];
      }
      
      setOrders(ordersArray);
      
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setError(`Failed to load orders: ${error.message}`);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        setError("Network error: Could not connect to server. Please check if backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Open status change modal
  const openStatusModal = (order, status) => {
    setOrderToUpdate(order);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  // Open delete modal with position tracking
  const openDeleteModal = (order, event) => {
    setOrderToUpdate(order);
    setShowDeleteModal(true);
    
    // Store click position for success message
    if (event) {
      const rect = event.target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      setMessagePosition({
        top: rect.top + scrollTop - 60,
        left: rect.left,
        visible: false
      });
    }
  };

  // Update order status with confirmation
  const confirmUpdateStatus = async () => {
    if (!orderToUpdate || !newStatus) return;
    
    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE}/api/orders/${orderToUpdate._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(orders.map(order => 
          order._id === orderToUpdate._id ? { ...order, status: newStatus } : order
        ));
        
        if (selectedOrder && selectedOrder._id === orderToUpdate._id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        
        setSuccessMessage(`✅ Order status updated to ${newStatus} successfully!`);
      } else {
        setSuccessMessage("❌ Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setSuccessMessage("❌ Error updating order status");
    } finally {
      setActionLoading(false);
      setShowStatusModal(false);
      setOrderToUpdate(null);
      setNewStatus("");
    }
  };

  // Delete order with position-based success message
  const confirmDeleteOrder = async (event) => {
    if (!orderToUpdate) return;
    
    try {
      setActionLoading(true);
      
      // Get click position for the message
      const rect = event.target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      setMessagePosition({
        top: rect.top + scrollTop - 60,
        left: rect.left,
        visible: true
      });

      const response = await fetch(`${API_BASE}/api/orders/${orderToUpdate._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(orders.filter(order => order._id !== orderToUpdate._id));
        
        if (selectedOrder && selectedOrder._id === orderToUpdate._id) {
          setSelectedOrder(null);
          setShowOrderDetails(false);
        }
        
        setSuccessMessage("✅ Order deleted successfully!");
        
        // Auto hide after 3 seconds
        setTimeout(() => {
          setMessagePosition(prev => ({ ...prev, visible: false }));
          setSuccessMessage("");
        }, 3000);
        
      } else {
        setSuccessMessage("❌ Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setSuccessMessage("❌ Error deleting order");
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
      setOrderToUpdate(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <FaClock className="text-yellow-500" />;
      case "paid": return <FaCheckCircle className="text-blue-500" />;
      case "processing": return <FaBox className="text-purple-500" />;
      case "shipped": return <FaShippingFast className="text-indigo-500" />;
      case "out-for-delivery": return <FaShippingFast className="text-orange-500" />;
      case "delivered": return <FaCheck className="text-green-500" />;
      case "cancelled": return <FaTimes className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "paid": return "bg-blue-500";
      case "processing": return "bg-purple-500";
      case "shipped": return "bg-indigo-500";
      case "out-for-delivery": return "bg-orange-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Get user name - handle both populated and non-populated data
  const getUserName = (order) => {
    if (order.userId?.name) {
      return order.userId.name;
    }
    if (order.userId?.email) {
      return order.userId.email.split('@')[0];
    }
    if (order.address?.name) {
      return order.address.name;
    }
    return "Customer";
  };

  // Get user email
  const getUserEmail = (order) => {
    if (order.userId?.email) {
      return order.userId.email;
    }
    return "No email";
  };

  // Get phone number
  const getPhoneNumber = (order) => {
    if (order.address?.contact) {
      return order.address.contact;
    }
    return "No phone";
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      
      // Search in order ID
      if (order._id?.toLowerCase().includes(searchLower)) return true;
      
      // Search in customer name
      if (getUserName(order).toLowerCase().includes(searchLower)) return true;
      
      // Search in phone number
      if (getPhoneNumber(order).includes(searchTerm)) return true;
      
      // Search in email
      if (getUserEmail(order).toLowerCase().includes(searchLower)) return true;
      
      // Search in product names/models
      if (order.items?.some(item => 
        item.name?.toLowerCase().includes(searchLower) ||
        item.specs?.model?.toLowerCase().includes(searchLower) ||
        item.brand?.toLowerCase().includes(searchLower)
      )) return true;
      
      return false;
    })
    .filter(order => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === "totalAmount") {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (sortField === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortOrder === "asc" ? <FaSortUp className="text-blue-500" /> : <FaSortDown className="text-blue-500" />;
  };

  const getPaymentIcon = (paymentMethod, paid) => {
    if (paymentMethod === "stripe" || paymentMethod === "Debt/Credit" || paid) {
      return <FaCreditCard className="text-blue-400" />;
    }
    return <FaMoneyBillWave className="text-green-400" />;
  };

  const getPaymentText = (paymentMethod, paid) => {
    if (paymentMethod === "stripe" && paid) {
      return "Debt/Credit Card";
    }
    if (paymentMethod === "Debt/Credit" && paid) {
      return "Debt/Credit Card";
    }
    if (paymentMethod === "cod" && !paid) {
      return "Cash on Delivery";
    }
    if (paymentMethod === "easypaisa") {
      return "EasyPaisa";
    }
    if (paymentMethod === "jazzcash") {
      return "JazzCash";
    }
    return paymentMethod;
  };

  // Helper functions for order details
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

  // Check if order can be deleted (only cancelled or delivered)
  const canDeleteOrder = (order) => {
    return order.status === "cancelled" || order.status === "delivered";
  };

  // Check if order can be cancelled (only pending or paid)
  const canCancelOrder = (order) => {
    return order.status === "pending" || order.status === "paid";
  };

  // Handle row click - open modal when clicking anywhere on row
  const handleRowClick = (order, event) => {
    if (
      event.target.closest('button') || 
      event.target.closest('select') ||
      event.target.closest('.action-button')
    ) {
      return;
    }
    
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Premium Order Details Modal
  const renderOrderDetailsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-gradient-to-br from-[#0a0022] via-[#1a0033] to-[#2a0044] border-2 border-pink-500/30 rounded-3xl p-8 max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl shadow-pink-500/20 backdrop-blur-xl"
      >
        {/* Premium Header */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaGem className="text-4xl text-pink-400 animate-pulse" />
              <FaCrown className="absolute -top-2 -right-2 text-yellow-400 text-lg" />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Order Details
              </h2>
              <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                <FaShieldAlt className="text-green-400" />
                Premium Order Management System
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowOrderDetails(false)}
            className="text-gray-400 hover:text-white text-2xl p-3 rounded-2xl hover:bg-white/10 transition-all border border-white/10 hover:border-pink-500/50"
          >
            <FaTimes />
          </motion.button>
        </div>

        {/* Order ID & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-blue-300 text-sm mb-2 flex items-center gap-2">
              <FaIdCard />
              Order ID
            </div>
            <div className="text-xl font-mono font-bold text-white flex items-center gap-2">
              <FaBarcode className="text-blue-400" />
              #{selectedOrder._id?.slice(-12).toUpperCase()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-green-300 text-sm mb-2 flex items-center gap-2">
              <FaReceipt />
              Total Amount
            </div>
            <div className="text-2xl font-bold text-white">Rs {selectedOrder.totalAmount?.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-purple-300 text-sm mb-2 flex items-center gap-2">
              <FaShoppingCart />
              Items
            </div>
            <div className="text-2xl font-bold text-white">{selectedOrder.items?.length}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-yellow-300 text-sm mb-2 flex items-center gap-2">
              <FaCalendar />
              Order Date
            </div>
            <div className="text-lg font-bold text-white">
              {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-pink-300 text-sm mb-2 flex items-center gap-2">
              <FaRocket />
              Status
            </div>
            <div className={`text-lg font-bold px-4 py-2 rounded-full text-center border-2 ${getStatusColor(selectedOrder.status)} border-white/20 shadow-lg`}>
              {selectedOrder.status?.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items - Premium Design */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent flex items-center gap-3">
              <FaShoppingBag className="text-yellow-400" />
              Order Items
              <span className="text-sm bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full">
                {selectedOrder.items?.length} items
              </span>
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {selectedOrder.items?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-white/5 to-white/10 rounded-xl hover:from-white/10 hover:to-white/15 transition-all border border-white/5 hover:border-pink-500/30 group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <img
                        src={item.mainImage || item.image || item.images?.[0] || "https://via.placeholder.com/80"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl border-2 border-white/10 group-hover:border-pink-400/50 transition-all"
                      />
                      <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {item.quantity || 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-lg group-hover:text-pink-300 transition-colors">
                        {getModelInfo(item)}
                      </p>
                      <p className="text-sm text-gray-300 flex items-center gap-2">
                        <FaTag className="text-blue-400" />
                        Brand: <span className="text-white font-semibold">{getBrandInfo(item)}</span>
                      </p>
                      <p className="text-sm text-gray-300 flex items-center gap-2 mt-1">
                        <FaStar className="text-yellow-400" />
                        RAM: <span className="text-white">{getRamInfo(item)}</span> | 
                        Storage: <span className="text-white">{getStorageInfo(item)}</span>
                      </p>
                      {item.specs?.battery && (
                        <p className="text-xs text-gray-400 mt-1">
                          🔋 Battery: {item.specs.battery} | 
                          📱 Display: {item.specs.display}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-xl">
                      Rs {((getPriceInfo(item)) * (item.quantity || 1)).toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-sm">per item</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Shipping and Payment Info - Premium Design */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
                <FaUserCircle className="text-blue-400" />
                Customer Information
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <FaUser className="text-blue-400 text-2xl" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{getUserName(selectedOrder)}</p>
                    <p className="text-sm text-gray-400">{getUserEmail(selectedOrder)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="bg-green-500/20 p-3 rounded-xl">
                    <FaMobileAlt className="text-green-400 text-2xl" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{getPhoneNumber(selectedOrder)}</p>
                    <p className="text-sm text-gray-400">Contact Number</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
                <FaMapMarkerAlt className="text-green-400" />
                Shipping Address
              </h3>
              {selectedOrder.address && (
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="bg-red-500/20 p-3 rounded-xl">
                      <FaHome className="text-red-400 text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{selectedOrder.address.address}</p>
                      <p className="text-sm">
                        <FaCity className="inline mr-1 text-blue-400" />
                        {selectedOrder.address.city}, {selectedOrder.address.district}
                      </p>
                      <p className="text-sm">
                        <FaGlobe className="inline mr-1 text-purple-400" />
                        {selectedOrder.address.province}
                      </p>
                      <p className="text-sm">
                        <FaMapPin className="inline mr-1 text-yellow-400" />
                        Postal Code: {selectedOrder.address.postalCode}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
                <FaCreditCard className="text-purple-400" />
                Payment Information
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="flex items-center gap-2">
                    <FaCreditCard className="text-blue-400" />
                    Payment Method:
                  </span>
                  <span className="text-white font-bold bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
                    {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="flex items-center gap-2">
                    <FaAward className="text-yellow-400" />
                    Payment Status:
                  </span>
                  <span className={`font-bold px-4 py-2 rounded-full border ${
                    selectedOrder.paid 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }`}>
                    {selectedOrder.paid ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-400">
                    Rs {selectedOrder.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent flex items-center gap-3">
                <FaRocket className="text-orange-400" />
                Order Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                {/* Only show Cancel button for orders that can be cancelled */}
                {canCancelOrder(selectedOrder) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowOrderDetails(false);
                      openStatusModal(selectedOrder, "cancelled");
                    }}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center gap-3 border border-red-400/30 shadow-lg shadow-red-500/20 action-button"
                  >
                    <FaTimes />
                    Cancel Order
                  </motion.button>
                )}
                
                {/* Only show Delete button for orders that can be deleted */}
                {canDeleteOrder(selectedOrder) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      setShowOrderDetails(false);
                      openDeleteModal(selectedOrder, e);
                    }}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center gap-3 border border-gray-500/30 shadow-lg action-button"
                  >
                    <FaTrash />
                    Delete Order
                  </motion.button>
                )}

                {/* Status Update Options */}
                <div className="flex-1 min-w-[200px]">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => openStatusModal(selectedOrder, e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none action-button"
                  >
                    <option value="" disabled>Update Status</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <FaShieldAlt className="text-green-400" />
            Secure Order Management • Premium Admin System • 
            <span className="text-pink-400 font-semibold"> Mobile Bazar</span>
          </p>
        </div>
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0022] via-[#1a0033] to-[#35004d] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto absolute top-2 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-white text-lg mt-4">Loading orders...</p>
          <p className="text-gray-400 text-sm">Please wait while we fetch your orders</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0022] via-[#1a0033] to-[#35004d] flex items-center justify-center">
        <div className="text-white text-center">
          <FaTimes className="text-6xl text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Orders</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-pink-500 hover:bg-pink-400 px-6 py-2 rounded-full font-semibold text-white transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0022] via-[#1a0033] to-[#35004d] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Position-based Success Message for Delete */}
        {successMessage && messagePosition.visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{
              position: 'absolute',
              top: `${messagePosition.top}px`,
              left: `${messagePosition.left}px`,
              zIndex: 1000,
            }}
            className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300 backdrop-blur-sm shadow-2xl min-w-max"
          >
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-400 text-xl" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          </motion.div>
        )}

        {/* Regular Success Message for other actions */}
        {successMessage && !messagePosition.visible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-400 text-xl" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          </motion.div>
        )}

        {/* Back to Dashboard Button */}
        <div className="flex justify-start mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToDashboard}
            className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all border border-pink-400/30 shadow-pink-500/20"
          >
            <FaArrowLeft className="text-lg" />
            <span>Back to Dashboard</span>
          </motion.button>
        </div>

        {/* Premium Header */}
        <div className="mb-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4"
          >
            Order Management
          </motion.h1>
          <p className="text-gray-300 text-lg">Manage and track all customer orders with premium interface</p>
        </div>

        {/* Premium Filters and Search */}
        <div className="bg-white/10 border border-white/10 rounded-2xl p-6 mb-6 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by Order ID, Name, Phone, Email, or Product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1a0033] border border-gray-500 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-gray-400 text-lg" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1a0033] border border-gray-500 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none backdrop-blur-sm"
              >
                <option value="all">All Statuses</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl p-4 border border-pink-500/30 backdrop-blur-sm">
              <p className="text-sm text-gray-300">Total Orders</p>
              <p className="text-3xl font-bold text-pink-400">{filteredOrders.length}</p>
            </div>
          </div>
        </div>

        {/* Premium Orders Table */}
        <div className="bg-white/10 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort("_id")}
                  >
                    <div className="flex items-center gap-2">
                      <FaIdCard className="text-blue-400" />
                      Order ID
                      {getSortIcon("_id")}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaUserCircle className="text-green-400" />
                      Customer
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort("totalAmount")}
                  >
                    <div className="flex items-center gap-2">
                      <FaReceipt className="text-yellow-400" />
                      Amount
                      {getSortIcon("totalAmount")}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaCreditCard className="text-purple-400" />
                      Payment
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaRocket className="text-pink-400" />
                      Status
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-cyan-400" />
                      Date
                      {getSortIcon("createdAt")}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaEye className="text-blue-400" />
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOrders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={(e) => handleRowClick(order, e)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-bold text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10 group-hover:border-pink-500/30 transition-all">
                        #{order._id?.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        <div className="flex items-center gap-2 mb-1">
                          <FaUserCircle className="text-blue-400 text-lg" />
                          <span className="font-bold text-white">{getUserName(order)}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                        <FaMobileAlt className="text-green-400" />
                        {getPhoneNumber(order)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getUserEmail(order)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-green-400 bg-green-500/10 px-3 py-2 rounded-xl border border-green-500/20">
                        Rs {order.totalAmount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(order.paymentMethod, order.paid)}
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          order.paid 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        }`}>
                          {getPaymentText(order.paymentMethod, order.paid)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => openStatusModal(order, e.target.value)}
                        className={`text-xs font-bold px-3 py-2 rounded-full border-2 focus:ring-2 focus:ring-pink-500 ${getStatusColor(order.status)} text-white cursor-pointer border-white/20 shadow-lg transition-all action-button`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {/* ✅ Details Button - Eye icon ke saath */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 border border-blue-400/30 action-button"
                          title="View Details"
                        >
                          <FaEye className="text-sm" />
                          Details
                        </motion.button>

                        {/* ✅ Delete Button - Sirf icon, no text */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(order, e);
                          }}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-3 rounded-xl font-semibold transition-all flex items-center justify-center shadow-lg shadow-red-500/20 border border-red-400/30 action-button"
                          title="Delete Order"
                        >
                          <FaTrash className="text-sm" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-16">
              <FaShoppingBag className="text-8xl text-gray-600 mx-auto mb-6 opacity-50" />
              <p className="text-gray-400 text-xl font-semibold mb-2">No orders found</p>
              {searchTerm && (
                <p className="text-gray-500 text-sm">
                  No orders matching "<span className="text-pink-400">"{searchTerm}"</span>". Try a different search term.
                </p>
              )}
              {orders.length === 0 && !searchTerm && (
                <p className="text-gray-500 text-sm">
                  No orders in the system yet. Orders will appear here when customers place orders.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && renderOrderDetailsModal()}

      {/* Status Change Confirmation Modal */}
      {showStatusModal && orderToUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#0a0022] to-[#2a0038] border-2 border-yellow-500/30 rounded-2xl p-8 max-w-md w-full backdrop-blur-xl"
          >
            <div className="text-center mb-6">
              <FaExclamationTriangle className="text-5xl text-yellow-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-white mb-2">Confirm Status Change</h3>
              <p className="text-gray-300">
                Are you sure you want to change order <span className="font-mono text-pink-400 font-bold">#{orderToUpdate._id?.slice(-8)}</span> status from 
                <span className={`mx-2 px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(orderToUpdate.status)} border-white/20`}>
                  {orderToUpdate.status}
                </span> to 
                <span className={`mx-2 px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(newStatus)} border-white/20`}>
                  {newStatus}
                </span>?
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStatusModal(false)}
                disabled={actionLoading}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-xl text-white transition-all disabled:opacity-50 font-semibold border border-gray-500/30"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmUpdateStatus}
                disabled={actionLoading}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl text-white transition-all disabled:opacity-50 font-semibold flex items-center gap-2 border border-pink-400/30 shadow-lg shadow-pink-500/20"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  "Confirm Change"
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && orderToUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#0a0022] to-[#2a0038] border-2 border-red-500/30 rounded-2xl p-8 max-w-md w-full backdrop-blur-xl"
          >
            <div className="text-center mb-6">
              <FaExclamationTriangle className="text-5xl text-red-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-white mb-2">Delete Order</h3>
              <p className="text-gray-300">
                Are you absolutely sure you want to delete order <span className="font-mono text-pink-400 font-bold">#{orderToUpdate._id?.slice(-8)}</span>?
              </p>
              <p className="text-red-400 text-sm mt-3 font-bold bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/30">
                <FaExclamationTriangle className="inline mr-2" />
                This action cannot be undone!
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-xl text-white transition-all disabled:opacity-50 font-semibold border border-gray-500/30"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => confirmDeleteOrder(e)}
                disabled={actionLoading}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl text-white transition-all disabled:opacity-50 font-semibold flex items-center gap-2 border border-red-400/30 shadow-lg shadow-red-500/20"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Delete Order
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Order;