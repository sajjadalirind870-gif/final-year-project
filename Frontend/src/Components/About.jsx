// src/pages/About.jsx
import React from "react";
import { Smartphone, DollarSign, Handshake } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-700 text-white px-6 md:px-20 py-12">
      
      {/* 🔹 Animated Heading - Moved up */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent text-center"
      >
        About <span className="text-white">Mobile-Bazar</span>
      </motion.h1>

      {/* 🔹 Animated Paragraph - Moved up significantly */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="max-w-3xl text-lg md:text-xl text-gray-200 leading-relaxed text-center mb-6"
      >
        Welcome to <span className="font-semibold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">Mobile-Bazar</span>, 
        your one-stop destination for the latest smartphones and quality used mobile phones.  
        We provide both premium quality new mobile phones and certified pre-owned devices at unbeatable prices, 
        with a strong focus on <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">customer satisfaction</span>.  
        Our goal is to bring you the newest technology and reliable used options with excellent after-sale support.
      </motion.p>

      {/* 🔹 Cards with Motion Effects - Moved up much closer to paragraph */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-2">
        {[
          {
            icon: <Smartphone size={50} className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent" />,
            title: "Latest & Used Models",
            text: "Stay updated with the most trending and advanced smartphones in the market. We also offer certified used mobile phones to fit every budget.",
            colors: "from-indigo-500/30 via-purple-500/30 to-pink-500/30",
          },
          {
            icon: <DollarSign size={50} className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent" />,
            title: "Best Prices",
            text: "We offer competitive pricing so you can enjoy premium phones without overspending, with attractive deals on used devices.",
            colors: "from-green-500/30 via-emerald-500/30 to-teal-500/30",
          },
          {
            icon: <Handshake size={50} className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent" />,
            title: "Trusted Service",
            text: "Our team ensures reliable customer support and quick delivery for both new and used mobile phones.",
            colors: "from-blue-500/30 via-cyan-500/30 to-sky-500/30",
          },
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
            whileHover={{ scale: 1.08, rotate: 1 }}
            className={`bg-gradient-to-br ${card.colors} p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-amber-400/30 transition-all flex flex-col items-center justify-center text-center h-full`}
          >
            <div className="flex items-center justify-center mb-2">
              {card.icon}
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent mb-3 text-center w-full">
              {card.title}
            </h2>
            <p className="text-gray-100 text-center font-medium leading-relaxed w-full px-2">
              {card.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default About;