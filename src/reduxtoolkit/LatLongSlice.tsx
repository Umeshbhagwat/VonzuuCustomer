import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

// Define the data type you expect to receive from the API
interface LatLongSliceData{
  // Define your data structure here
}


interface LatLongSliceState {
  userLatLong: LatLongSliceData[];
  loading: boolean;
  error: string | null;
}

const initialState: LatLongSliceState = {
    userLatLong: [],
  loading: false,
  error: null,
};

// Create the local brands slice
const LatLongSlice = createSlice({
  name: 'LatLongData',
  initialState,
  reducers: {
    setLatLongData: (state, action: PayloadAction<LatLongSliceData[]>) => {
      state.userLatLong = action.payload;
    },
    setLatLongError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearData: (state) => {
        state.userLatLong = [];
        state.error = null;
      },
  },
 
});

export const { setLatLongData, setLatLongError,clearData} = LatLongSlice.actions;
export default LatLongSlice.reducer;
