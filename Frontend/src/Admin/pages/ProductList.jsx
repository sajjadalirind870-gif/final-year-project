import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrashAlt, FaEdit, FaArrowLeft, FaShoppingCart, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🧠 Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log("❌ Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🗑 Delete product
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      background: '#1a0033',
      color: '#fff'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          Swal.fire("Error!", "Failed to delete product.", "error");
          return;
        }

        Swal.fire("Deleted!", "Product has been removed.", "success");
        fetchProducts();
      } catch (err) {
        Swal.fire("Error!", "Server error occurred.", "error");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/add-product/${id}`);
  };

  // ✅ FIXED: Handle back to dashboard
  const handleBackToDashboard = () => {
    navigate("/admin/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0022] via-[#1a0033] to-[#35004d] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto absolute top-2 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-white text-lg mt-4">Loading products...</p>
          <p className="text-gray-400 text-sm">Please wait while we fetch your products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0022] via-[#1a0033] to-[#35004d] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToDashboard}
            className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all border border-pink-400/30"
          >
            <FaArrowLeft className="text-lg" />
            <span>Back to Dashboard</span>
          </motion.button>

          {/* Add Product Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/add-product")}
            className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all border border-green-400/30"
          >
            <FaPlus className="text-lg" />
            <span>Add Product</span>
          </motion.button>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-4xl font-bold text-pink-400 mb-2 flex items-center justify-center gap-3"
          >
            <motion.span
              initial={{ scale: 0.6, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              whileHover={{
                scale: 1.15,
                rotate: 10,
              }}
              className="text-pink-400"
            >
              <FaShoppingCart size={50} />
            </motion.span>
            Product Management
          </motion.h1>
          <p className="text-gray-300">Manage your product inventory</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white/10 border border-white/10 rounded-2xl p-6 mb-6 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1a0033] rounded-lg p-4 border border-gray-500 text-center">
              <p className="text-sm text-gray-300">Total Products</p>
              <p className="text-2xl font-bold text-pink-400">{products.length}</p>
            </div>
            <div className="bg-[#1a0033] rounded-lg p-4 border border-gray-500 text-center">
              <p className="text-sm text-gray-300">New Products</p>
              <p className="text-2xl font-bold text-green-400">
                {products.filter(p => p.type === 'New').length}
              </p>
            </div>
            <div className="bg-[#1a0033] rounded-lg p-4 border border-gray-500 text-center">
              <p className="text-sm text-gray-300">Used Products</p>
              <p className="text-2xl font-bold text-yellow-400">
                {products.filter(p => p.type === 'Old').length}
              </p>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <FaShoppingCart className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No products found</p>
            <p className="text-gray-500 text-sm mt-2">
              Get started by adding your first product to the inventory.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/add-product")}
              className="mt-4 flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all border border-pink-400/30 mx-auto"
            >
              <FaPlus />
              Add First Product
            </motion.button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all"
              >
                <div className="relative w-full h-60 bg-[#1a0033] flex justify-center items-center p-4">
                  <img
                    src={product.mainImage}
                    alt={product.brand}
                    className="h-full w-auto object-contain rounded-lg"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.type === 'New' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-black'
                    }`}>
                      {product.type}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h2 className="text-xl font-bold text-pink-400 truncate">
                    {product.brand}
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Model: <span className="text-white font-semibold">{product.specs?.model || "N/A"}</span>
                  </p>
                  <p className="text-gray-300 text-sm">
                    RAM: <span className="text-white font-semibold">{product.specs?.ram || "N/A"}</span>
                  </p>
                  <p className="text-gray-300 text-sm">
                    Storage: <span className="text-white font-semibold">{product.specs?.rom || "N/A"}</span>
                  </p>
                  <p className="text-green-400 font-bold text-lg">
                    Rs {product.specs?.price?.toLocaleString() || "N/A"}
                  </p>

                  <div className="flex justify-between mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(product._id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all text-sm border border-blue-400/30"
                    >
                      <FaEdit /> Edit
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all text-sm border border-red-400/30"
                    >
                      <FaTrashAlt /> Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;