import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/axiosConfig.js";

// create remorque
export const createRemorque = createAsyncThunk(
  "remorques/createRemorque",
  async (body, { rejectWithValue }) => {
    try {
      const res = await api.post("/remorques", body);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get all remorques
export const getAllRemorques = createAsyncThunk(
  "remorques/getAllRemorques",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/remorques");
      const { metaData, data } = res.data;
      return { metaData, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get remorque by id
export const getRemorqueById = createAsyncThunk(
  "remorques/getRemorqueById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/remorques/${id}`);
      console.log("getRemorque by id", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update remorque
export const updateRemorque = createAsyncThunk(
  "remorques/updateRemorque",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/remorques/${id}`, data);
      console.log("upRemorque", res.data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteRemorque = createAsyncThunk(
  "remorques/deleteRemorque",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/remorques/${id}`);
      console.log("delRemorque", res.data);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const remorqueSlice = createSlice({
  name: "remorque",
  initialState: {
    remorques: [],
    remorqueDetail: null,
    loading: false,
    loadingDetail: false,
    error: null,
    totalItems: 0,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      //create remorque
      .addCase(createRemorque.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRemorque.fulfilled, (state, action) => {
        state.loading = false;
        state.remorques.push(action.payload);
      })
      .addCase(createRemorque.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get all remorques
      .addCase(getAllRemorques.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRemorques.fulfilled, (state, action) => {
        state.loading = false;
        state.remorques = action.payload.data;
        state.totalItems = action.payload.metaData.totalItems;

      })
      .addCase(getAllRemorques.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get remorque by id
      .addCase(getRemorqueById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(getRemorqueById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.remorqueDetail = action.payload;
      })
      .addCase(getRemorqueById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
        state.remorqueDetail = null;
      })

      //update remorque
      .addCase(updateRemorque.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRemorque.fulfilled, (state, action) => {
        state.loadingDetail = false;
        const updated = action.payload;
        state.remorques = state.remorques.map((r) =>
          r._id === updated._id ? updated : r
        );
      })
      .addCase(updateRemorque.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
      })

      // delete remorque
      .addCase(deleteRemorque.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(deleteRemorque.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.remorques = state.remorques.filter((r) => r._id !== id);
      })
      .addCase(deleteRemorque.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default remorqueSlice.reducer;
