// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import DashboardCards from "../components/DashboardCards";
// import { motion } from "framer-motion";

// const Dashboard = () => {
//   return (
//     <div className="flex min-h-screen bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-700 text-white">
//       <Sidebar />

//       {/* Main Section */}
//       <div className="flex-1 flex flex-col">
//         <Topbar />

//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="p-10"
//         >
//           <h1 className="text-5xl font-extrabold mb-10 text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.7)] text-center">
//             Admin Dashboard ⚡
//           </h1>

//           <DashboardCards />
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// src/Admin/pages/Dashboard.jsx
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardCards from "../components/DashboardCards";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          fetch(`${API_BASE}/api/products`),
          fetch(`${API_BASE}/api/orders`),
          fetch(`${API_BASE}/api/users`)
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();

        // Extract counts from different response formats
        const productsCount = Array.isArray(productsData) ? productsData.length : 
                            productsData.products ? productsData.products.length : 
                            productsData.success && productsData.products ? productsData.products.length : 0;

        let ordersCount = 0;
        if (Array.isArray(ordersData)) {
          ordersCount = ordersData.length;
        } else if (ordersData.orders && Array.isArray(ordersData.orders)) {
          ordersCount = ordersData.orders.length;
        } else if (ordersData.success && Array.isArray(ordersData.orders)) {
          ordersCount = ordersData.orders.length;
        }

        const usersCount = Array.isArray(usersData) ? usersData.length : 
                          usersData.users ? usersData.users.length : 
                          usersData.success && usersData.users ? usersData.users.length : 0;

        setStats({
          totalProducts: productsCount,
          totalOrders: ordersCount,
          totalUsers: usersCount
        });

      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-700 text-white">
      <Sidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <Topbar />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-10"
        >
          <h1 className="text-5xl font-extrabold mb-10 text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.7)] text-center">
            Admin Dashboard ⚡
          </h1>

          <DashboardCards stats={stats} loading={loading} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;