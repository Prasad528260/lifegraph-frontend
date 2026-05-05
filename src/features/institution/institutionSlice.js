import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getInstitutionsAPI, addInstitutionAPI, getInstitutionByIdAPI } from "../../services/api";

export const getInstitutions = createAsyncThunk(
  "institution/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getInstitutionsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to get institutions");
    }
  }
);

export const addInstitution = createAsyncThunk(
  "institution/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addInstitutionAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add institution");
    }
  }
);

export const getInstitutionById = createAsyncThunk(
  "institution/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getInstitutionByIdAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to get institution");
    }
  }
);

const institutionSlice = createSlice({
  name: "institution",
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInstitutions.pending, (state) => { state.loading = true; })
      .addCase(getInstitutions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(getInstitutions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addInstitution.pending, (state) => { state.loading = true; })
      .addCase(addInstitution.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload.data);
      })
      .addCase(addInstitution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getInstitutionById.fulfilled, (state, action) => {
        state.selected = action.payload.data;
      });
  },
});

export default institutionSlice.reducer;