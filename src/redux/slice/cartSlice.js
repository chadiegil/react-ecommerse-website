import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  previousURL: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    ADD_TO_CART(state, action) {
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (productIndex >= 0) {
        // item already exist in the cart
        // increase the cart quantity
        state.cartItems[productIndex].cartQuantity += 1;
        toast.info(`${action.payload.name} increased by`, {
          position: "top-left",
        });
      } else {
        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProduct);
        toast.success(`${action.payload.name} product added to cart`, {
          position: "top-left",
        });
      }
      //   save cart to localstorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    DECREASE_CART(state, action) {
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (state.cartItems[productIndex].cartQuantity > 1) {
        state.cartItems[productIndex].cartQuantity -= 1;
      } else if (state.cartItems[productIndex].cartQuantity === 1) {
        const newCartItem = state.cartItems.filter(
          (item) => item.id !== action.payload.id
        );
        state.cartItems = newCartItem;

        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    REMOVE_FROM_CART(state, action) {
      const newCartItem = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      state.cartItems = newCartItem;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    CLEAR_CART(state, action) {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    CALCULATE_SUBTOTAL(state, action) {
      const tempArray = [];

      state.cartItems.map((item) => {
        const { price, cartQuantity } = item;
        const cartItemAmount = price * cartQuantity;
        return tempArray.push(cartItemAmount);
      });
      const totalAmount = tempArray.reduce((a, b) => {
        return a + b;
      }, 0);

      state.cartTotalAmount = totalAmount;
    },
    CALCULATE_TOTAL_QUANTITY(state, action) {
      const tempArray = [];
      state.cartItems.map((item) => {
        const { cartQuantity } = item;
        const quantity = cartQuantity;
        return tempArray.push(quantity);
      });
      const totalQuantity = tempArray.reduce((a, b) => {
        return a + b;
      }, 0);

      state.cartTotalQuantity = totalQuantity;
    },
    SAVE_URL(state, action) {
      state.previousURL = action.payload;
    },
  },
});

export const {
  ADD_TO_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  SAVE_URL,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartTotalQuantity = (state) => state.cart.cartTotalQuantity;
export const selectCartTotalAmount = (state) => state.cart.cartTotalAmount;
export const selectPreviousURL = (state) => state.cart.previousURL;

export default cartSlice.reducer;
