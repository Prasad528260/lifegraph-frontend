import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGraphAPI } from "../../services/api";

export const getGraph = createAsyncThunk(
  "graph/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getGraphAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to get graph");
    }
  }
);

const graphSlice = createSlice({
  name: "graph",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGraph.pending, (state) => { state.loading = true; })
      .addCase(getGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default graphSlice.reducer;