import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "products",
    initialState: {
        allProducts: [],
        cart: [],
        addresses: [],
        selectedAddress: null,
        selectedCategory: "All",
    },
    reducers: {
        setProduct: (state, action) => {
            // console.log("Reducer received:", action.payload.length);
            state.allProducts = action.payload
        },
        setCart: (state, action) => {
            state.cart = action.payload
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(
                item => item.productId !== action.payload
            );
        },

        // Address -----------------------------------------
        // Set all addresses
        setAddresses(state, action) {
            state.addresses = action.payload;
        },

        // Add new address
        addAddress(state, action) {
            state.addresses.push(action.payload);
        },

        // Update address
        updateAddress(state, action) {
            const updatedAddress = action.payload;

            state.addresses = state.addresses.map((address) =>
                address._id === updatedAddress._id ? updatedAddress : address
            );

            if (
                state.selectedAddress &&
                state.selectedAddress._id === updatedAddress._id
            ) {
                state.selectedAddress = updatedAddress;
            }
        },

        // Delete address
        deleteAddress(state, action) {
            const addressId = action.payload;

            state.addresses = state.addresses.filter(
                (address) => address._id !== addressId
            );

            if (
                state.selectedAddress &&
                state.selectedAddress._id === addressId
            ) {
                state.selectedAddress = null;
            }
        },

        // Select address
        setSelectedAddress(state, action) {
            state.selectedAddress = action.payload;
        },

        // Clear addresses
        clearAddresses(state) {
            state.addresses = [];
            state.selectedAddress = null;
        },

        setSelectedCategory: (state, action) => { state.selectedCategory = action.payload }, // ✅ add this


    }
})

// Export actions (to use in components)
export const { setProduct } = productSlice.actions;
export const { setCart } = productSlice.actions;
export const { removeFromCart } = productSlice.actions;
export const { setCategory } = productSlice.actions;

export const {
    setAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddress,
    clearAddresses,
    setSelectedCategory
} = productSlice.actions;

// Export reducer (to register in store)
export default productSlice.reducer;