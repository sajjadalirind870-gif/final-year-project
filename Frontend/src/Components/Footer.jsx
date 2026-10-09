import React from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-[#0b0b2b] via-[#1a1446] to-[#3a1f74] text-gray-300 py-14 px-8 md:px-20 mt-0"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* 🔹 Brand Info */}
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Mobile<span className="text-indigo-400">Bazar</span>
          </h2>
          <p className="text-gray-400 leading-relaxed text-sm">
            Elevate your digital experience with the latest smartphones and
            trusted brands — all curated to redefine performance and style.
          </p>
        </div>

        {/* 🔹 Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
          <ul className="space-y-2">
            {["Home", "Products", "About Us", "Contact"].map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 6 }}
                className="cursor-pointer hover:text-indigo-400 transition-all"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* 🔹 Customer Services */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2">
            <li className="hover:text-indigo-400 cursor-pointer transition-all">
              Help Center
            </li>
            <li className="hover:text-indigo-400 cursor-pointer transition-all">
              Shipping & Returns
            </li>
            <li className="hover:text-indigo-400 cursor-pointer transition-all">
              Warranty Policy
            </li>
            <li className="hover:text-indigo-400 cursor-pointer transition-all">
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* 🔹 Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
          <p className="flex items-center gap-2 text-sm mb-2">
            <Phone size={18} className="text-indigo-400" /> +92 300 1234567
          </p>
          <p className="flex items-center gap-2 text-sm mb-2">
            <Mail size={18} className="text-indigo-400" /> support@mobilebazar.com
          </p>
          <p className="flex items-center gap-2 text-sm mb-5">
            <MapPin size={18} className="text-indigo-400" /> Dadu, Pakistan
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            {[
              { Icon: Facebook, color: "#1877F2" },
              { Icon: Instagram, color: "#E1306C" },
              { Icon: Twitter, color: "#1DA1F2" },
              { Icon: Linkedin, color: "#0077B5" },
              { Icon: Youtube, color: "#FF0000" },
            ].map(({ Icon, color }, i) => (
              <motion.a
                key={i}
                whileHover={{ scale: 1.15, rotate: 3 }}
                className="bg-white/10 p-2 rounded-full transition-all hover:shadow-lg"
                style={{ color }}
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Divider */}
      <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-indigo-400 font-semibold">MobileBazar</span> — 
          Built for next-gen smartphone lovers.
        </p>
        <p className="mt-2 text-gray-500 text-xs">
          Designed & Developed by <span className="text-indigo-300">MobileBazar Team</span> 
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
