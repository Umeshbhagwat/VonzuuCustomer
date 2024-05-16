import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
// Define the data type you expect to receive from the API
interface SearchDishesRestaData {
  // Define your data structure here
}


interface SeachDishesRestaState {
  products: SearchDishesRestaData[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchDishesRestaData = {
  products: [],
  loading: false,
  error: null,
};

// Create the local brands slice
const SearchDishesRestaSlice = createSlice({
  name: 'SearchDishesRestaData',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<SearchDishesRestaData[]>) => {
      state.products = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
 
});

export const { setData, setError } = SearchDishesRestaSlice.actions;
export default SearchDishesRestaSlice.reducer;
