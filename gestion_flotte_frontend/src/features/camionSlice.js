import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/axiosConfig.js";

// create camion
export const createCamion = createAsyncThunk(
  "camions/createCamion",
  async (body, { rejectWithValue }) => {
    try {
      const res = await api.post("/camions/", body);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
 
// get all camions
export const getAllCamions = createAsyncThunk(
  "camions/getAllCamions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/camions");
      console.log(res.data);
      const { metaData, data } = res.data;
      return { metaData, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get camion by id
export const getCamionById = createAsyncThunk( 
  "camions/getCamionById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/camions/${id}`);
      console.log("getcamion by id", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update camion
export const updateCamion = createAsyncThunk(
  "camions/updateCamion",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/camions/${id}`, data);
      console.log("upCamion", res.data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCamion = createAsyncThunk(
  "camions/deleteCamion",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/camions/${id}`);
      console.log("delCamion", res.data);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const camionSlice = createSlice({
  name: "camion",
  initialState: {
    camions: [],
    camionDetail: null,
    loading: false,
    loadingDetail: false,
    error: null,
    totalItems: 0,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      //create camion
      .addCase(createCamion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCamion.fulfilled, (state, action) => {
        state.loading = false;
        state.camions.push(action.payload);
      })
      .addCase(createCamion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get all camions
      .addCase(getAllCamions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCamions.fulfilled, (state, action) => {
        state.loading = false;
        state.camions = action.payload.data;
        state.totalItems = action.payload.metaData.totalItems;
      })
      .addCase(getAllCamions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get camion by id
      .addCase(getCamionById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(getCamionById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.camionDetail = action.payload;
      })
      .addCase(getCamionById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
        state.camionDetail = null;
      })
      //update camions
      .addCase(updateCamion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCamion.fulfilled, (state, action) => {
        state.loadingDetail = false;
        const updated = action.payload;
        state.camions = state.camions.map((c) =>
          c._id === updated._id ? updated : c
        );
      })
      .addCase(updateCamion.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
      })

      // delete camion
      .addCase(deleteCamion.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(deleteCamion.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.camions = state.camions.filter((c) => c._id !== id);
      })
      .addCase(deleteCamion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default camionSlice.reducer;
