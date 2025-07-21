import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { baseApi } from './slices/api/baseApi'


const store = configureStore({
    reducer: {
        auth: authReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});


export default store;
export type AppDispatch = typeof store.dispatch