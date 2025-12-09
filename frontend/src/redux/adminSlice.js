import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  token: localStorage.getItem("adminToken") || null,
  isAuthenticated: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminLoginSuccess: (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    adminLogout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("adminToken");
    },
  },
});

export const { adminLoginSuccess, adminLogout } = adminSlice.actions;

export default adminSlice.reducer;
