import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem(process.env.REACT_APP_TOKEN_KEY_RADC) || null,
  role: localStorage.getItem(process.env.REACT_APP_USER_TYPE_RADC) || null,
  active: localStorage.getItem(process.env.REACT_APP_USER_ACTIVE_RADC) || null,
  userId: localStorage.getItem(process.env.REACT_APP_USER_ID_RADC) || null,
  isLoggedIn: !!localStorage.getItem(process.env.REACT_APP_TOKEN_KEY_RADC),
};

export const counterSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      console.log(payload, "test");
      localStorage.setItem(process.env.REACT_APP_TOKEN_KEY_RADC, payload?.token);
      localStorage.setItem(process.env.REACT_APP_USER_ID_RADC, payload?.userId);
      localStorage.setItem(process.env.REACT_APP_USER_TYPE_RADC, payload?.role);
      localStorage.setItem(process.env.REACT_APP_USER_ACTIVE_RADC, payload?.active);
      state.token = payload?.token;
      state.isLoggedIn = true;
      state.user = payload?.user;
      state.userId = payload?.userId;
      state.role = payload?.role;
      state.active = payload?.active;
    },
    logout: (state) => {
      state.token = null;
      state.userType = null;
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem(process.env.REACT_APP_TOKEN_KEY_RADC);
      localStorage.removeItem(process.env.REACT_APP_USER_TYPE_RADC);
      localStorage.removeItem(process.env.REACT_APP_USER_ID_RADC);
      localStorage.removeItem(process.env.REACT_APP_USER_TYPE_RADC);
      localStorage.removeItem(process.env.REACT_APP_USER_ACTIVE_RADC);
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = counterSlice.actions;

export default counterSlice.reducer;
