import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import camionReducer from "../features/camionSlice.js";
import chauffeurReducer from "../features/chauffeurSlice.js"

const store = configureStore({
    reducer: {
        auth : authReducer,
        camions : camionReducer,
        chauffeurs : chauffeurReducer,
    }
});

export default store;