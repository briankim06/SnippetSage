import { baseApi } from "./baseApi";
import type { UserSnippet, SearchQueryParams, CreateSnippetData, UpdateSnippetData } from "../types";

export const snippetApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Get all Snippets Input: userId, queryParams, Output: Snippet[]
        // 1. Call /snippets endpoint with query params
        // 2. return the data
        getSnippets: builder.query<{snippets: UserSnippet[], totalCount: number}, SearchQueryParams>({
            query: (queryParams) => ({url: "/snippets/search", method: "GET", params: queryParams}),
            providesTags: (res) =>
                res ? [...res.snippets.map((s) => ({type: "Snippet" as const, id: s._id})),
                    { type: "Snippet", id: "LIST"},
                ]
                : [{type: "Snippet", id: "LIST"}]

        }),

        //Get One Snippet Input: userId, SnippetId Output: UserSnippt
        getOneSnippet: builder.query<UserSnippet, {snippetId: string}>({
            query: ({ snippetId }) => ({url: `/snippets/${snippetId}`, method: "GET"}),
        }),

        // Create Snippet Input: userId, title, code Output: void
        createSnippet: builder.mutation<UserSnippet, CreateSnippetData>({
            query: (snippetData) => ({url: "/snippets", method: "POST", body: snippetData}),
            invalidatesTags: [{type: "Snippet", id: "LIST"}],
            async onQueryStarted(newData, {dispatch, queryFulfilled}) {
                const patch = dispatch(
                    snippetApi.util.updateQueryData(
                        "getSnippets", 
                        {q: '', page: 1, tag: ''},
                        (draft) => {
                            draft.snippets.unshift({...newData, _id: 'temp-id', createdAt: new Date(), updatedAt: new Date()} as UserSnippet);
                            draft.totalCount++;
                        }
                    )
                )
                try {
                    const { data: saved} = await queryFulfilled;
                    dispatch (
                        snippetApi.util.updateQueryData(
                            "getSnippets",
                            {q: "", page: 1, tag: ""},
                            (draft) => {
                                const i = draft.snippets.findIndex(s => s._id == 'temp-id');
                                if (i !== -1) {
                                    draft.snippets[i] = saved;
                                }
                            }
                        )
                    );
                } catch (error) {
                    patch.undo();
                }
            }
        }),

        // Update Snippet Input: userId, snippet data, snippet id, output: updated snippet
        updateSnippet: builder.mutation<UserSnippet, UpdateSnippetData>({
            query: ({id, ...patch}) => ({url: `/snippets/${id}`, method: "PATCH", body: patch}),    
        }),

        // Delete Snippet Input: userId, snippet id, output: void
        deleteSnippet: builder.mutation<void, {snippetId: string}>({
            query: ({snippetId}) => ({url: `/snippets/${snippetId}`, method: "DELETE"})
        }),
    
    }),
})

export const { useGetSnippetsQuery, useGetOneSnippetQuery, useCreateSnippetMutation, useUpdateSnippetMutation, useDeleteSnippetMutation } = snippetApi;