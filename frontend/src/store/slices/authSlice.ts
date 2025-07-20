import { createSlice,  } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SafeUser } from './types'


interface AuthState {
    token: string | null;
    isLoading: boolean;
    error: string | null;
    user: SafeUser | null;
};

const initialState: AuthState = {
    token: null,
    isLoading: false,
    error: null,
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        setUser: (state, action: PayloadAction<SafeUser | null>) => {
            state.user = action.payload;
        },

        logoutSuccess: (state) => {
            state.token = null;
            state.isLoading = false;
            state.user = null;
            state.error = null;
        },

        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isLoading = false;
        }
    }
});

export const { setToken, setLoading, setError, setUser, logoutSuccess, loginSuccess
} = authSlice.actions
export default authSlice.reducer;