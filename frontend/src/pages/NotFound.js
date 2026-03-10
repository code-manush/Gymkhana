import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="text-7xl mb-6">🎓</div>
      <h1 className="text-6xl font-black text-brand-600 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        Looks like you've wandered off the campus map. The page you're looking for doesn't exist.
      </p>
      <Link
        to="/dashboard"
        className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
