// src/Admin/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, PlusCircle, List, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newOrdersCount, setNewOrdersCount] = useState(0);


  useEffect(() => {
    const adminRoutes = ['/admin/dashboard', '/admin/add-product', '/admin/products', '/admin/orders'];
    
    if (adminRoutes.includes(location.pathname)) {
      localStorage.setItem('lastAdminRoute', location.pathname);
      console.log("📍 Sidebar: Admin route tracked:", location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchNewOrdersCount = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/orders`);
        const data = await response.json();
        
        let ordersArray = [];
        if (Array.isArray(data)) {
          ordersArray = data;
        } else if (data.orders && Array.isArray(data.orders)) {
          ordersArray = data.orders;
        } else if (data.success && Array.isArray(data.orders)) {
          ordersArray = data.orders;
        }
        
        // Get last seen count from localStorage
        const lastSeenCount = parseInt(localStorage.getItem('lastSeenOrderCount') || '0');
        
        // Calculate new orders (current - last seen)
        const currentCount = ordersArray.length;
        const newOrders = Math.max(0, currentCount - lastSeenCount);
        
        setNewOrdersCount(newOrders);
      } catch (error) {
        console.error("Error fetching orders count:", error);
      }
    };

    fetchNewOrdersCount();

    // Refresh every 30 seconds
    const interval = setInterval(fetchNewOrdersCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Check if user is on orders page - if yes, hide badge
  const isOnOrdersPage = location.pathname === '/admin/orders';
  

  const showBadge = !isOnOrdersPage && newOrdersCount > 0;

  const handleDashboardClick = (e) => {
    e.preventDefault();
    const lastRoute = localStorage.getItem('lastAdminRoute') || '/admin/dashboard';
    console.log("🚀 Sidebar: Navigating to last admin route:", lastRoute);
    navigate(lastRoute);
  };

  const links = [
    { 
      path: "/admin/dashboard", 
      name: "Dashboard", 
      icon: <LayoutDashboard size={20} />,
      onClick: handleDashboardClick // ✅ Custom click handler
    },
    { 
      path: "/admin/add-product", 
      name: "Add Product", 
      icon: <PlusCircle size={20} /> 
    },
    { 
      path: "/admin/products", 
      name: "Product List", 
      icon: <List size={20} /> 
    },
    { 
      path: "/admin/orders", 
      name: "Orders", 
      icon: <ShoppingBag size={20} />,
    },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-64 h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#581c87] text-white flex flex-col p-6 shadow-2xl rounded-xl"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-extrabold mb-10 tracking-wider text-yellow-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] text-center"
      >
        Admin Panel
      </motion.h2>

      <div className="flex flex-col gap-4">
        {links.map((link, index) => {
          const active = location.pathname === link.path;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Link
                to={link.path}
                onClick={link.onClick || (() => {})} // ✅ Use custom onClick if exists
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-pink-600 to-purple-700 text-white font-semibold shadow-lg shadow-pink-500/30"
                    : "bg-white/10 hover:bg-white/20 text-gray-100"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
                
                {/* Show red badge only for Orders link when there are new orders AND user is NOT on orders page */}
                {link.path === "/admin/orders" && showBadge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {newOrdersCount}
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-auto pt-8 text-center text-sm text-gray-400">
        © 2025 Mobile-Bazar Admin
      </div>
    </motion.div>
  );
};

export default Sidebar;