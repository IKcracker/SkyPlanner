import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initial = {
    response: null,
    error: null,
    status: "idle",
};

// Async thunk for fetching activities
export const getActions = createAsyncThunk(
    "activities/getActivities",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "https://skyplanner-api-1.onrender.com/api/activities"
            );
            return response.data; // Resolve with fetched data
        } catch (error) {
            if (error.response) {
                // Pass detailed error to rejectWithValue
                return rejectWithValue(error.response.data);
            } else {
                // Handle network errors or other issues
                return rejectWithValue({ message: "Something went wrong" });
            }
        }
    }
);

const activitiesSlice = createSlice({
    name: "activities",
    initialState: initial,
    reducers: {
        // Optional: Add reducers here (e.g., clearState)
    },
    extraReducers: (builder) => {
        builder
            .addCase(getActions.pending, (state) => {
                state.status = "loading"; // Set status to loading
            })
            .addCase(getActions.fulfilled, (state, action) => {
                state.status = "success"; // Set status to success
                state.response = action.payload; // Store fetched data
            })
            .addCase(getActions.rejected, (state, action) => {
                state.status = "failed"; // Set status to failed
                state.error = action.payload; // Store error message
            });
    },
});

export default activitiesSlice.reducer;
