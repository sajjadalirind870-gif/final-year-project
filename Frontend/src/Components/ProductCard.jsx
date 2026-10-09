import { Link, useNavigate } from "react-router-dom";
import { FaTag, FaStar, FaFire, FaLeaf, FaShoppingBasket, FaMemory, FaEye } from "react-icons/fa";
import { MdOutlineNewReleases } from "react-icons/md";

function ProductCard({ product, addToCart }) {
  const navigate = useNavigate();
  const isNew = product.type === "New";

  const image =
    product.mainImage ||
    product.image ||
    product.images?.[0] ||
    "https://via.placeholder.com/200";

  const brand =
    product.brand ||
    product.specs?.brand ||
    product.specifications?.brand ||
    "Unknown Brand";

  const model =
    product.specs?.model ||
    product.model ||
    product.name ||
    "Unknown Model";

  const price =
    product.price ||
    product.specs?.price ||
    product.specifications?.price ||
    0;

  const ram =
    product.ram ||
    product.specs?.ram ||
    product.specifications?.ram ||
    "N/A";

  const rom =
    product.rom ||
    product.specs?.rom ||
    product.specifications?.rom ||
    "N/A";

  const handleCardClick = (e) => {
    if (!e.target.closest(".add-to-cart-btn") && !e.target.closest(".details-btn")) {
      navigate(`/product/${product._id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-gradient-to-br from-[#050505] via-[#0a0033] to-[#31004d]
      text-white rounded-2xl shadow-2xl hover:shadow-[0_0_25px_rgba(255,0,255,0.4)]
      transition-all duration-400 transform hover:-translate-y-1 hover:scale-[1.01]
      border border-purple-400/30 p-4 backdrop-blur-lg cursor-pointer group"
    >
      {/* Brand Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
          <FaTag className="text-xs" />
          <span>{brand}</span>
        </div>
      </div>

      {/* New Badge */}
      {isNew && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
            <MdOutlineNewReleases className="text-xs" />
            <span>NEW</span>
          </div>
        </div>
      )}

      {/* Image Container - Compact */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-3 border border-white/20 mt-1">
        <img
          src={image}
          alt={model}
          className="w-full h-40 object-contain rounded-lg group-hover:scale-105 transition-transform duration-400"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200x200/4f46e5/ffffff?text=Mobile";
          }}
        />
      </div>

      {/* Content - Compact */}
      <div className="mt-3 space-y-2">
        {/* Title */}
        <h2 className="text-lg font-bold text-white tracking-tight truncate">{model}</h2>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded-full">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-yellow-400 text-xs font-semibold">4.9</span>
          </div>
          <span className="text-gray-300 text-xs">128 Reviews</span>
        </div>

        {/* RAM & ROM Display - Compact */}
        <div className="flex items-center justify-between bg-black/30 rounded-lg p-2 border border-white/10">
          <div className="text-center flex-1">
            <FaMemory className="text-pink-400 mx-auto text-sm mb-0.5" />
            <div className="text-gray-300 text-xs">RAM</div>
            <div className="text-white font-semibold text-xs">{ram}</div>
          </div>
          <div className="w-px bg-white/20 h-6"></div>
          <div className="text-center flex-1">
            <div className="text-gray-300 text-xs">STORAGE</div>
            <div className="text-white font-semibold text-xs">{rom}</div>
          </div>
        </div>

        {/* Price & Condition */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FaFire className="text-orange-400 text-sm" />
            <span className="text-emerald-400 font-bold text-lg">
              Rs {price.toLocaleString()}
            </span>
          </div>
          
          {/* Condition Badge */}
          <div
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              isNew
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                : "bg-gradient-to-r from-orange-500 to-red-500 text-white"
            }`}
          >
            {isNew ? (
              <>
                <MdOutlineNewReleases className="text-xs" /> NEW
              </>
            ) : (
              <>
                <FaLeaf className="text-xs" /> {product.condition || "USED"}
              </>
            )}
          </div>
        </div>

        {/* Buttons - Compact */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="add-to-cart-btn flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-[0_0_15px_rgba(255,0,255,0.4)] transition-all duration-300 hover:scale-105"
          >
            <FaShoppingBasket className="text-xs" />
            <span>Cart</span>
          </button>

          <Link
            to={`/product/${product._id}`}
            onClick={(e) => e.stopPropagation()}
            className="details-btn flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] transition-all duration-300 hover:scale-105 border border-purple-400/30"
          >
            <FaEye className="text-xs" />
            <span>View</span>
          </Link>
        </div>
      </div>

      {/* Premium Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
    </div>
  );
}

export default ProductCard;