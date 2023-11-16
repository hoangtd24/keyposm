
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {
    access_token: string | null;
    refresh_token: string | null;
}

const initialState: AuthState = {
    access_token: null,
    refresh_token: null,
}

// const initialState = {
//     access_token: localStorage && localStorage.getItem(access_token) ? localStorage.getItem(access_token) : null,
//     refresh_token: localStorage && localStorage.getItem(refresh_token) ? localStorage.getItem(refresh_token) : null,
// }

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken(state, action: PayloadAction<string>) {
            state.access_token = action.payload;
        },
        setRefreshToken(state, action: PayloadAction<string>) {
            state.refresh_token = action.payload;
        },
        removeToken(state, actions) {
            state.access_token = null;
            state.refresh_token = null;
        },
    },
});

export const { setAccessToken, setRefreshToken, removeToken } = authSlice.actions;
export default authSlice.reducer;