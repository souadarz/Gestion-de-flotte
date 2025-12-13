import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import camionReducer from "../features/camionSlice.js";

const store = configureStore({
    reducer: {
        auth : authReducer,
        camions : camionReducer,
    }
});

export default store;