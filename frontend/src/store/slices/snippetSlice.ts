import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SearchQueryParams } from "./types";

// Add a type for the frontend's in edit 
interface SnippetDraft {
    title: string;
    code: string;
    tags: string[];
    language: string;
    framework: string;
    summary: string;
}

// Add a type for the list of snippets that the homepage needs to display
interface ListState {
    filters: SearchQueryParams;
    SelectedIds: string[];
    lastOpenedId: string | null;
}

// Add a type for slice state
interface SnippetSliceState {
    list: ListState;
    sandbox: {
        draft: SnippetDraft;
        isSaving: boolean;
        error?: string;
    }

    editBuffers: Record<string, SnippetDraft>; // Holds a record of (id, snippetDraft)
}


// Helper for resetting the form, creating a new draft
const emptyDraft: SnippetDraft = {title: '', code: '', tags: [], language: '', framework: '', summary: ''};

const initialState: SnippetSliceState = {
    list: {
        filters: {q: '', tag: '', page: 1},
        SelectedIds: [],
        lastOpenedId: null
    },
    sandbox: {
        draft: emptyDraft,
        isSaving: false,
        error: undefined
    },
    editBuffers: {}
}

const snippetSlice = createSlice({
    name: 'snippet',
    initialState,
    reducers: {

        // Home page actions:
        setFilters: ( state, action: PayloadAction<SearchQueryParams>) => {
            state.list.filters = { ...state.list.filters, ...action.payload}
        },
        clearFilters: (state) => {
            state.list.filters = {q: '', tag: ''}
        },
        setSelectedIds: (state, action: PayloadAction<string[]>) => {
            state.list.SelectedIds = action.payload;
        },
        clearSelectedIds: (state) => {
            state.list.SelectedIds = [];
        },
        setLastOpenedId: (state, action: PayloadAction<string | null>) => {
            state.list.lastOpenedId = action.payload;
        },

        // Sandbox actions:
        setDraft: (state, action: PayloadAction<SnippetDraft>) => {
            state.sandbox.draft = action.payload;
        },
        clearDraft: (state) => {
            state.sandbox.draft = emptyDraft;
        },
        updateDraftField<K extends keyof SnippetDraft> (state: SnippetSliceState, action: PayloadAction<{field: K, value: SnippetDraft[K]}>) {
            const {field, value} = action.payload;
            state.sandbox.draft[field] = value;
        },
        addDraftTag: (state, action: PayloadAction<string>) => {
            if (!state.sandbox.draft.tags.includes(action.payload)) state.sandbox.draft.tags.push(action.payload);
        
        },
        removeDraftTag: (state, action: PayloadAction<string>) => {
            state.sandbox.draft.tags = state.sandbox.draft.tags.filter(
                (t) => t !== action.payload
            )
        },
        setDraftSaving(state, action: PayloadAction<boolean>) {
            state.sandbox.isSaving = action.payload
        },
        setDraftError(state, action: PayloadAction<string | undefined>) {
            state.sandbox.error = action.payload
        },


        // Edit buffer actions
        loadEditBuffer(state, action: PayloadAction<{ id: string; data: SnippetDraft }>) {
            state.editBuffers[action.payload.id] = action.payload.data
        },
        updateEditBufferField<K extends keyof SnippetDraft> (state: SnippetSliceState, action: PayloadAction<{id: string; field: K; value: SnippetDraft[K]}>) {
            const buf = state.editBuffers[action.payload.id]
            if (buf) buf[action.payload.field] = action.payload.value
        },
        addEditBufferTag(
            state,
            action: PayloadAction<{ id: string; tag: string }>) {
                const buf = state.editBuffers[action.payload.id]
                if (buf && !buf.tags.includes(action.payload.tag)) {
                    buf.tags.push(action.payload.tag)
                }
        },
        removeEditBufferTag(
            state, 
            action: PayloadAction<{id: string; tag: string }>
        ) {
            const buf = state.editBuffers[action.payload.id]
            if (buf) buf.tags = buf.tags.filter((t) => t !== action.payload.tag)
        },
        clearEditBuffer  (state, action: PayloadAction<string>) {
            delete state.editBuffers[action.payload]
        }
    },

}
)


//export everything

export const {
    setFilters, 
    clearFilters,
    setSelectedIds,
    clearSelectedIds,
    setLastOpenedId,

    // Sandbox actions:
    setDraft,
    clearDraft,
    updateDraftField,
    addDraftTag,
    removeDraftTag,
    setDraftSaving,
    setDraftError,

    // Edit page actions:
    loadEditBuffer,
    updateEditBufferField,
    addEditBufferTag,
    removeEditBufferTag,
    clearEditBuffer
} = snippetSlice.actions


export default snippetSlice.reducer;