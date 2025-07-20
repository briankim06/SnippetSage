import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../store"
import type { FetchArgs, BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { setToken, logoutSuccess } from '../authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5001/api",
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

const mutex = new Mutex();

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs, 
    unknown, 
    FetchBaseQueryError
    > = async (args, api, extra) => {
        // Wait for any requests to finish
        await mutex.waitForUnlock()

        // Try to baseQuery as normal
        let result = await baseQuery(args, api, extra)

        // Is token valid? If not, run this. (401 unauthorized)
        if (result.error?.status === 401) {
            // If this is the first req:
            if (!mutex.isLocked()) {
                // Lock this resource
                const release = await mutex.acquire();

                // Then call backend to issue a new token
                try {
                    const refresh = await baseQuery({url: "/auth/refresh", method: "POST"}, api, extra);

                    // if successful, set token to new token
                    if (refresh && (refresh.data as any).token) {
                        api.dispatch(setToken((refresh.data as any).token))
                        result = await baseQuery(args, api, extra);
                    } else {

                        // refresh failed, log the user out
                        api.dispatch(logoutSuccess());
                    }
                } finally {
                    release();
                } 
            } else {
                await mutex.waitForUnlock();
                result = await baseQuery(args, api, extra)
            }
        }

        return result;
    }






export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({})
});