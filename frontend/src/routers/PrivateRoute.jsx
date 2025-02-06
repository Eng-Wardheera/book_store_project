import React from 'react';
import { useAuth } from './../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { currentUser, loading, error } = useAuth();

    if (loading) {
        // Optionally, you can add a more sophisticated loading spinner or animation here.
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-semibold text-gray-700">Loading...</div>
            </div>
        );
    }

    if (error) {
        // Display an error message if there's an issue with authentication.
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 font-semibold">An error occurred: {error.message || "Unable to authenticate user."}</p>
            </div>
        );
    }

    if (currentUser) {
        return children;
    }

    // Redirect to the login page if no authenticated user is present.
    return <Navigate to="/login" replace />;
};

export default PrivateRoute;
