import React from 'react';
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";

import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';

const SingleBook = () => {
    const { id } = useParams();
    const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);

    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error happened while loading book info</div>;

    return (
        <div className="max-w-sm shadow-md p-3 text-sm rounded-lg">
            <div className="mb-4">
            <h1 className="text-lg font-bold mb-2">{book.title}</h1>
                <img
                    src={`${getImgUrl(book.coverImage)}`}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-md"
                />
            </div>

           

            <div className="mb-3">
                <p className="text-gray-700 mb-1">
                    <strong>Author:</strong> {book.author || 'admin'}
                </p>
                <p className="text-gray-700 mb-1">
                    <strong>Published:</strong> {new Date(book?.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mb-1 capitalize">
                    <strong>Category:</strong> {book?.category}
                </p>
                <p className="text-gray-700">
                    <strong>Description:</strong> {book.description}
                </p>
            </div>

            <button
                onClick={() => handleAddToCart(book)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 px-3 rounded-md flex items-center justify-center gap-2 transition-all"
            >
                <FiShoppingCart />
                <span>Add to Cart</span>
            </button>
        </div>
    );
};

export default SingleBook;
