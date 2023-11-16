import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type MenuState = {
    collapsed: boolean;
}

const initialState: MenuState = {
    collapsed: false,
}

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setMenuCollapsed(state, action: PayloadAction<boolean>) {
            state.collapsed = action.payload;
        },
    },
});

export const { setMenuCollapsed } = menuSlice.actions;
export default menuSlice.reducer;
