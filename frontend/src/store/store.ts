import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { baseApi } from './slices/api/baseApi'
import snippetReducer from './slices/snippetSlice'


const store = configureStore({
    reducer: {
        auth: authReducer,
        [baseApi.reducerPath]: baseApi.reducer,
        snippet: snippetReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});


export default store;
export type AppDispatch = typeof store.dispatch