import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

// Define the data type you expect to receive from the API
interface LocalBrandData {
  // Define your data structure here
}


interface LocalBrandsState {
  products: LocalBrandData[];
  loading: boolean;
  error: string | null;
}

const initialState: LocalBrandsState = {
  products: [],
  loading: false,
  error: null,
};

// Create the local brands slice
const localBrandsSlice = createSlice({
  name: 'localData',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<LocalBrandData[]>) => {
      state.products = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearData: (state) => {
      state.products = [];
      state.error = null;
    },
  },
 
});

export const { setData, setError,clearData } = localBrandsSlice.actions;
export default localBrandsSlice.reducer;
