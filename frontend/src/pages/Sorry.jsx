import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SorryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || "The pandit has declined your booking.";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-rose-600">Sorry</h1>
        <p className="mt-4 text-gray-700 text-lg">{message}</p>
        <p className="mt-3 text-sm text-gray-500">Redirecting you back to home...</p>
      </div>
    </div>
  );
};

export default SorryPage;
