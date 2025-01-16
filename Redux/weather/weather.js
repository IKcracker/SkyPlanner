import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initial = {
  response: null,
  error: null,
  status: "idle",
  searchedLocation: "",
};

export const getCurrentWeather = createAsyncThunk(
  "weather/CurrentWeather",
  async (location, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=9b3693377e2f41f0b31103324251401&q=${location}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({ message: "No internet connection" });
      } else {
        return rejectWithValue({ message: "Something went wrong" });
      }
    }
  }
);

export const getForecastWeather = createAsyncThunk(
  "weather/forecastWeather",
  async (location, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=9b3693377e2f41f0b31103324251401&q=${location}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({ message: "No internet connection" });
      } else {
        return rejectWithValue({ message: "Something went wrong" });
      }
    }
  }
);
export const getForecastDays = createAsyncThunk(
  "weather/getForecastDays",
  async (location, { rejectWithValue }) => {
    try {
        console.log(location)
      const response = await axios.get(
        `https://skyplanner-api-1.onrender.com/api/weather/forecast?city=${location}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({ message: "No internet connection" });
      } else {
        return rejectWithValue({ message: "Something went wrong" });
      }
    }
  }
);


const weatherSlice = createSlice({
  name: "weather",
  initialState: initial,
  reducers: {
    restartState: (state) => {
      state.response = null;
      state.error = null;
      state.status = "idle";
      state.searchedLocation = ""; 
    },
    setSearchedLocation: (state, action) => {
      state.searchedLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentWeather.pending, (state) => {
        state.response = null;
        state.error = null;
        state.status = "loading";
      })
      .addCase(getCurrentWeather.fulfilled, (state, action) => {
        state.response = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getCurrentWeather.rejected, (state, action) => {
        state.response = null;
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(getForecastWeather.pending, (state) => {
        state.response = null;
        state.error = null;
        state.status = "loading";
      })
      .addCase(getForecastWeather.fulfilled, (state, action) => {
        state.response = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getForecastWeather.rejected, (state, action) => {
        state.response = null;
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(getForecastDays.pending, (state) => {
        state.response = null;
        state.error = null;
        state.status = "loading";
      })
      .addCase(getForecastDays.fulfilled, (state, action) => {
        state.response = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getForecastDays.rejected, (state, action) => {
        state.response = null;
        state.error = action.payload;
        state.status = "failed";
      });
  },
});


export const { restartState, setSearchedLocation  } = weatherSlice.actions;
export default weatherSlice.reducer;
