// import { motion } from "framer-motion";
// import { Package, ShoppingBag, Users } from "lucide-react";

// const DashboardCards = () => {
//   const stats = [
//     {
//       title: "Total Products",
//       value: 120,
//       icon: <Package size={34} />,
//       color: "from-cyan-400/40 to-blue-500/40",
//     },
//     {
//       title: "Total Orders",
//       value: 75,
//       icon: <ShoppingBag size={34} />,
//       color: "from-pink-400/40 to-rose-500/40",
//     },
//     {
//       title: "Total Users",
//       value: 50,
//       icon: <Users size={34} />,
//       color: "from-amber-300/40 to-orange-400/40",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//       {stats.map((stat, index) => (
//         <motion.div
//           key={index}
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: index * 0.2 }}
//           whileHover={{ scale: 1.08, rotate: 0.5 }}
//           whileTap={{ scale: 0.95 }}
//           className={`p-8 rounded-3xl shadow-2xl bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center text-white hover:shadow-cyan-400/30 transition-all duration-500`}
//         >
//           <motion.div
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.5 }}
//             className="mb-4 text-cyan-300"
//           >
//             {stat.icon}
//           </motion.div>
//           <h2 className="text-xl font-semibold tracking-wide">{stat.title}</h2>
//           <p className="text-4xl font-extrabold mt-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
//             {stat.value}
//           </p>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default DashboardCards;


// src/Admin/components/DashboardCards.jsx
import { motion } from "framer-motion";
import { Package, ShoppingBag, Users } from "lucide-react";

const DashboardCards = ({ stats, loading }) => {
  const cardData = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <Package size={34} />,
      color: "from-cyan-400/40 to-blue-500/40",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingBag size={34} />,
      color: "from-pink-400/40 to-rose-500/40",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users size={34} />,
      color: "from-amber-300/40 to-orange-400/40",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-gray-700 to-gray-600 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center text-white"
          >
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-gray-500 rounded-full mb-4 mx-auto"></div>
              <div className="h-4 bg-gray-500 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-500 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {cardData.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          whileHover={{ scale: 1.08, rotate: 0.5 }}
          whileTap={{ scale: 0.95 }}
          className={`p-8 rounded-3xl shadow-2xl bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center text-white hover:shadow-cyan-400/30 transition-all duration-500`}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-cyan-300"
          >
            {stat.icon}
          </motion.div>
          <h2 className="text-xl font-semibold tracking-wide">{stat.title}</h2>
          <p className="text-4xl font-extrabold mt-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardCards;