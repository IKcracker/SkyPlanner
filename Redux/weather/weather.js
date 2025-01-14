import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initial ={
    respond:null,
    error:null,
    status:'idle'
}

export const getCurrentWeather = createAsyncThunk('weather/CurrentWeather' , async (location , {rejectWithValue})=>{
    try{
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=7c8b8e3d1b7a4c4c8e7122952210207&q=${location}`);
        const data = await response.data;
        return data;
    }
    catch(error){
        if(error.respond && error.respond.data){
            return rejectWithValue(error.respond.data);
        }
        else if(error.request){
            return rejectWithValue({message:'No internet connection'});
        }
        else{
            return rejectWithValue({message: error && 'Something went wrong'});
        }
    }
    
})

export const getForecastWeather = createAsyncThunk('weather/forecastWeather' , async (location , {rejectWithValue})=>{
    try{
    const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=7c8b8e3d1b7a4c4c8e7122952210207&q=${location}`);
    const data = await response.data;
    return data;
    }
    catch(error){
            if(error.respond && error.respond.data){
                return rejectWithValue(error.respond.data);
            }
            else if(error.request){
                return rejectWithValue({message:'No internet connection'});
            }
            else{
                return rejectWithValue({message: error && 'Something went wrong'});
            }
    }

})

const weatherSlice = createSlice({
    name:'weather',
    initialState:initial,
    reducers:{
        restartState:(state)=>{state = intial}
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getCurrentWeather.pending , (state)=>{
            restartState(state);
            state.status = 'loading';
        })
        .addCase(getCurrentWeather.fulfilled , (state , action)=>{
            restartState(state);
            state.respond = action.payload;
            state.status = 'succeeded';
        })
        .addCase(getCurrentWeather.rejected , (state , action)=>{
            restartState(state);
            state.error = action.payload;
            state.status = 'failed';
        })
        .addCase(getForecastWeather.pending , (state)=>{
            restartState(state);
            state.status = 'loading';
        })
        .addCase(getForecastWeather.fulfilled , (state , action)=>{
            restartState(state);
            state.respond = action.payload;
            state.status = 'succeeded';
        })
        .addCase(getForecastWeather.rejected , (state , action)=>{
            restartState(state);
            state.error = action.payload;
            state.status = 'failed';
        })

    }
})
export const {restartState} = weatherSlice.actions;
export default weatherSlice.reducer;