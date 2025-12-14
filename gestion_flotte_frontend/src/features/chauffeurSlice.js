import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/axiosConfig.js";

// create chauffuer 
export const createChauffeur = createAsyncThunk(
  "chauffeurs/createChauffeur",
  async (body, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/chauffeurs", body);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get all chauffeurs
export const getAllChauffeurs = createAsyncThunk(
  "chauffeurs/getAllChauffeurs",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/users/chauffeurs?page=${page}&limit=${limit}&search=${search}`
      );

      const { metaData, data } = res.data;
      return { metaData, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get chauffeur by id 
export const getChauffeurById = createAsyncThunk(
  "chauffeurs/getChauffeurById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/chauffeurs/${id}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const chauffeurSlice = createSlice({
  name: "chauffeur",
  initialState: {
    chauffeurs: [],
    chauffeurDetail: null,
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
      // create
      .addCase(createChauffeur.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChauffeur.fulfilled, (state, action) => {
        state.loading = false;
        state.chauffeurs.unshift(action.payload);
      })
      .addCase(createChauffeur.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    //   get all chauufffeur
      .addCase(getAllChauffeurs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllChauffeurs.fulfilled, (state, action) => {
        state.loading = false;
        state.chauffeurs = action.payload.data;

        state.currentPage = action.payload.metaData.currentPage;
        state.totalPages = action.payload.metaData.totalPages;
        state.totalItems = action.payload.metaData.totalItems;
        state.limit = action.payload.metaData.limit;
      })
      .addCase(getAllChauffeurs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    //   get by id
      .addCase(getChauffeurById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(getChauffeurById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.chauffeurDetail = action.payload;
      })
      .addCase(getChauffeurById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
        state.chauffeurDetail = null;
      });
  },
});

export default chauffeurSlice.reducer;