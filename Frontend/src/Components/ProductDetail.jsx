import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMobileAlt,
  FaMicrochip,
  FaBatteryFull,
  FaCamera,
  FaPalette,
  FaTag,
  FaLeaf,
  FaShoppingBag,
  FaArrowLeft
} from "react-icons/fa";
import { MdOutlineNewReleases } from "react-icons/md";
import { motion } from "framer-motion";

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  // 🔹 Fetch product detail
  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log("❌ Fetch Error:", err));
  }, [id]);

  if (!product)
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-xl font-semibold">
        Loading Product Details...
      </div>
    );

  const specs = product.specs || {};

  const formatBattery = (val) => (val ? `${val} mAh` : null);
  const formatRAM = (val) => (val ? `${val} GB RAM` : null);
  const formatROM = (val) => (val ? `${val} GB Storage` : null);
  const formatCamera = (val) => (val ? `${val} MP` : null);

  // 🛒 Buy Now Function
  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0033] to-[#31004d] text-white py-8 px-4">
      {/* Styled Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 mb-6 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white px-6 py-3 rounded-2xl border border-purple-400/30 hover:border-pink-400/50 hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] transition-all duration-300 backdrop-blur-sm"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-semibold">Back to Products</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* 🖼️ Image Section - Slightly Larger */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-96 flex justify-center items-center bg-black/30"
        >
          <motion.img
            src={product.mainImage || "https://via.placeholder.com/500"}
            alt={product.name}
            className="max-h-80 w-auto object-contain transition-transform duration-500 hover:scale-110"
          />

          {/* 🔵 Type Badge */}
          <div
            className={`absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold shadow-lg ${
              product.type === "New"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                : "bg-gradient-to-r from-orange-500 to-red-500 text-white"
            }`}
          >
            {product.type === "New" ? (
              <>
                <MdOutlineNewReleases className="text-lg" /> New Arrival
              </>
            ) : (
              <>
                <FaLeaf className="text-lg" /> {product.condition}
              </>
            )}
          </div>
        </motion.div>

        {/* ℹ️ Info Section - Slightly Larger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-4 mb-3">
                <FaMobileAlt className="text-pink-400 text-3xl" /> 
                {product.name}
              </h1>
              <p className="text-gray-300 flex items-center gap-3 text-base">
                <FaTag className="text-pink-400" /> 
                Brand: <span className="font-semibold text-white text-lg">{product.brand}</span>
              </p>
            </div>

            {/* 💰 Price */}
            <motion.p
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-emerald-400 text-3xl md:text-4xl font-bold mt-4 md:mt-0 flex items-center gap-2"
            >
              <span className="text-2xl">Rs</span> {specs.price || product.price}
            </motion.p>
          </div>

          {/* ⚙️ Specs Grid - Better Spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {specs.model && <DetailItem icon={<FaMobileAlt />} label="Model" value={specs.model} />}
            {specs.processor && <DetailItem icon={<FaMicrochip />} label="Processor" value={specs.processor} />}
            {specs.battery && <DetailItem icon={<FaBatteryFull />} label="Battery" value={formatBattery(specs.battery)} />}
            {specs.ram && <DetailItem icon={<FaMicrochip />} label="RAM" value={formatRAM(specs.ram)} />}
            {specs.rom && <DetailItem icon={<FaMicrochip />} label="Storage" value={formatROM(specs.rom)} />}
            {specs.frontCamera && <DetailItem icon={<FaCamera />} label="Front Camera" value={formatCamera(specs.frontCamera)} />}
            {specs.backCamera && <DetailItem icon={<FaCamera />} label="Back Camera" value={formatCamera(specs.backCamera)} />}
            {specs.color && <DetailItem icon={<FaPalette />} label="Color" value={specs.color} />}
          </div>

          {/* 🛒 Buy Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 40px rgba(255,0,255,0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBuyNow}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold py-4 px-16 rounded-full flex items-center gap-4 shadow-2xl transition-all duration-300 text-xl w-full max-w-sm justify-center hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
            >
              <FaShoppingBag className="text-2xl" /> Buy Now
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-4 bg-white/10 border border-white/20 p-5 rounded-xl hover:bg-white/15 hover:border-pink-400/30 transition duration-300 backdrop-blur-sm"
    >
      <span className="text-pink-400 text-xl">{icon}</span>
      <div className="flex-1">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <p className="text-base font-semibold text-white">{value}</p>
      </div>
    </motion.div>
  );
}

export default ProductDetail;