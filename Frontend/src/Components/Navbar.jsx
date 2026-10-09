// src/Components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

const Navbar = ({ cart, isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastSeenOrderCount, setLastSeenOrderCount] = useState(0);

  // ✅ NEW: Track admin routes when navigating from admin panel
  useEffect(() => {
    const adminRoutes = ['/admin/dashboard', '/admin/add-product', '/admin/products', '/admin/orders'];
    
    if (adminRoutes.includes(location.pathname)) {
      // Store the current admin route
      localStorage.setItem('lastAdminRoute', location.pathname);
      console.log("📍 Admin route tracked:", location.pathname);
    }
  }, [location.pathname]);

  // Fetch orders count for admin
  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        // Check if user is admin
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        if (token) {
          setIsAdmin(true);
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
          
          const currentOrderCount = ordersArray.length;
          setOrdersCount(currentOrderCount);

          // Get last seen count from localStorage
          const storedLastSeen = localStorage.getItem('lastSeenOrderCount');
          if (!storedLastSeen) {
            // First time, set current count as last seen
            localStorage.setItem('lastSeenOrderCount', currentOrderCount.toString());
            setLastSeenOrderCount(currentOrderCount);
          } else {
            setLastSeenOrderCount(parseInt(storedLastSeen));
          }
        }
      } catch (error) {
        console.error("Error fetching orders count:", error);
      }
    };

    fetchOrdersCount();

    // Refresh orders count every 30 seconds
    const interval = setInterval(fetchOrdersCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Check if user is on orders page
  const isOnOrdersPage = window.location.pathname === '/admin/orders';

  // Calculate new orders count (only show if there are new orders AND user is not on orders page)
  const newOrdersCount = isOnOrdersPage ? 0 : Math.max(0, ordersCount - lastSeenOrderCount);

  // Update last seen count when user visits orders page
  useEffect(() => {
    if (isOnOrdersPage && ordersCount > 0) {
      localStorage.setItem('lastSeenOrderCount', ordersCount.toString());
      setLastSeenOrderCount(ordersCount);
    }
  }, [isOnOrdersPage, ordersCount]);

  // ✅ FIXED: Handle Dashboard click - Check authentication first
// ✅ FIXED: Smart Dashboard Toggle
const handleDashboardClick = (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  
  if (!token) {
    navigate("/admin/auth");
    return;
  }
  
  const currentPath = window.location.pathname;
  const lastRoute = localStorage.getItem('lastAdminRoute') || '/admin/dashboard';
  
  console.log("📍 Current:", currentPath, "Last:", lastRoute);
  
  // Check if we're currently on an admin page
  const isOnAdminPage = currentPath.startsWith('/admin/') && 
                       currentPath !== '/admin/auth';
  
  if (isOnAdminPage) {
    // Agar already admin page pe hai, toh Dashboard pe jao
    console.log("🚀 On admin page, going to Dashboard");
    navigate("/admin/dashboard");
    localStorage.setItem('lastAdminRoute', "/admin/dashboard");
  } else {
    // Agar admin page se bahar hai (like Contact/About), toh last route pe jao
    console.log("🚀 Outside admin, going to last route:", lastRoute);
    navigate(lastRoute);
  }
};

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem('lastSeenOrderCount');
      localStorage.removeItem('lastAdminRoute'); // ✅ Clear route tracking on logout
      setIsAuthenticated(false);
      setIsAdmin(false);
      setLoggingOut(false);
      navigate("/auth");
    }, 1500);
  };

  if (loggingOut) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-80 text-white z-50">
        <div className="w-12 h-12 border-4 border-t-transparent border-pink-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-semibold tracking-wide">Logging out...</h2>
      </div>
    );
  }

  return (
    <nav className="flex items-center h-24 w-full justify-between px-6 sm:px-12 lg:px-20 bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 shadow-lg sticky top-0 z-50">
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-3xl sm:text-4xl font-extrabold text-white cursor-pointer select-none tracking-wide"
      >
        Mobile-<span className="text-yellow-400">Bazar</span>
      </h1>

      {/* Links */}
      <div className="hidden md:flex gap-12 text-lg font-semibold text-gray-100 tracking-wide">
        <Link to="/" className="hover:text-yellow-400 transition duration-300">Home</Link>
        <Link to="/products" className="hover:text-yellow-400 transition duration-300">Products</Link>
        <Link to="/about" className="hover:text-yellow-400 transition duration-300">About</Link>
        <Link to="/contact" className="hover:text-yellow-400 transition duration-300">Contact</Link>
        
        {/* ✅ FIXED: Dashboard Link - Remove to prop, only use onClick */}
        <a 
          href="#"
          onClick={handleDashboardClick}
          className="hover:text-yellow-400 transition duration-300 relative cursor-pointer"
        >
          Dashboard
          {isAdmin && newOrdersCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {newOrdersCount}
            </span>
          )}
        </a>
      </div>

      {/* Cart + Auth Buttons */}
      <div className="flex gap-6 items-center">
        {/* Cart for Customers */}
        <Link to="/cart" className="relative">
          <ShoppingCart
            size={30}
            className="cursor-pointer text-yellow-400 hover:scale-110 transition-transform duration-300"
          />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {cart.length}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-red-400 transition text-sm sm:text-base"
          >
            Logout
          </button>
        ) : (
          <Link to="/auth">
            <button className="bg-yellow-400 text-black text-sm sm:text-base font-semibold px-7 py-2 rounded-xl shadow-lg hover:bg-yellow-300 transition">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;