import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/axiosConfig.js";

// create maintenance
export const createMaintenance = createAsyncThunk(
  "maintenances/createMaintenance",
  async (body, { rejectWithValue }) => {
    try {
      const res = await api.post("/maintenances/", body);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get all maintenances
export const getAllMaintenances = createAsyncThunk(
  "maintenances/getAllMaintenances",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/maintenances/");
      console.log("maintenaceeeeeeeees: ", res.data);
      const { metaData, data } = res.data;
      return { metaData, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get maintenance by id
export const getMaintenanceById = createAsyncThunk(
  "maintenances/getMaintenanceById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/maintenances/${id}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update maintenance
export const updateMaintenance = createAsyncThunk(
  "maintenances/updateMaintenance",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/maintenances/${id}`, data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// delete maintenance
export const deleteMaintenance = createAsyncThunk(
  "maintenances/deleteMaintenance",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/maintenances/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// calcul prochaine maintenance
export const calculerProchaineMaintenance = createAsyncThunk(
  "maintenances/calculerProchaineMaintenance",
  async ({ vehiculeId, vehiculeType, type }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/maintenances/prochaine/${vehiculeId}?vehiculeType=${vehiculeType}&type=${type}`
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState: {
    maintenances: [],
    maintenanceDetail: null,
    prochaineMaintenance: null,
    loading: false,
    loadingDetail: false,
    error: null,
    totalItems: 0,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // create maintenance
      .addCase(createMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenances.push(action.payload);
      })
      .addCase(createMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get all maintenances
      .addCase(getAllMaintenances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMaintenances.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenances = action.payload.data;
        state.totalItems = action.payload.metaData.totalItems;
      })
      .addCase(getAllMaintenances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get maintenance by id
      .addCase(getMaintenanceById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(getMaintenanceById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.maintenanceDetail = action.payload;
      })
      .addCase(getMaintenanceById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
        state.maintenanceDetail = null;
      })

      // update maintenance
      .addCase(updateMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.maintenances = state.maintenances.map((m) =>
          m._id === updated._id ? updated : m
        );
      })
      .addCase(updateMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete maintenance
      .addCase(deleteMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.maintenances = state.maintenances.filter(
          (m) => m._id !== id
        );
      })
      .addCase(deleteMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // calcul prochaine maintenance
      .addCase(calculerProchaineMaintenance.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(calculerProchaineMaintenance.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.prochaineMaintenance = action.payload;
      })
      .addCase(calculerProchaineMaintenance.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
      });
  },
});

export default maintenanceSlice.reducer;
