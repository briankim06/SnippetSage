import { baseApi } from './baseApi';
import { loginSuccess, setError, setLoading } from '../authSlice';
import type { LoginResponse, RegisterResponse, SafeUser, LoginCredentials, RegisterCredentials, RefreshTokenResponse } from '../types';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Login: update token, user info,
        login: builder.mutation<LoginResponse, LoginCredentials>({
            query: (credentials) => ({url: "/auth/login", method: "POST", body: credentials}),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                // Set loading to true, then try catch
                dispatch(setLoading(true))
                try {
                    const { data } = await queryFulfilled;
                    dispatch(loginSuccess({token: data.token, user: data.user}))
                } catch (error: any) {
                    dispatch(setError(error?.error?.data?.message ?? 'Login failed'))
                } finally {
                    dispatch(setLoading(false))
                }
            }
        }),
        // Register 
       register: builder.mutation<RegisterResponse, RegisterCredentials>({
        query: (credentials) => ({url: "/auth/register", method: "POST", body: credentials})}),

        // get user info endpoint
        getUserInfo: builder.query<SafeUser, void>({
            query: () => ({url: "/auth/me"}),
        }),

        //refresh token 
        refreshToken: builder.mutation<RefreshTokenResponse, void>({
            query: () => ({url: "/auth/refresh", method: "POST", credentials: "include"}),
        })
    })
})