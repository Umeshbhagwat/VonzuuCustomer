import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

// Define the data type you expect to receive from the API
interface CartData {
  // Define your data structure here
}
interface CartState {
  products: CartData[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  products: [],
  loading: false,
  error: null,
};

// Create the local brands slice
const CartSlice = createSlice({
  name: 'CartData',
  initialState,
  reducers: {
    setCartData: (state, action: PayloadAction<CartData[]>) => {
      state.products = action.payload;
    },
    setCartError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearCartData: (state) => {
      state.products= [];
      state.error = null;
    },
  },
 
});

export const { setCartData, setCartError,clearCartData} = CartSlice.actions;
export default CartSlice.reducer;
