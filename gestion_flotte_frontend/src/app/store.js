import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import camionReducer from "../features/camionSlice.js";
import chauffeurReducer from "../features/chauffeurSlice.js";
import trajetReducer from "../features/trajetSlice.js";
import remorqueReducer from "../features/remorqueSlice.js"

const store = configureStore({
    reducer: {
        auth : authReducer,
        camions : camionReducer,
        chauffeurs : chauffeurReducer,
        trajets : trajetReducer,
        remorques : remorqueReducer,
    }
});

export default store;