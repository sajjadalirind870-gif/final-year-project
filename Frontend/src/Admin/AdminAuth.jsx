import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) navigate("/admin/dashboard", { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.email || !formData.password)
      return setMessage("⚠️ Please enter email & password");

    if (!isLogin && formData.password !== formData.confirmPassword)
      return setMessage("⚠️ Passwords do not match");

    try {
      setLoading(true);
      const payload = isLogin
        ? { email: formData.email.trim(), password: formData.password }
        : {
            name: formData.name,
            email: formData.email.trim(),
            password: formData.password,
          };

      const url = isLogin
        ? "http://localhost:5000/api/admin/login"
        : "http://localhost:5000/api/admin/register";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem("adminToken", data.token);
          localStorage.setItem("adminName", data.admin?.name || "");
          navigate("/admin/dashboard");
        } else {
          setMessage("✅ Admin created! Please login.");
          setIsLogin(true);
        }
      } else {
        setMessage(data.message || "⚠️ Something went wrong");
      }
    } catch (error) {
      console.error("FETCH ERROR:", error);
      setMessage("⚠️ Unable to connect to backend (check port 5000)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <ImSpinner2 className="animate-spin text-5xl text-white mb-3" />
          <p className="text-white text-lg font-medium">
            {isLogin ? "Logging in..." : "Creating Account..."}
          </p>
        </div>
      )}

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          {isLogin ? "👨‍💼 Admin Login" : "🧾 Admin Signup"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <span
              className="absolute right-4 top-3.5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all disabled:opacity-70"
            disabled={loading}
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-700">
          {isLogin ? "New Admin?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-600 font-semibold hover:underline"
          >
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>

        {message && (
          <p className="text-center mt-4 text-red-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AdminAuth;
