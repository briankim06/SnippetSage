import { baseApi } from './baseApi';
import type { ExplainResponse, ExplainRequest, TranslateResponse, TranslateRequest } from '../types'


export const groqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        explain: builder.mutation<ExplainResponse, ExplainRequest> ({
            query: (explainData) => ({
                url: "/ai/explain",
                method: "POST",
                body: explainData
            })
        }),

        translate: builder.mutation<TranslateResponse, TranslateRequest> ({
            query: (translateData) => ({
                url: "/ai/translate",
                method: "POST",
                body: translateData
            })
        })
    })
})

export const { useExplainMutation, useTranslateMutation } = groqApi