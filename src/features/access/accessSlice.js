import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { requestAccessAPI } from "../../services/api";

export const requestAccess = createAsyncThunk(
  "access/request",
  async (data, { rejectWithValue }) => {
    try {
      const res = await requestAccessAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Access request failed");
    }
  }
);

const accessSlice = createSlice({
  name: "access",
  initialState: {
    result: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearResult: (state) => {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestAccess.pending, (state) => {
        state.loading = true;
        state.result = null;
        state.error = null;
      })
      .addCase(requestAccess.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(requestAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearResult } = accessSlice.actions;
export default accessSlice.reducer;