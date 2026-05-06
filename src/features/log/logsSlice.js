import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllLogsAPI, getUserLogsAPI, getInstitutionLogsAPI } from "../../services/api";

export const getAllLogs = createAsyncThunk(
  "logs/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllLogsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to get logs");
    }
  }
);

export const getUserLogs = createAsyncThunk(
  "logs/getUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getUserLogsAPI(userId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to get logs");
    }
  }
);

export const getInstitutionLogs = createAsyncThunk(
  "logs/getInstitution",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getInstitutionLogsAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to get logs");
    }
  }
);

const logsSlice = createSlice({
  name: "logs",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllLogs.pending, (state) => { state.loading = true; })
      .addCase(getAllLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(getAllLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getUserLogs.pending, (state) => { state.loading = true; })
      .addCase(getUserLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(getUserLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getInstitutionLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      });
  },
});

export default logsSlice.reducer;