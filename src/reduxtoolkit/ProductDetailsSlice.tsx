import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

// Define the data type you expect to receive from the API
interface ProductDetailsData {
  // Define your data structure here
}


interface ProductDetailsState {
  products: ProductDetailsData[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductDetailsState = {
  products: [],
  loading: false,
  error: null,
};

// Create the local brands slice
const ProductDetailsSlice = createSlice({
  name: 'ProductDetailsData',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<ProductDetailsData[]>) => {
      state.products = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
 
});

export const { setData, setError } = ProductDetailsSlice.actions;
export default ProductDetailsSlice.reducer;
