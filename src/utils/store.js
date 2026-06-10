import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import authReducer from "../features/auth/authSlice";
import currencyReducer from "../features/currency/currencySlice";

const apis = [authApi];

export const store = configureStore({
  reducer: {
    auth: authReducer,
    currency: currencyReducer,
    ...Object.fromEntries(apis.map((api) => [api.reducerPath, api.reducer])),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apis.map((api) => api.middleware)),
});
