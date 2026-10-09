{/* Cart empty hone par */}
<button
  onClick={() => navigate("/my-orders")}
  className="bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-full font-semibold text-white transition-all flex items-center gap-2"
>
  <FaEye className="inline" />
  View My Orders
</button>

{/* Order success hone ke baad */}
<button
  onClick={() => navigate("/my-orders")}
  className="bg-blue-500 hover:bg-blue-400 px-6 py-3 rounded-full font-semibold text-white transition-all shadow-lg"
>
  View My Orders
</button>