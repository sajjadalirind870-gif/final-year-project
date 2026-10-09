// import { useState } from "react";

// const UserAuth = ({ setIsAuthenticated }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({ name: "", email: "", password: "" });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const url = isLogin
//         ? "http://localhost:5000/api/auth/login"
//         : "http://localhost:5000/api/auth/signup";

//       const payload = isLogin
//         ? { email: formData.email, password: formData.password }
//         : { name: formData.name || "User", email: formData.email, password: formData.password };

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("token", data.token); // JWT save
//         setIsAuthenticated(true); // real login
//         alert(isLogin ? "Login Successful" : "Signup Successful");
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100">
//       <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//           {isLogin ? "🔑 User Login" : "📝 Create Account"}
//         </h2>

//         <form onSubmit={handleSubmit} className="grid gap-4">
//           {!isLogin && (
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="border p-3 rounded-lg focus:outline-pink-500"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="border p-3 rounded-lg focus:outline-pink-500"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="border p-3 rounded-lg focus:outline-pink-500"
//           />

//           <button
//             type="submit"
//             className="bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-lg font-semibold transition"
//           >
//             {isLogin ? "Login" : "Signup"}
//           </button>
//         </form>

//         <p className="text-center mt-4 text-gray-600">
//           {isLogin ? "New here?" : "Already have an account?"}{" "}
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-pink-600 font-semibold hover:underline"
//           >
//             {isLogin ? "Signup" : "Login"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UserAuth;








// import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import Loader from "../Components/Loader";

// const UserAuth = ({ setIsAuthenticated }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate fields
//     if (!formData.email || !formData.password) {
//       setMessage("⚠️ Please enter email & password");
//       return;
//     }
//     if (!isLogin && formData.password !== formData.confirmPassword) {
//       setMessage("⚠️ Passwords do not match");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = isLogin
//         ? {
//             email: formData.email.trim().toLowerCase(),
//             password: formData.password
//           }
//         : {
//             name: formData.name || "User",
//             email: formData.email.trim().toLowerCase(),
//             password: formData.password
//           };

//       const url = isLogin
//         ? "http://localhost:5000/api/auth/login"
//         : "http://localhost:5000/api/auth/signup";

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const data = await res.json();

//       if (res.ok) {
//         if (!isLogin) {
//           // Signup success → loader + then show login form
//           setMessage("🎉 Creating Account...");
//           setTimeout(() => {
//             setMessage("✅ Account Created! Please login");
//             setTimeout(() => {
//               setMessage("");
//               setIsLogin(true);
//               setLoading(false);
//             }, 1500);
//           }, 2000);
//         } else {
//           // Login success → loader + redirect
//           setMessage("🚀 Logging in...");
//           setTimeout(() => {
//             localStorage.setItem("token", data.token);
//             setIsAuthenticated(true);
//             setLoading(false);
//             setMessage("");
//             window.location.href = "/home"; // Hero page
//           }, 2000);
//         }
//       } else {
//         setLoading(false);
//         setMessage(data.message || "⚠️ Invalid credentials");
//       }
//     } catch (err) {
//       setLoading(false);
//       setMessage("⚠️ Something went wrong");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100 relative">
//       {loading && <Loader text={message} />}
//       <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 z-10">
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//           {isLogin ? "🔑 User Login" : "📝 Create Account"}
//         </h2>

//         <form onSubmit={handleSubmit} className="grid gap-4">
//           {!isLogin && (
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="border p-3 rounded-lg focus:outline-pink-500"
//             />
//           )}

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="border p-3 rounded-lg focus:outline-pink-500"
//           />

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="border p-3 rounded-lg focus:outline-pink-500 w-full"
//             />
//             <span
//               className="absolute right-3 top-3 cursor-pointer text-gray-500"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>

//           {!isLogin && (
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 placeholder="Confirm Password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="border p-3 rounded-lg focus:outline-pink-500 w-full"
//               />
//               <span
//                 className="absolute right-3 top-3 cursor-pointer text-gray-500"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               >
//                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//           )}

//           <button
//             type="submit"
//             className="bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-lg font-semibold transition"
//           >
//             {isLogin ? "Login" : "Signup"}
//           </button>
//         </form>

//         <p className="text-center mt-4 text-gray-600">
//           {isLogin ? "New here?" : "Already have an account?"}{" "}
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-pink-600 font-semibold hover:underline"
//           >
//             {isLogin ? "Signup" : "Login"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UserAuth;




// import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const UserAuth = ({ setIsAuthenticated }) => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       setMessage("⚠️ Please enter email & password");
//       return;
//     }
//     if (!isLogin && formData.password !== formData.confirmPassword) {
//       setMessage("⚠️ Passwords do not match");
//       return;
//     }

