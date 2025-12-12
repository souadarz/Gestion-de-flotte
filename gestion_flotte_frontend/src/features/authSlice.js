import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/axiosConfig.js";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, motDePasse }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { email, motDePasse });

      const { token, data } = res.data;
      console.log("logiiiin", res.data);
      localStorage.setItem("token", res.data);
      return { token, user: data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("token");
  }
});

export const getUserConnected = createAsyncThunk(
  "auth/getUserConnected",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue("Pas de token");
    }

    try {
      const res = await api.get("/auth/me");
      console.log("getuserconnect", res.data);
      return { token, user: res.data.data };
    } catch (error) {
      localStorage.removeItem("token");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isInitialized: false,
  },
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder
      // login actions
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //logout
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      //getUserConnected
      .addCase(getUserConnected.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserConnected.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isInitialized = true;
      })
      .addCase(getUserConnected.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitialized = true;
      });
  },
});

export const { logoutLocal } = authSlice.actions;

export default authSlice.reducer;
