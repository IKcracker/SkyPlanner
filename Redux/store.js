import weatherReducer from './weather/weather';
import {configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import activityReducer from './activities/activities';
const store = configureStore({
    reducer:{
        weather:weatherReducer, 
        user: userReducer,
        activities: activityReducer
    }
})

export default store