import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCapsuleAPI, updateCapsuleAPI } from "../../services/api";

export const getCapsule = createAsyncThunk(
  "capsule/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCapsuleAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to get capsule");
    }
  }
);

export const updateCapsule = createAsyncThunk(
  "capsule/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateCapsuleAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update capsule");
    }
  }
);

const capsuleSlice = createSlice({
  name: "capsule",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCapsule.pending, (state) => { state.loading = true; })
      .addCase(getCapsule.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getCapsule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateCapsule.pending, (state) => { state.loading = true; })
      .addCase(updateCapsule.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(updateCapsule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default capsuleSlice.reducer;