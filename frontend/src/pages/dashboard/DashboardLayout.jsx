import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { HiUserAdd, HiViewGridAdd } from "react-icons/hi";
import { MdOutlineManageHistory } from "react-icons/md";
import { HiUser, HiUserGroup } from 'react-icons/hi2';
import { useFetchAllUsersQuery, useFetchUserByIdQuery } from '../../redux/features/users/userApi';

const DashboardLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
      // Check if token and username are available
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');

        if (!token || !storedUsername) {
            alert('Session expired! Please login again.');
            navigate('/');
        } else {
            setUsername(storedUsername); // Set username for display
        }
    }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = localStorage.getItem("username"); // Username ka localStorage ka hel
        if (!username) {
          setError("Username not found in localStorage");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/auth/get-user/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <section className="flex md:bg-gray-100 min-h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col ${
          isSidebarExpanded ? "w-64" : "w-20"
        } bg-gray-800 text-gray-200 transition-all duration-300`}
      >
        <div className="flex items-center justify-between h-20 px-4 bg-purple-600">
          <a href="/" className="text-white">
            <img src="./books.svg" alt="" className="h-10" />
          </a>
          <button
            onClick={toggleSidebar}
            className="text-gray-200 focus:outline-none"
          >
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
        </div>
        <nav className="flex-grow mt-6">
          <Link
            to="/dashboard"
            className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-md"
          >
            <HiUser className="h-6 w-6" />
            {isSidebarExpanded && <span className="ml-4">Dashboard</span>}
          </Link>
          <Link
            to="/dashboard/add-new-book"
            className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-md"
          >
            <HiViewGridAdd className="h-6 w-6" />
            {isSidebarExpanded && <span className="ml-4">Add Book</span>}
          </Link>
          <Link
            to="/dashboard/manage-books"
            className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-md"
          >
            <MdOutlineManageHistory className="h-6 w-6" />
            {isSidebarExpanded && <span className="ml-4">Manage Books</span>}
          </Link>
          <Link
            to="/dashboard/add-new-user"
            className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-md"
          >
            <HiUserAdd className="h-6 w-6" />
            {isSidebarExpanded && <span className="ml-4">Add User</span>}
          </Link>

          <Link
            to="/dashboard/all-users"
            className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-md"
          >
            <HiUserGroup className="h-6 w-6" />
            {isSidebarExpanded && <span className="ml-4">Manage Users</span>}
          </Link>

        </nav>
        <div className="flex items-center justify-center h-20 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-md"
          >
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {isSidebarExpanded && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow text-gray-800">
        <header className="flex items-center h-20 px-6 sm:px-10 bg-white">
          <button
            onClick={toggleSidebar}
            className="block sm:hidden p-2 mr-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:text-gray-800 rounded-full"
          >
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
          <div className="relative w-full max-w-md sm:-ml-2">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="absolute h-6 w-6 mt-2.5 ml-2 text-gray-400">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input type="text" role="search" placeholder="Search..." className="py-2 pl-10 pr-4 w-full border-4 border-transparent placeholder-gray-400 focus:bg-gray-50 rounded-lg" />
        </div>
        <div className="flex flex-shrink-0 items-center ml-auto">
          <button className="inline-flex items-center p-2 hover:bg-gray-100 focus:bg-gray-100 rounded-lg">
            <span className="sr-only">User Menu</span>
            <div className="hidden md:flex md:flex-col md:items-end md:leading-tight">
              <span className="font-semibold">{username}</span>
              <span className="text-sm text-gray-600">admin</span>
            </div>
            <span className="h-12 w-12 ml-2 sm:ml-3 mr-2 bg-gray-100 rounded-full overflow-hidden">
              <img src="https://cdn-icons-png.flaticon.com/512/219/219986.png" alt="" className="h-full w-full object-cover"/>
            </span>
            
          </button>
          <div className="border-l pl-3 ml-3 space-x-1">
            <button className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full">
              <span className="sr-only">Notifications</span>
              <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full"></span>
              <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full animate-ping"></span>
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button
            onClick={handleLogout}
            className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full">
              <span className="sr-only">Log out</span>
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
            </button>
          </div>
        </div>
        </header>
        <main className="p-6 sm:p-10 space-y-6">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardLayout;
