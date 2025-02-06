import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

// Helper: Get cart items from localStorage
const getCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
};

// Helper: Save cart items to localStorage
const saveCartToLocalStorage = (cartItems) => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

const initialState = {
    cartItems: getCartFromLocalStorage(),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find(
                (item) => item._id === action.payload._id
            );
            if (!existingItem) {
                state.cartItems.push(action.payload);
                saveCartToLocalStorage(state.cartItems); // Save to localStorage
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Product Added to the Cart",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                Swal.fire({
                    title: "Already Added to the Cart",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "OK!",
                });
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item._id !== action.payload._id
            );
            saveCartToLocalStorage(state.cartItems); // Update localStorage
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems"); // Clear localStorage
        },
        logout: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems"); // Clear localStorage when user logs out
        },
    },
});

// Export the actions
export const { addToCart, removeFromCart, clearCart, logout } = cartSlice.actions;
export default cartSlice.reducer;
