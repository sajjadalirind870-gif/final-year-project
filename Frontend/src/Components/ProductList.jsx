import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaSortAmountDown, 
  FaSortAmountUp,
  FaMobile
} from "react-icons/fa";

function ProductList({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter and Sort States
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        
        // Transform the data to ensure consistent condition display
        const transformedProducts = Array.isArray(data) ? data.map(product => ({
          ...product,
          // Ensure condition is properly displayed
          condition: product.type === "New" ? "New" : "Used"
        })) : [];
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (err) {
        console.error("Product fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Get unique brands for filter
  const uniqueBrands = [...new Set(products.map(product => product.brand))].filter(brand => brand);

  // Get unique conditions for filter
  const uniqueConditions = [...new Set(products.map(product => product.condition))].filter(condition => condition);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.specs?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.condition?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply brand filter
    if (selectedBrand !== "all") {
      result = result.filter(product => product.brand === selectedBrand);
    }

    // Apply condition filter
    if (selectedCondition !== "all") {
      result = result.filter(product => product.condition === selectedCondition);
    }

    // Apply sorting
    result.sort((a, b) => {
      const priceA = a.specs?.price || a.price || 0;
      const priceB = b.specs?.price || b.price || 0;
      
      switch(sortBy) {
        case "price-low-high":
          return priceA - priceB;
        case "price-high-low":
          return priceB - priceA;
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "name-a-z":
          return (a.brand || "").localeCompare(b.brand || "");
        case "name-z-a":
          return (b.brand || "").localeCompare(a.brand || "");
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
  }, [products, selectedBrand, selectedCondition, sortBy, searchTerm]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            id: product._id,
            name: product.name || product.specs?.model || "Unnamed",
            brand: product.brand || product.specs?.brand || "Unknown",
            price: product.price || product.specs?.price || 0,
            image:
              product.mainImage ||
              product.image ||
              product.images?.[0] ||
              "https://via.placeholder.com/200",
            quantity: 1,
            condition: product.type === "New" ? "New" : "Used"
          },
        ];
      }
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedBrand("all");
    setSelectedCondition("all");
    setSearchTerm("");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-white text-lg mt-4">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Beautiful Filter and Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <FaSearch className="absolute left-3 top-3 text-purple-300" />
              <input
                type="text"
                placeholder="Search by brand, model, condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-purple-900/30 border border-purple-400/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-purple-300 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {/* Brand Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-purple-900/30 border border-purple-400/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all appearance-none pr-10 cursor-pointer min-w-32"
                >
                  <option value="all" className="text-white bg-purple-900">All Brands</option>
                  {uniqueBrands.map(brand => (
                    <option key={brand} value={brand} className="text-white bg-purple-900">
                      {brand}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                  <FaFilter className="text-purple-300" />
                </div>
              </div>

              {/* Condition Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="bg-purple-900/30 border border-purple-400/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all appearance-none pr-10 cursor-pointer min-w-32"
                >
                  <option value="all" className="text-white bg-purple-900">All Conditions</option>
                  {uniqueConditions.map(condition => (
                    <option key={condition} value={condition} className="text-white bg-purple-900">
                      {condition}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                  <FaMobile className="text-purple-300" />
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-purple-900/30 border border-purple-400/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all appearance-none pr-10 cursor-pointer min-w-40"
                >
                  <option value="newest" className="text-white bg-purple-900">Newest First</option>
                  <option value="oldest" className="text-white bg-purple-900">Oldest First</option>
                  <option value="price-low-high" className="text-white bg-purple-900">Price: Low to High</option>
                  <option value="price-high-low" className="text-white bg-purple-900">Price: High to Low</option>
                  <option value="name-a-z" className="text-white bg-purple-900">Name: A to Z</option>
                  <option value="name-z-a" className="text-white bg-purple-900">Name: Z to A</option>
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                  {sortBy === "price-low-high" ? 
                    <FaSortAmountUp className="text-purple-300" /> : 
                    <FaSortAmountDown className="text-purple-300" />
                  }
                </div>
              </div>

              {/* Clear Filters Button */}
              {(selectedBrand !== "all" || selectedCondition !== "all" || searchTerm || sortBy !== "newest") && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300 flex items-center gap-2"
                >
                  <FaTimes className="text-xs" />
                  Clear All
                </motion.button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedBrand !== "all" || selectedCondition !== "all") && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 flex flex-wrap gap-2"
            >
              <p className="text-purple-200 text-sm mr-2">Active Filters:</p>
              
              {selectedBrand !== "all" && (
                <span className="bg-purple-600/50 text-purple-100 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  Brand: {selectedBrand}
                  <button 
                    onClick={() => setSelectedBrand("all")}
                    className="hover:text-white transition-colors"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              
              {selectedCondition !== "all" && (
                <span className="bg-pink-600/50 text-pink-100 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  Condition: {selectedCondition}
                  <button 
                    onClick={() => setSelectedCondition("all")}
                    className="hover:text-white transition-colors"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-center mb-6"
        >
          <p className="text-purple-200">
            Showing <span className="text-yellow-300 font-bold">{filteredProducts.length}</span> of{" "}
            <span className="text-green-300 font-bold">{products.length}</span> products
            {selectedCondition !== "all" && (
              <span className="text-pink-300 ml-2">
                • {selectedCondition} Mobiles
              </span>
            )}
          </p>
          <div className="flex items-center gap-2 text-purple-200">
            {sortBy === "price-low-high" ? <FaSortAmountUp /> : <FaSortAmountDown />}
            <span className="text-sm capitalize">
              {sortBy.replace(/-/g, " ")}
            </span>
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl text-purple-300 mb-4">📱</div>
            <p className="text-purple-200 text-lg mb-2">No products found</p>
            <p className="text-purple-300 text-sm">
              {searchTerm || selectedBrand !== "all" || selectedCondition !== "all" 
                ? "Try adjusting your search or filters" 
                : "Check back later for new arrivals!"
              }
            </p>
            {(searchTerm || selectedBrand !== "all" || selectedCondition !== "all") && (
              <button
                onClick={clearAllFilters}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] transition-all duration-300"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product._id} 
                  product={{
                    ...product,
                    condition: product.type === "New" ? "New" : "Used"
                  }} 
                  addToCart={addToCart}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ProductList;