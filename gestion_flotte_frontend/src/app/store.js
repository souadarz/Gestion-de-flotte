import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import camionReducer from "../features/camionSlice.js";
import chauffeurReducer from "../features/chauffeurSlice.js";
import trajetReducer from "../features/trajetSlice.js";
import remorqueReducer from "../features/remorqueSlice.js";
import maintenanceReducer from "../features/maintenanceSlice.js";
import regleMaintenanceReducer from "../features/regleMaintenanceSlice.js";

const store = configureStore({
    reducer: {
        auth : authReducer,
        camions : camionReducer,
        chauffeurs : chauffeurReducer,
        trajets : trajetReducer,
        remorques : remorqueReducer,
        maintenances : maintenanceReducer,
        regleMaintenances : regleMaintenanceReducer,
    }
});

export default store;