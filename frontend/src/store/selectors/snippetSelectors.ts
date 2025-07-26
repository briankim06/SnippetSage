import type { RootState } from "@/store/store";

export const selectDraft = (state: RootState) => state.snippet.sandbox.draft
export const selectIsSaving = (state: RootState) => state.snippet.sandbox.isSaving;
export const selectError = (state: RootState) => state.snippet.sandbox.error;
export const selectList = (state: RootState) => state.snippet.list;
export const selectEditBuffers = (state: RootState) => state.snippet.editBuffers;

