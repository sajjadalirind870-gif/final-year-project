import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Save } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft } from "react-icons/fa";

const AddProduct = () => {
  const [type, setType] = useState("New");
  const [condition, setCondition] = useState("");
  const [brand, setBrand] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [specs, setSpecs] = useState({
    model: "",
    ram: "",
    rom: "",
    battery: "",
    frontCamera: "",
    backCamera: "",
    processor: "",
    display: "",
    color: "",
    price: "",
  });

  const conditionOptions = ["7/10", "8/10", "9/10", "10/10"];
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ FIXED: Track current admin route but don't overwrite last route
  useEffect(() => {
    const adminRoutes = ['/admin/dashboard', '/admin/add-product', '/admin/products', '/admin/orders'];
    
    // Only set if it's not already set or if it's a different route
    const currentRoute = window.location.pathname;
    const lastRoute = localStorage.getItem('lastAdminRoute');
    
    if (adminRoutes.includes(currentRoute)) {
      // Don't overwrite if we're coming back to the same page
      if (!lastRoute || lastRoute !== currentRoute) {
        localStorage.setItem('lastAdminRoute', currentRoute);
        console.log("📍 AddProduct: Route tracked:", currentRoute);
      }
    }
  }, []);

  // ✅ FIXED: Handle back to dashboard - Always go to dashboard
  const handleBackToDashboard = () => {
    // Always navigate to dashboard, not last route
    console.log("🔙 AddProduct: Going back to Dashboard");
    navigate("/admin/dashboard");
  };

  // 🧠 Fetch product for edit
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/products/${id}`);
          const data = await res.json();
          if (res.ok) {
            setType(data.type);
            setCondition(data.condition);
            setBrand(data.brand);
            setSpecs(data.specs || {});
            setMainImage(data.mainImage);
            setMainPreview(data.mainImage);
          } else toast.error("❌ Product not found");
        } catch {
          toast.error("⚠️ Failed to load product");
        }
      })();
    }
  }, [id]);

  // 🖼 Image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMainPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        const fullURL = `http://localhost:5000/uploads/${data.filename}`;
        setMainImage(fullURL);
        setMainPreview(fullURL);
        toast.success("📸 Image uploaded successfully!");
      } else toast.error("❌ Upload failed");
    } catch {
      toast.error("⚠️ Server error during upload.");
    } finally {
      setUploading(false);
    }
  };

  // ✏️ Handle input
  const handleSpecsChange = (e) => {
    const { name, value } = e.target;
    setSpecs({ ...specs, [name]: value });
  };

  // ✅ Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brand || !mainImage) {
      toast.error("⚠️ Brand and Image required!");
      return;
    }

    const productData = {
      type,
      condition: type === "Old" ? condition : "New",
      brand,
      specs: { ...specs, price: Number(specs.price) },
      mainImage,
    };

    try {
      const url = id
        ? `http://localhost:5000/api/products/${id}`
        : "http://localhost:5000/api/products/add";

      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(id ? "✅ Product Updated!" : "✅ Product Added!");
        setTimeout(() => navigate("/admin/products"), 1500);
      } else toast.error(`❌ ${data.message}`);
    } catch {
      toast.error("⚠️ Server error!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0022] via-[#1a0033] to-[#35004d] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <ToastContainer />
        
        {/* ✅ Back to Dashboard Button - Order.jsx Design */}
        <div className="flex justify-start mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToDashboard}
            className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all border border-pink-400/30"
          >
            <FaArrowLeft className="text-lg" />
            <span>Back to Dashboard</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md"
        >
          {/* Header - Order.jsx Style */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-pink-400 mb-2">
              {id ? "Edit Product ✏️" : "Add Product 📱"}
            </h1>
            <p className="text-gray-300">
              {id ? "Update existing product details" : "Add a new product to your inventory"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection - Updated Colors */}
            <div className="flex gap-6 justify-center">
              {["New", "Old"].map((t) => (
                <motion.button
                  key={t}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setType(t)}
                  className={`px-8 py-3 rounded-full text-lg font-semibold transition-all ${
                    type === t
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-105 shadow-lg border border-pink-400/30"
                      : "bg-white/10 hover:bg-white/20 text-gray-100 border border-white/10"
                  }`}
                >
                  {t} Mobile
                </motion.button>
              ))}
            </div>

            {/* Brand Input - Updated Colors */}
            <div>
              <label className="block text-lg mb-2 font-semibold text-gray-200">Brand:</label>
              <input
                type="text"
                placeholder="Enter Brand Name..."
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-4 rounded-lg bg-[#1a0033] border border-gray-500 text-white outline-none placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Condition - Updated Colors */}
            {type === "Old" && (
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full p-4 rounded-lg bg-[#1a0033] border border-gray-500 text-white outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="" className="text-gray-400">Select Condition</option>
                {conditionOptions.map((c) => (
                  <option key={c} value={c} className="text-black">
                    {c}
                  </option>
                ))}
              </select>
            )}

            {/* Specs Inputs - Updated Colors */}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "model",
                "ram",
                "rom", 
                "battery",
                "color",
                "frontCamera",
                "backCamera",
                "processor",
                "display",
                "price",
              ].map((inputName) => (
                <input
                  key={inputName}
                  type={inputName === "price" ? "number" : "text"}
                  name={inputName}
                  placeholder={
                    inputName.charAt(0).toUpperCase() + inputName.slice(1)
                  }
                  value={specs[inputName] || ""}
                  onChange={handleSpecsChange}
                  className="p-3 bg-[#1a0033] border border-gray-500 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              ))}
            </div>

            {/* Image Upload - Updated Colors */}
            <div className="border border-gray-500 p-5 rounded-xl bg-[#1a0033]/50">
              <label className="text-lg font-semibold mb-3 block text-gray-200">
                Upload Main Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all border border-pink-400/30"
              >
                {uploading ? "Uploading..." : <><Upload size={20} /> Choose Image</>}
              </label>
              {mainPreview && (
                <img
                  src={mainPreview}
                  alt="Preview"
                  className="mx-auto mt-4 w-40 h-40 object-cover rounded-lg border-2 border-pink-400/50"
                />
              )}
            </div>

            {/* Submit Button - Updated Colors */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-xl 
                bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 
                text-white shadow-lg hover:shadow-pink-500/30 transition-all border border-pink-400/30"
            >
              {id ? <Save className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
              {id ? "Save Changes" : "Add Product"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;