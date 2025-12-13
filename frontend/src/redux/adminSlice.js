import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  admin: JSON.parse(localStorage.getItem("admin")) || null,
  token: localStorage.getItem("adminToken") || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("adminToken"),
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminLoginSuccess: (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem("adminToken", action.payload.token);
      localStorage.setItem("admin", JSON.stringify(action.payload.admin));
    },

    adminLogout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
    },
  },
});


export const { adminLoginSuccess, adminLogout } = adminSlice.actions;

export default adminSlice.reducer;
