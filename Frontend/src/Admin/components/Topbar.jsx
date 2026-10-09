import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ImSpinner2 } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";

const Topbar = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) setAdminName(name);
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminName");
      setLoggingOut(false);
      navigate("/admin/auth");
    }, 1500);
  };

  return (
    <>
      {/* 🔹 Logging Out Animation */}
      <AnimatePresence>
        {loggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col justify-center items-center bg-black/80 backdrop-blur-md text-white z-50"
          >
            <ImSpinner2 className="animate-spin text-6xl mb-5 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.7)]" />
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-semibold tracking-wide text-yellow-300"
            >
              Logging out...
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Topbar (same design) */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full h-16 bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#581c87] flex justify-between items-center px-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-b border-white/10 backdrop-blur-sm"
      >
        {/* Left Section — Admin Name + Dot */}
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-white tracking-wide flex items-center">
            {adminName ? adminName : "Admin"}
            <span className="ml-2 w-3.5 h-3.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
            <span className="ml-2 text-yellow-400 font-light">
              — Manage Your Products
            </span>
          </h1>
        </div>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.08, boxShadow: "0px 0px 12px rgba(255,255,255,0.4)" }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg border border-white/10 transition-all duration-300"
        >
          Logout
        </motion.button>
      </motion.div>
    </>
  );
};

export default Topbar;
