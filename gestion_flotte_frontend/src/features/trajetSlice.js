import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/axiosConfig.js";

// create trajet
export const createTrajet = createAsyncThunk(
  "trajets/createTrajet",
  async (body, { rejectWithValue }) => {
    try {
      const res = await api.post("/trajets/", body);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get all trajets (admin)
export const getAllTrajets = createAsyncThunk(
  "trajets/getAllTrajets",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/trajets?page=${page}&limit=${limit}`);
      return { metaData: res.data.metaData, data: res.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get trajet by id
export const getTrajetById = createAsyncThunk(
  "trajets/getTrajetById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/trajets/${id}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get trajets du chauffeur connecté
export const getTrajetsChauffeur = createAsyncThunk(
  "trajets/getTrajetsChauffeur",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/trajets/chauffeur");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update trajet (admin)
export const updateTrajet = createAsyncThunk(
  "trajets/updateTrajet",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/trajets/${id}`, data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update trajet par le chauffeur
export const updateTrajetChauffeur = createAsyncThunk(
  "trajets/updateTrajetChauffeur",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/trajets/chauffeur/${id}`, data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// delete trajet
export const deleteTrajet = createAsyncThunk(
  "trajets/deleteTrajet",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/trajets/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const trajetSlice = createSlice({
  name: "trajet",
  initialState: {
    trajets: [],
    trajetDetail: null,
    trajetsChauffeur: [],
    loading: false,
    loadingDetail: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // create trajet
      .addCase(createTrajet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrajet.fulfilled, (state, action) => {
        state.loading = false;
        state.trajets.push(action.payload);
      })
      .addCase(createTrajet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get all trajets
      .addCase(getAllTrajets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTrajets.fulfilled, (state, action) => {
        state.loading = false;
        state.trajets = action.payload.data;
        state.currentPage = action.payload.metaData.currentPage;
        state.totalPages = action.payload.metaData.totalPages;
        state.totalItems = action.payload.metaData.totalItems;
        state.limit = action.payload.metaData.limit || state.limit;
      })
      .addCase(getAllTrajets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get trajet by id
      .addCase(getTrajetById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(getTrajetById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.trajetDetail = action.payload;
      })
      .addCase(getTrajetById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
        state.trajetDetail = null;
      })

      // get trajets chauffeur
      .addCase(getTrajetsChauffeur.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrajetsChauffeur.fulfilled, (state, action) => {
        state.loading = false;
        state.trajetsChauffeur = action.payload;
      })
      .addCase(getTrajetsChauffeur.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update trajet admin
      .addCase(updateTrajet.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(updateTrajet.fulfilled, (state, action) => {
        state.loadingDetail = false;
        const updated = action.payload;
        state.trajets = state.trajets.map((t) =>
          t._id === updated._id ? updated : t
        );
      })
      .addCase(updateTrajet.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
      })

      // update trajet chauffeur
      .addCase(updateTrajetChauffeur.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(updateTrajetChauffeur.fulfilled, (state, action) => {
        state.loadingDetail = false;
        const updated = action.payload;
        state.trajetsChauffeur = state.trajetsChauffeur.map((t) =>
          t._id === updated._id ? updated : t
        );
        state.trajets = state.trajets.map((t) =>
          t._id === updated._id ? updated : t
        );
      })
      .addCase(updateTrajetChauffeur.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
      })

      // delete trajet
      .addCase(deleteTrajet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrajet.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.trajets = state.trajets.filter((t) => t._id !== id);
        state.trajetsChauffeur = state.trajetsChauffeur.filter(
          (t) => t._id !== id
        );
      })
      .addCase(deleteTrajet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default trajetSlice.reducer;