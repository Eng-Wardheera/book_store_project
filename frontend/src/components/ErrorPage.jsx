// src/components/ErrorPage.jsx
import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-red-500 text-center">
      {/* Shaking Head Emoji */}
      <div className="text-8xl mb-4 animate-bounce">🤦‍♂️</div>

      {/* Error Title */}
      <h1 className="text-6xl font-bold mb-2">404</h1>

      {/* Error Message */}
      <p className="text-xl font-medium">
        {error?.statusText || "Oops! Page not found."}
      </p>

      {/* Error Details */}
      <p className="text-lg italic mt-2">
        {error?.message || "We couldn't find the page you're looking for."}
      </p>

      {/* Additional Hint */}
      <p className="text-lg mt-4">Please check the URL and try again.</p>
    </div>
  );
};

export default ErrorPage;
