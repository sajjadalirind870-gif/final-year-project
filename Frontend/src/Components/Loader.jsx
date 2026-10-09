// src/components/Loader.jsx
import React from "react";

const Loader = ({ text }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
      <div className="flex space-x-3 mb-4">
        <div className="w-6 h-6 bg-pink-500 rounded-full animate-bounce"></div>
        <div className="w-6 h-6 bg-purple-500 rounded-full animate-bounce delay-200"></div>
        <div className="w-6 h-6 bg-yellow-500 rounded-full animate-bounce delay-400"></div>
      </div>
      {text && <h2 className="text-white text-xl font-bold">{text}</h2>}
    </div>
  );
};

export default Loader;
