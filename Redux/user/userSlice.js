import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://skyplanner-api-1.onrender.com/api/users/login', { email, password });
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userName', user.name);
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Something went wrong');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('https://skyplanner-api-1.onrender.com/api/users/profile', {
        headers: {
          Authorization: token,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    userName: null,  
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.userName = null;  
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('userName');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.userName = action.payload.name;  
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
