import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaShoppingBag, FaArrowRight, FaStar, FaMobileAlt, FaCrown, FaGem } from "react-icons/fa";

const Hero = () => {
  const [latestMobiles, setLatestMobiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false,
  };

  // Fetch latest mobiles from API
  useEffect(() => {
    const fetchLatestMobiles = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        
        let products = [];
        if (Array.isArray(data)) {
          products = data;
        } else if (data.products && Array.isArray(data.products)) {
          products = data.products;
        } else if (data.success && Array.isArray(data.products)) {
          products = data.products;
        }

        // Filter mobiles with price above 200000 and take only 6 latest
        const filteredMobiles = products
          .filter(mobile => mobile.specs?.price > 200000)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setLatestMobiles(filteredMobiles);
      } catch (error) {
        console.error("Error fetching latest mobiles:", error);
        // Fallback to static data if API fails
        setLatestMobiles(getFallbackMobiles());
      } finally {
        setLoading(false);
      }
    };

    fetchLatestMobiles();
  }, []);

  // Fallback data if API fails
  const getFallbackMobiles = () => [
    {
      _id: "1",
      brand: "OnePlus",
      specs: { model: "12", ram: "16GB", rom: "512GB", price: 69999 },
      mainImage: "/image/oneplus-12-1.jpg",
      type: "New",
      createdAt: new Date().toISOString()
    },
    {
      _id: "2", 
      brand: "Samsung",
      specs: { model: "S24 Ultra", ram: "12GB", rom: "256GB", price: 129999 },
      mainImage: "/image/samsungs24.jpg",
      type: "New",
      createdAt: new Date().toISOString()
    }
  ];

  const handleShopNow = () => {
    window.location.href = "/products";
  };

  const handleMobileClick = (mobileId) => {
    window.location.href = `/product/${mobileId}`;
  };

  if (loading) {
    return (
      <section className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white px-6 md:px-20 h-[90vh] pt-4 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading latest mobiles...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white px-6 md:px-20 h-[90vh] pt-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-3xl"></div>
      </div>

      {/* Left Side Text */}
      <div className="md:w-1/2 space-y-4 z-10 mt-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
            <FaCrown className="text-yellow-300" />
            PREMIUM
          </div>
          <span className="text-yellow-300 text-sm font-semibold">Premium Collection</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Discover <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">Premium Mobiles</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
          Experience the pinnacle of mobile innovation with flagship devices featuring revolutionary cameras, blazing-fast performance, and luxurious designs.
        </p>
        
        {/* Stats */}
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{latestMobiles.length}+</div>
            <div className="text-gray-300">Premium Models</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {latestMobiles.filter(mobile => mobile.type === 'New').length}
            </div>
            <div className="text-gray-300">Brand New</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">Flagship</div>
            <div className="text-gray-300">Devices</div>
          </div>
        </div>

        {/* Features List */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-300">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
            <FaStar className="text-yellow-400" />
            <span>Premium Quality</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
            <FaMobileAlt className="text-green-400" />
            <span>Exclusive Models</span>
          </div>
        </div>

        {/* Shop Now Button */}
        <button 
          onClick={handleShopNow}
          className="group bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-black px-8 py-3 rounded-full font-bold shadow-2xl hover:shadow-orange-400/30 transition-all duration-500 transform hover:scale-105 flex items-center gap-3"
        >
          <FaShoppingBag className="text-lg group-hover:scale-110 transition-transform" />
          <span>Shop Premium Mobiles</span>
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>

      
      </div>

      {/* Right Side Slider */}
      <div className="md:w-1/2 w-full mt-6 md:mt-0 z-10">
        <div className="relative">
          {latestMobiles.length > 0 ? (
            <Slider {...settings}>
              {latestMobiles.map((mobile) => (
                <div 
                  key={mobile._id} 
                  className="relative flex justify-center items-center px-4 cursor-pointer"
                  onClick={() => handleMobileClick(mobile._id)}
                >
                  <div className="relative group w-full max-w-md">
                    {/* Premium Badge - Fixed Position */}
                    <div className="absolute top-2 right-2 z-20">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                        <FaGem className="text-xs" />
                        <span>PREMIUM</span>
                      </div>
                    </div>

                    {/* Mobile Image with Beautiful Frame */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl mt-2">
                      <img
                        src={mobile.mainImage || "/image/placeholder-mobile.jpg"}
                        alt={`${mobile.brand} ${mobile.specs?.model}`}
                        className="h-[300px] md:h-[350px] object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500 mx-auto"
                        onError={(e) => {
                          e.target.src = "/image/placeholder-mobile.jpg";
                        }}
                      />
                    </div>
                    
                    {/* Mobile Info Card */}
                    <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md text-white p-4 rounded-2xl border border-white/20 shadow-2xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-bold">
                            {mobile.brand} {mobile.specs?.model}
                          </h2>
                          <p className="text-gray-300 text-sm">
                            {mobile.specs?.ram} | {mobile.specs?.rom}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Added: {new Date(mobile.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 font-bold text-lg">
                            Rs {mobile.specs?.price?.toLocaleString() || "N/A"}
                          </p>
                          <div className="flex items-center gap-1 text-yellow-400 text-xs">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            mobile.type === 'New' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-yellow-500 text-black'
                          }`}>
                            {mobile.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-8">
              <FaMobileAlt className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg">No premium mobiles available</p>
              <p className="text-gray-400 text-sm">Check back later for new arrivals</p>
            </div>
          )}

          {/* Custom Dots */}
          <style>{`
            .slick-dots {
              bottom: -40px !important;
            }
            .slick-dots li button:before {
              color: #fbbf24 !important;
              opacity: 0.5;
              font-size: 12px;
            }
            .slick-dots li.slick-active button:before {
              opacity: 1;
              color: #f59e0b !important;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default Hero;