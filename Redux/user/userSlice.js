import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const initial = {
  response: null,
  error: null,
  status: "idle",
};

const getToken = () => {
  return SecureStore.getItem("token");
};

export const login = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://skyplanner-api-1.onrender.com/api/users/login",
        data
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

export const register = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://skyplanner-api-1.onrender.com/api/users/register",
        data
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

export const getUser = createAsyncThunk(
  "user/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.get(
        "https://skyplanner-api-1.onrender.com/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
export const addFavorates = createAsyncThunk(
  "user/addFavorite",
  async (data, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.post(
        "https://skyplanner-api-1.onrender.com/api/users/favorites",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
const userSlice = createSlice({
  name: "user",
  initialState: initial,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      return initial;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.response = action.payload;
        state.status = "succeeded";
        saveToken(action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.response = action.payload;
        state.status = "succeeded";
        saveToken(action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(getUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.response = action.payload;
        state.status = "succeeded";
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(addFavorates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addFavorates.fulfilled, (state, action) => {
        state.response = action.payload;
        state.status = "succeeded";
      })
      .addCase(addFavorates.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
