// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoute from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS Fix - Properly configure karo
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Dono ports allow karo
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ❌ YEH LINE REMOVE/Comment KARDO - yehi error de rahi hai
// app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoute);

// ✅ Health check route
app.get("/api/health", (req, res) => res.json({ 
  message: "🚀 Server running successfully!",
  timestamp: new Date().toISOString()
}));

app.get("/", (req, res) => res.json({ message: "🚀 Server running successfully!" }));

// ✅ Global error handler
app.use((error, req, res, next) => {
  console.error("Global Error:", error);
  res.status(500).json({ 
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// ✅ 404 handler
app.use((req, res) => res.status(404).json({ 
  success: false,
  message: "❌ Route not found" 
}));

// ✅ MongoDB Connect with better options
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/mobilebazar", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ✅ MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('❌ Mongoose disconnected');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`🔗 CORS Enabled for: http://localhost:5173, http://localhost:3000`);
});