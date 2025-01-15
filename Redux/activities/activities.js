import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // Ensure axios is imported

const initial = {
  response: null,
  error: null,
  status: "idle",
};

export const getActions = createAsyncThunk(
  "activities/getActivities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://skyplanner-api-1.onrender.com/api/activities"
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: "Something went wrong" });
      }
    }
  }
);

const activitiesSlice = createSlice({
  name: "activities",
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getActions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getActions.fulfilled, (state, action) => {
        state.status = "success";
        state.response = action.payload;
      })
      .addCase(getActions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default activitiesSlice.reducer;
