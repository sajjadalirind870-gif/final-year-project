import React, { useState } from "react";
import emailjs from "emailjs-com";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle, FaPaperPlane, FaPhone, FaClock, FaIdCard, FaShieldAlt, FaHeadset, FaShippingFast } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 4000);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_ulqf2hd",
        "template_xja5dxu", 
        formData,
        "rwxKL5p2FOg0lyF9G"
      )
      .then(
        (result) => {
          console.log(result.text);
          showPopup("success", "🎉 Message sent successfully! We'll get back to you within 24 hours.");
          setFormData({ user_name: "", user_email: "", message: "" });
          setLoading(false);
        },
        (error) => {
          console.log(error.text);
          showPopup("error", "❌ Failed to send message. Please try again or contact us directly.");
          setLoading(false);
        }
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Popup */}
        <AnimatePresence>
          {popup.show && (
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -100, scale: 0.8 }}
              className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-8 py-6 rounded-2xl shadow-2xl font-bold transition-all duration-500 border-2 backdrop-blur-md ${
                popup.type === "success" 
                  ? "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 border-emerald-300/40 shadow-emerald-500/30" 
                  : "bg-gradient-to-r from-red-500 via-pink-600 to-red-600 border-red-300/40 shadow-red-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                {popup.type === "success" ? (
                  <FaCheckCircle className="text-2xl text-white animate-bounce" />
                ) : (
                  <FaExclamationTriangle className="text-2xl text-white animate-pulse" />
                )}
                <span className="text-white text-lg">{popup.message}</span>
              </div>
              
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                className={`h-1 mt-3 rounded-full ${
                  popup.type === "success" ? "bg-white/80" : "bg-white/80"
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative inline-block"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Contact Us
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-200 mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Have questions or need support? We're here to help you 24/7.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-6 text-center">
              Send Us a Message
            </h2>
            
            <form onSubmit={sendEmail} className="space-y-6 relative z-10">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-100">
                  Your Full Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none placeholder-gray-400 
                           focus:bg-white/10 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-100">
                  Email Address
                </label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none placeholder-gray-400 
                           focus:bg-white/10 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-100">
                  Your Message
                </label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none placeholder-gray-400 
                           focus:bg-white/10 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 resize-none"
                  placeholder="Describe your issue, complaint, or inquiry..."
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(255, 255, 0, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg
                  bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 
                  hover:from-yellow-300 hover:via-amber-300 hover:to-orange-300
                  text-gray-900 shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 
                  border border-yellow-300/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <span>Sending Your Message...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-lg group-hover:animate-pulse" />
                    <span>Send Message Now</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Right Side - Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Quality Features */}
            <div className="bg-gradient-to-br from-yellow-400/20 to-amber-400/10 border-2 border-yellow-400/30 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
              
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-4 flex items-center gap-3">
                <FaShieldAlt className="text-yellow-400" />
                Our Services
              </h2>
              
              <div className="grid gap-4">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaShieldAlt className="text-white text-lg" />
                  </div>
                  <div>
                    <h4 className="text-yellow-300 font-bold">Quality Certified</h4>
                    <p className="text-gray-200 text-sm mt-1">Every device undergoes strict quality checks</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaShippingFast className="text-white text-lg" />
                  </div>
                  <div>
                    <h4 className="text-green-300 font-bold">Fast Delivery</h4>
                    <p className="text-gray-200 text-sm mt-1">Quick shipping across Pakistan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Information */}
            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/5 border-2 border-red-400/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-red-300 mb-3 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-300" />
                Report Issues
              </h3>
              <ul className="text-gray-200 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Include Order ID and transaction details</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Attach screenshots for faster resolution</span>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border-2 border-purple-400/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
                <FaClock className="text-purple-300" />
                Support Details
              </h3>
              <ul className="text-gray-200 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Response within <strong>24 hours</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="flex items-center gap-2">
                    <FaPhone className="text-green-400 text-sm" />
                    <strong>Hotline: +92 3063886256</strong>
                  </span>
                </li>
              </ul>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-2 border-blue-400/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-blue-300 mb-2 flex items-center gap-2">
                <FaIdCard className="text-blue-300" />
                Quick Tips
              </h3>
              <p className="text-gray-200 text-sm">
                Include your contact info and order details for immediate assistance.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;