import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

interface LatLongSliceData {
  // Define your data structure here
}

interface PandDlatLongSliceState {
  userLatLong: LatLongSliceData[];
  loading: boolean;
  error: string | null;
}

const initialState: PandDlatLongSliceState = {
  userLatLong: [],
  loading: false,
  error: null,
};

const pickUpSlice = createSlice({
  name: 'LatLongData',
  initialState,
  reducers: {
    setLatLongData: (state, action: PayloadAction<LatLongSliceData[]>) => {
      state.userLatLong = action.payload;
      state.loading = false; // Assuming that setting data also means loading is complete
      state.error = null; // Clear any previous errors when new data is set
    },
    setLatLongError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false; // Set loading to false when an error occurs
    },
    clearData: (state) => {
      state.userLatLong = [];
      state.error = null;
    },
  },
});

export const { setLatLongData, setLatLongError, clearData } = pickUpSlice.actions;
export default pickUpSlice.reducer;
