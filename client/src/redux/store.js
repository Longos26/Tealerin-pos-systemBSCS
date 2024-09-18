import { configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { rootReducer } from "./rootReducer";

// Set initial state
const initialState = {
  rootReducer: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
};

// Configure store with rootReducer and middleware
const store = configureStore({
  reducer: {
    rootReducer,
  },
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk), // Include thunk middleware
  devTools: process.env.NODE_ENV !== "production" ? composeWithDevTools() : false, // Optional: enables Redux DevTools in dev mode
});

export default store;
