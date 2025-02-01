import React, { useState, useEffect } from 'react';
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ManageBooks = () => {
    const navigate = useNavigate();
    const { data: books = [], refetch } = useFetchAllBooksQuery();
    const [deleteBook] = useDeleteBookMutation();

    // State for pagination, search, and filtering
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const itemsPerPage = 6;

    // Filter and search logic
    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!selectedCategory || book.category === selectedCategory)
    );
    const totalItems = filteredBooks.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Paginated books
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    // Handle deleting a book
    const handleDeleteBook = async (id) => {
        try {
            await deleteBook(id).unwrap();
            Swal.fire({
                title: "Book Delete",
                text: "Your book is Deleted successfully!",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, It's Okay!"
                });
            refetch();
        } catch (error) {
            console.error('Failed to delete book:', error.message);
            alert('Failed to delete book. Please try again.');
        }
    };

    // Reset to the first page whenever search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    // Handle navigating to Edit Book page
    const handleEditClick = (id) => {
        navigate(`dashboard/edit-book/${id}`);
    };

    // Handle pagination
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-2 mx-1 rounded-md ${
                            currentPage === i
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                        }`}
                    >
                        {i}
                    </button>
                );
            } else if (
                (i === currentPage - 3 || i === currentPage + 3) &&
                !pages.includes('...')
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
                            <h3 className="font-semibold text-base text-blueGray-700">Manage Books</h3>

                            {/* Total Records */}
                            <p className="text-sm text-gray-600">
                                Showing {totalItems} of {books.length} books
                            </p>

                            {/* Search Bar */}
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border rounded-md px-3 py-1 text-sm text-gray-600"
                            />

                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="border rounded-md px-3 py-1 text-sm text-gray-600"
                            >
                                <option value="">All Categories</option>
                                {[...new Set(books.map((book) => book.category))].map((category) => (
                                    <option key={category} value={category}>
                                        {category}
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
                                        Book Title
                                    </th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Category
                                    </th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Price
                                    </th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedBooks.map((book, index) => (
                                    <tr key={index}>
                                        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
                                            {startIndex + index + 1}
                                        </th>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            {book.title}
                                        </td>
                                        <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            {book.category}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            ${book.newPrice}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 space-x-4">
                                            <Link
                                                to={`/dashboard/edit-book/${book._id}`}
                                                className="font-medium text-indigo-600 hover:text-indigo-700 mr-2 hover:underline underline-offset-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteBook(book._id)}
                                                className="font-medium bg-red-500 py-1 px-4 rounded-full text-white mr-2"
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

export default ManageBooks;
