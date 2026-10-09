import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTrashAlt, FaEdit, FaMobileAlt, FaMicrochip, FaCamera, FaBatteryFull, FaDisplay, FaPalette } from "react-icons/fa";
import Swal from "sweetalert2";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.log("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Delete this product?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      background: '#1a0033',
      color: '#fff',
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b'
    });

    if (confirm.isConfirmed) {
      try {
        await fetch(`http://localhost:5000/api/products/${id}`, {
          method: "DELETE",
        });
        Swal.fire("Deleted!", "Product has been removed.", "success");
        navigate("/admin/products");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete product.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0022] via-[#1a0033] to-[#35004d] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-white text-lg mt-4">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0022] via-[#1a0033] to-[#35004d] flex items-center justify-center">
        <div className="text-white text-center">
          <FaMobileAlt className="text-6xl text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-300 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/admin/products")}
            className="bg-pink-500 hover:bg-pink-400 px-6 py-2 rounded-full font-semibold text-white transition-all"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const getSpecIcon = (key) => {
    switch(key) {
      case 'model': return <FaMobileAlt className="text-blue-400" />;
      case 'processor': return <FaMicrochip className="text-purple-400" />;
      case 'ram': return <FaMicrochip className="text-green-400" />;
      case 'rom': return <FaMicrochip className="text-yellow-400" />;
      case 'battery': return <FaBatteryFull className="text-red-400" />;
      case 'frontCamera': return <FaCamera className="text-pink-400" />;
      case 'backCamera': return <FaCamera className="text-indigo-400" />;
      case 'display': return <FaDisplay className="text-cyan-400" />;
      case 'color': return <FaPalette className="text-orange-400" />;
      default: return <FaMobileAlt className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0022] via-[#1a0033] to-[#35004d] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all border border-pink-400/30"
          >
            <FaArrowLeft className="text-lg" />
            <span>Back to Products</span>
          </motion.button>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/admin/add-product/${id}`)}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all border border-blue-400/30"
            >
              <FaEdit />
              Edit Product
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all border border-red-400/30"
            >
              <FaTrashAlt />
              Delete
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white/10 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md"
        >
          {/* Product Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-pink-400 mb-2">{product.brand}</h1>
            <div className="flex justify-center items-center gap-4 text-gray-300">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.type === 'New' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-yellow-500 text-black'
              }`}>
                {product.type} Mobile
              </span>
              {product.condition && product.type === 'Old' && (
                <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium">
                  Condition: {product.condition}
                </span>
              )}
              {product.specs?.price && (
                <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium">
                  Rs {product.specs.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="flex justify-center">
              <img
                src={product.mainImage}
                alt={product.brand}
                className="w-full max-w-md h-96 object-contain rounded-2xl border-2 border-pink-400/30 bg-[#1a0033] p-4"
              />
            </div>

            {/* Product Specifications */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Specifications</h2>
              
              <div className="grid gap-4">
                {Object.entries(product.specs || {}).map(([key, value]) => (
                  value && (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-4 bg-[#1a0033] rounded-xl border border-gray-500"
                    >
                      <div className="text-2xl">
                        {getSpecIcon(key)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold capitalize text-gray-200">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-white text-lg">{value}</p>
                      </div>
                    </motion.div>
                  )
                ))}
              </div>

              {(!product.specs || Object.keys(product.specs).length === 0) && (
                <div className="text-center py-8 text-gray-400">
                  <FaMobileAlt className="text-4xl mx-auto mb-4" />
                  <p>No specifications available for this product.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;