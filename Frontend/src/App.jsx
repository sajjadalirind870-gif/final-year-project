import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 🧩 User Components
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import About from "./Components/About";
import Contact from "./Components/Contact";
import ProductList from "./Components/ProductList";
import ProductDetail from "./Components/ProductDetail";
import Cart from "./Components/Cart";
import UserAuth from "./User/UserAuth";
import Loader from "./Components/Loader";
import Footer from "./Components/Footer";

// 🧠 Admin Components
import AdminAuth from "./Admin/AdminAuth";
import Dashboard from "./Admin/Pages/Dashboard";
import AddProduct from "./Admin/Pages/AddProduct";
import ProductListAdmin from "./Admin/Pages/ProductList";
import Orders from "./Admin/Pages/Orders";


// ✅ Admin Protected Route Wrapper
const AdminRoute = ({ children }) => {
  const isAdminAuthenticated = !!localStorage.getItem("adminToken");
  return isAdminAuthenticated ? children : <Navigate to="/admin/auth" replace />;
};

function App() {
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // 🧠 Load cart from localStorage once
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart:", e);
      }
    }
  }, []);

  // 💾 Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Add to cart function (no duplicates)
  const addToCart = (product) => {
    if (!isAuthenticated) {
      alert("Please login first!");
      return;
    }

    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        // If already in cart → just increase quantity
        return prev.map((p) =>
          p._id === product._id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        );
      }
      // Otherwise add as new product with quantity = 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      {loading && <Loader text="Loading..." />}

      {/* 🔹 Navbar */}
      <Navbar
        cart={cart}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      {/* 🔹 Main Content Area */}
      <div className="flex-grow">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* User Auth */}
          <Route
            path="/auth"
            element={<UserAuth setIsAuthenticated={setIsAuthenticated} setLoading={setLoading} />}
          />

          {/* User Protected Routes */}
          <Route
            path="/products"
            element={
              isAuthenticated ? (
                <ProductList cart={cart} setCart={setCart} addToCart={addToCart} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/product/:id"
            element={
              isAuthenticated ? (
                <ProductDetail cart={cart} setCart={setCart} addToCart={addToCart} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/cart"
            element={
              isAuthenticated ? (
                <Cart cart={cart} setCart={setCart} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          {/* Admin Auth */}
          <Route path="/admin/auth" element={<AdminAuth />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add-product"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add-product/:id"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <ProductListAdmin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <Orders />
              </AdminRoute>
            }
          />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>


      </div>

      {/* 🔹 Footer */}
      <Footer />
    </div>
  );
}

export default App;
