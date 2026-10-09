// AdminRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Orders from "./pages/Orders";
import AdminAuth from "./pages/AdminAuth";

const AdminRoutes = () => {
  const isAdminAuthenticated = !!localStorage.getItem("adminToken");

  return (
    <Routes>
      <Route
        path="auth"
        element={
          isAdminAuthenticated ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <AdminAuth />
          )
        }
      />

      {isAdminAuthenticated ? (
        <>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<AddProduct />} />
          <Route path="products" element={<ProductList />} />
          <Route path="orders" element={<Orders />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/admin/auth" replace />} />
      )}
    </Routes>
  );
};

export default AdminRoutes;