import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTrustAPI, addTrustEventAPI } from "../../services/api";

export const getTrust = createAsyncThunk(
  "trust/get",
  async (institutionId, { rejectWithValue }) => {
    try {
      const res = await getTrustAPI(institutionId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to get trust");
    }
  }
);

export const addTrustEvent = createAsyncThunk(
  "trust/addEvent",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addTrustEventAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add event");
    }
  }
);

const trustSlice = createSlice({
  name: "trust",
  initialState: {
    data: null,
    history: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTrust.pending, (state) => { state.loading = true; })
      .addCase(getTrust.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.history = action.payload.data.history;
      })
      .addCase(getTrust.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addTrustEvent.pending, (state) => { state.loading = true; })
      .addCase(addTrustEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.history.unshift(action.payload.data.event);
      })
      .addCase(addTrustEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default trustSlice.reducer;