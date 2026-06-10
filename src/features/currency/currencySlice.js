import { createSlice } from "@reduxjs/toolkit";

export const CURRENCY_STORAGE_KEY = "app_currency";

const currencySlice = createSlice({
  name: "currency",
  initialState: { code: "XOF" },
  reducers: {
    setCurrency(state, action) {
      state.code = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(CURRENCY_STORAGE_KEY, action.payload);
      }
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export const selectCurrency = (state) => state.currency.code;
export default currencySlice.reducer;
