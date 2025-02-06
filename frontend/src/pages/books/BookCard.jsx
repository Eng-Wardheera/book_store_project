import React, { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { getImgUrl } from '../../utils/getImgUrl';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

const BookCard = ({ book }) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isTitleExpanded, setIsTitleExpanded] = useState(false);
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    const toggleTitle = () => {
        setIsTitleExpanded(!isTitleExpanded);
    };

    const maxTitleLength = 30; // Max length for visible title
    const maxDescriptionLength = 40; // Max length for visible description

    const title =
        book?.title.length > maxTitleLength && !isTitleExpanded
            ? `${book?.title.slice(0, maxTitleLength)}...`
            : book?.title;

    const description =
        book?.description.length > maxDescriptionLength && !isDescriptionExpanded
            ? `${book?.description.slice(0, maxDescriptionLength)}...`
            : book?.description;

    return (
        <div className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row gap-4">
            {/* Image Section */}
            <div className="flex-shrink-0 w-full md:w-24">
                <Link to={`/books/${book._id}`}>
                    <img
                        src={`${getImgUrl(book?.coverImage)}`}
                        alt={book?.title}
                        className="w-full h-auto rounded-md object-cover"
                    />
                </Link>
            </div>

            {/* Book Details Section */}
            <div className="flex-1">
                <Link to={`/books/${book._id}`}>
                    <h3 className="text-lg font-bold text-gray-800 hover:text-blue-500 transition-colors mb-2">
                        {title}
                        {book?.title.length > maxTitleLength && (
                            <button
                                onClick={toggleTitle}
                                className="text-blue-500 hover:underline text-sm ml-1"
                            >
                                {isTitleExpanded ? 'Read Less' : 'Read More'}
                            </button>
                        )}
                    </h3>
                </Link>
                {/* Author Name */}
                <p className="text-gray-500 text-sm mb-2 font-bold">
                    {book?.author ? `${book.author}` : 'Admin'}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                    {description}
                    {book?.description.length > maxDescriptionLength && (
                        <button
                            onClick={toggleDescription}
                            className="text-blue-500 hover:underline text-sm ml-1"
                        >
                            {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                        </button>
                    )}
                </p>
                <p className="text-blue-600 font-medium mb-4">
                    ${book?.newPrice}{' '}
                    <span className="text-gray-400 line-through">
                        ${book?.oldPrice}
                    </span>
                </p>
                <button
                    onClick={() => handleAddToCart(book)}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition-all"
                >
                    <FiShoppingCart />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default BookCard;
