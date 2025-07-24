import { baseApi } from "./baseApi";
import type { UserSnippet, SearchQueryParams, CreateSnippetData, UpdateSnippetData } from "../types";

export const snippetApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Get all Snippets Input: userId, queryParams, Output: Snippet[]
        // 1. Call /snippets endpoint with query params
        // 2. return the data
        getSnippets: builder.query<{snippets: UserSnippet[], totalCount: number}, SearchQueryParams>({
            query: (queryParams) => ({url: "/snippets/search", method: "GET", params: queryParams}),
        }),

        //Get One Snippet Input: userId, SnippetId Output: UserSnippt
        getOneSnippet: builder.query<UserSnippet, {snippetId: string}>({
            query: ({ snippetId }) => ({url: `/snippets/${snippetId}`, method: "GET"}),
        }),

        // Create Snippet Input: userId, title, code Output: void
        createSnippet: builder.mutation<UserSnippet, CreateSnippetData>({
            query: (snippetData) => ({url: "/snippets", method: "POST", body: snippetData}),
        }),

        // Update Snippet Input: userId, snippet data, snippet id, output: updated snippet
        updateSnippet: builder.mutation<UserSnippet, UpdateSnippetData>({
            query: (snippetId, ...patch) => ({url: `/snippets/${snippetId}`, method: "PATCH", body: patch}),    
        }),

        // Delete Snippet Input: userId, snippet id, output: void
        deleteSnippet: builder.mutation<void, {snippetId: string}>({
            query: ({snippetId}) => ({url: `/snippets/${snippetId}`, method: "DELETE"})
        }),
    
    }),
})

export const { useGetSnippetsQuery, useGetOneSnippetQuery, useCreateSnippetMutation, useUpdateSnippetMutation, useDeleteSnippetMutation } = snippetApi;