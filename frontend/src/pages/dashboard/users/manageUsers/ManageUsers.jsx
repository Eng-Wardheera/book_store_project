import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteUserMutation, useFetchAllUsersQuery } from "../../../../redux/features/users/userApi";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const navigate = useNavigate();
  const { data: users = [], refetch } = useFetchAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  // State for pagination, search, and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const itemsPerPage = 6;

  // Filter and search logic with safeguards
  const filteredUsers = users.filter((user) => {
    const username = user.username || ""; // Ensure username is a string
    const role = user.role || ""; // Ensure role is a string
    return (
      username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedRole || role === selectedRole)
    );
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Paginated Users
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Handle deleting a user
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id).unwrap();
      Swal.fire({
        title: "User Deleted",
        text: "The user has been deleted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete user:", error.message);
      Swal.fire({
        title: "Error",
        text: "Failed to delete user. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Reset to the first page whenever search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole]);

  // Handle navigating to Edit User page
  const handleEditClick = (id) => {
    navigate(`/dashboard/edit-user/${id}`);
  };

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  //pagination when reading data

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 mx-1 rounded-md ${
              currentPage === i ? "bg-indigo-500 text-white" : "bg-gray-300 text-gray-600"
            }`}
          >
            {i}
          </button>
        );
      } else if (
        (i === currentPage - 3 || i === currentPage + 3) &&
        !pages.includes("...")
      ) {
        pages.push(
          <span key={i} className="px-3 py-2 mx-1 text-gray-600">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <section className="py-1 bg-blueGray-30">
      <div className="w-full xl:w-8/6 mb-12 xl:mb-0 px-2 mx-auto mt-2">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center justify-between">
              <h3 className="font-semibold text-base text-blueGray-700">Manage Users</h3>

              {/* Total Records */}
              <p className="text-sm text-gray-600">
                Showing {totalItems} of {users.length} users
              </p>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-md px-3 py-1 text-sm text-gray-600"
              />

              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border rounded-md px-3 py-1 text-sm text-gray-600"
              >
                <option value="">All Roles</option>
                {[...new Set(users.map((user) => user.role))].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-transparent w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    #
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Username
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Role
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr key={user._id}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
                      {startIndex + index + 1}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {user.username}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {user.role}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 space-x-4">
                      <button
                        onClick={() => handleEditClick(user._id)}
                        className="font-medium text-indigo-600 hover:text-indigo-700 mr-2 hover:underline underline-offset-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user.role === "admin"} // Disable delete button if the role is admin
                        className={`font-medium py-1 px-4 rounded-full ${
                          user.role === "admin" ? "bg-gray-400 text-gray-600" : "bg-red-500 text-white"
                        }`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center p-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 text-gray-600 px-3 py-2 rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            {renderPagination()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-300 text-gray-600 px-3 py-2 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageUsers;
