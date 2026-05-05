import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getStatsAPI } from "../../services/api";

export const getStats = createAsyncThunk(
  "stats/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getStatsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to get stats");
    }
  }
);

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStats.pending, (state) => { state.loading = true; })
      .addCase(getStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default statsSlice.reducer;