//     try {
//       const payload = isLogin
//         ? { email: formData.email.trim().toLowerCase(), password: formData.password }
//         : { name: formData.name, email: formData.email.trim().toLowerCase(), password: formData.password };

//       console.log("📤 Sending payload:", payload);

//       const url = isLogin
//         ? "http://localhost:5000/api/users/login"
//         : "http://localhost:5000/api/users/register";

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const data = await res.json();
//       console.log("📥 Response:", data);

//       if (res.ok) {
//         if (isLogin) {
//           localStorage.setItem("token", data.token);
//           setIsAuthenticated(true);
//           setMessage("✅ Login successful!");
//           navigate("/");
//         } else {
//           setMessage("✅ Account created! Please login.");
//           setIsLogin(true);
//         }
//       } else {
//         setMessage(data.message || "⚠️ Something went wrong");
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setMessage("⚠️ Something went wrong");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-bold text-center mb-4">
//           {isLogin ? "Login" : "Signup"}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {!isLogin && (
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//             <span
//               className="absolute right-3 top-3 cursor-pointer"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           {!isLogin && (
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           )}
//           <button
//             type="submit"
//             className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-500"
//           >
//             {isLogin ? "Login" : "Signup"}
//           </button>
//         </form>
//         <p className="text-center mt-4">
//           {isLogin ? "New user?" : "Already have an account?"}{" "}
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-pink-600 font-semibold"
//           >
//             {isLogin ? "Signup" : "Login"}
//           </button>
//         </p>
//         {message && <p className="text-center mt-2 text-red-500">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default UserAuth;






// import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const UserAuth = ({ setIsAuthenticated }) => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       setMessage("⚠️ Please enter email & password");
//       return;
//     }
//     if (!isLogin && formData.password !== formData.confirmPassword) {
//       setMessage("⚠️ Passwords do not match");
//       return;
//     }

//     try {
//       const payload = isLogin
//         ? { email: formData.email.trim().toLowerCase(), password: formData.password }
//         : { name: formData.name, email: formData.email.trim().toLowerCase(), password: formData.password };

//       console.log("📤 Sending payload:", payload);

//       const url = isLogin
//     ? "http://localhost:5000/api/users/login"
//   : "http://localhost:5000/api/users/register";

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const data = await res.json();
//       console.log("📥 Response:", data);

//       if (res.ok) {
//         if (isLogin) {
//           localStorage.setItem("token", data.token);
//           setIsAuthenticated(true);
//           setMessage("✅ Login successful!");
//           navigate("/");
//         } else {
//           setMessage("✅ Account created! Please login.");
//           setIsLogin(true);
//         }
//       } else {
//         setMessage(data.message || "⚠️ Something went wrong");
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setMessage("⚠️ Something went wrong");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-bold text-center mb-4">
//           {isLogin ? "Login" : "Signup"}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {!isLogin && (
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//             <span
//               className="absolute right-3 top-3 cursor-pointer"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           {!isLogin && (
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           )}
//           <button
//             type="submit"
//             className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-500"
//           >
//             {isLogin ? "Login" : "Signup"}
//           </button>
//         </form>
//         <p className="text-center mt-4">
//           {isLogin ? "New user?" : "Already have an account?"}{" "}
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-pink-600 font-semibold"
//           >
//             {isLogin ? "Signup" : "Login"}
//           </button>
//         </p>
//         {message && <p className="text-center mt-2 text-red-500">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default UserAuth;











import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";

const UserAuth = ({ setIsAuthenticated }) => {
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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("⚠️ Please enter email & password");
      return;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage("⚠️ Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const payload = isLogin
        ? {
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }
        : {
            name: formData.name,
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          };

      const url = isLogin
   ? "http://localhost:5000/api/users/login"
  : "http://localhost:5000/api/users/register";

      // ✅ Actual API call
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // ✅ Wait for at least 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem("token", data.token);
          setIsAuthenticated(true);
          setMessage("✅ Login successful!");
          navigate("/");
        } else {
          setMessage("✅ Account created! Please login.");
          setIsLogin(true);
        }
      } else {
        setMessage(data.message || "⚠️ Something went wrong");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {/* 🔥 Full-screen Loader */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <ImSpinner2 className="animate-spin text-5xl text-white mb-3" />
          <p className="text-white text-lg font-medium tracking-wide">
            {isLogin ? "Logging in..." : "Signing up..."}
          </p>
        </div>
      )}

      {/* 🧩 Auth Card */}
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
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
          {isLogin ? "New user?" : "Already have an account?"}{" "}
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

export default UserAuth;
