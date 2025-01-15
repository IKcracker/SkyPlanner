import weatherReducer from './weather/weather';
import {configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice';

const store = configureStore({
    reducer:{
        weather:weatherReducer, 
        user: userReducer,
    }
})

export default store