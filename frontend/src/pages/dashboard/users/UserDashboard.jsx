import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../context/AuthContext';
import { useGetOrderByEmailQuery } from '../../../redux/features/orders/ordersApi';
import { clearCart } from '../../../redux/features/cart/cartSlice';

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const UserDashboard = () => {
  const { currentUser, logout } = useAuth(); // Access logout function
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);

  const handleLogout = () => {
    dispatch(clearCart()); // Clear cart when user logs out
    logout(); // Trigger logout logic
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error retrieving orders data. Please try again later.</div>;

  const totalMoneySpent = orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2);
  const totalOrders = orders.length;
  const checkoutOrders = orders.filter((order) => order.status === 'Checked Out').length;
  const cartItemCount = cartItems.length;

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <p className="text-gray-700 mb-6">
          {getTimeBasedGreeting()}, {currentUser?.name || 'User'}! Here are your details and recent orders:
        </p>

        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold text-blue-600">${totalMoneySpent}</p>
            <p className="text-gray-600">Total Spent</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold text-green-600">{totalOrders}</p>
            <p className="text-gray-600">Total Orders</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold text-yellow-600">{checkoutOrders}</p>
            <p className="text-gray-600">Checked Out</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold text-purple-600">{cartItemCount}</p>
            <p className="text-gray-600">Items in Cart</p>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
          {orders.length > 0 ? (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order._id} className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-1">
                  <p className="font-medium">Order ID: {order._id}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Total: ${order.totalPrice}</p>
                  <p>Status: {order.status}</p>
                  <div className="text-gray-600">
                    Products:
                    {order.productIds.map((productId) => (
                      <p key={productId} className="ml-2">- {productId}</p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You have no recent orders.</p>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-6 text-right">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
