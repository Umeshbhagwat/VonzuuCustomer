import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerIdState {
  customerId: string | null; // Assuming customerId is a string
}

const initialState: CustomerIdState = {
  customerId: null,
};

export const customerIdSlice = createSlice({
  name: "customerId",
  initialState,
  reducers: {
    setCustomerId: (state, action: PayloadAction<string>) => {
      state.customerId = action.payload;
    },
    clearCustomerId: (state) => {
      state.customerId = null;
    },
  },
});

export const { setCustomerId, clearCustomerId } = customerIdSlice.actions;

export default customerIdSlice.reducer;
