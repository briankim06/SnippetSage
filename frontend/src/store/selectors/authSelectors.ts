import type { RootState } from '../slices/types'

export const selectIsAuth = (state: RootState) => (!!state.auth.token);
export const selectToken = (state: RootState) => (state.auth.token);
export const selectAuthIsLoading = (state: RootState) => (state.auth.isLoading);
export const selectAuthError = (state: RootState) => (state.auth.error);
export const selectUser = (state: RootState) => (state.auth.user);

