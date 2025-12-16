import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/axiosConfig.js";

// create regle maintenance
export const createRegleMaintenance = createAsyncThunk(
  "regleMaintenances/createRegleMaintenance",
  async (body, { rejectWithValue }) => {
    try {
      const res = await api.post("/regle-maintenances/", body);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get all regles maintenance
export const getAllRegleMaintenance = createAsyncThunk(
  "regleMaintenances/getAllRegleMaintenance",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/regle-maintenances/");
      // console.log("reeeeeeeeeeegle", res.data);
      const { metaData, data } = res.data;
      return { metaData, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get regle maintenance by id
export const getRegleMaintenanceById = createAsyncThunk(
  "regleMaintenances/getRegleMaintenanceById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/regle-maintenances/${id}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update regle maintenance
export const updateRegleMaintenance = createAsyncThunk(
  "regleMaintenances/updateRegleMaintenance",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/regle-maintenances/${id}`, data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// delete regle maintenance
export const deleteRegleMaintenance = createAsyncThunk(
  "regleMaintenances/deleteRegleMaintenance",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/regle-maintenances/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const regleMaintenanceSlice = createSlice({
  name: "regleMaintenance",
  initialState: {
    regles: [],
    regleDetail: null,
    loading: false,
    loadingDetail: false,
    error: null,
    totalItems: 0,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // create regle maintenance
      .addCase(createRegleMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRegleMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.regles.push(action.payload);
      })
      .addCase(createRegleMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get all regles maintenance
      .addCase(getAllRegleMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRegleMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.regles = action.payload.data;
        state.totalItems = action.payload.metaData.totalItems;
      })
      .addCase(getAllRegleMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get regle maintenance by id
      .addCase(getRegleMaintenanceById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(getRegleMaintenanceById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.regleDetail = action.payload;
      })
      .addCase(getRegleMaintenanceById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
        state.regleDetail = null;
      })

      // update regle maintenance
      .addCase(updateRegleMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRegleMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.regles = state.regles.map((r) =>
          r._id === updated._id ? updated : r
        );
        if (state.regleDetail?._id === updated._id) {
          state.regleDetail = updated;
        }
      })
      .addCase(updateRegleMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete regle maintenance
      .addCase(deleteRegleMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRegleMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.regles = state.regles.filter((r) => r._id !== id);
      })
      .addCase(deleteRegleMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default regleMaintenanceSlice.reducer;
