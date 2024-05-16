import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

// Define the data type you expect to receive from the API
interface VendorSliderData {
  // Define your data structure here
}


interface VendorSliderState {
  products: VendorSliderData[];
  loading: boolean;
  error: string | null;
}

const initialState: VendorSliderState = {
  products: [],
  loading: false,
  error: null,
};

// Create the local brands slice
const VendorSliderSlice = createSlice({
  name: 'VendorSliderData',
  initialState,
  reducers: {
    setVenderSliderData: (state, action: PayloadAction<VendorSliderData[]>) => {
      state.products = action.payload;
    },
    setVenderSliderError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
 
});

export const { setVenderSliderData, setVenderSliderError } = VendorSliderSlice.actions;
export default VendorSliderSlice.reducer;
