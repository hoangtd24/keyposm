import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type RoleItem = {
    id: number,
    roleName: string,
}

export type RoleState = {
    dataRole: RoleItem[] | [];
    loadingRole?: boolean;
}

const initialState: RoleState = {
    dataRole: [],
    loadingRole: false,
}

const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        setRoleData(state, action: PayloadAction<RoleItem[]>) {
            state.dataRole = action.payload;
        },
        setRoleLoading(state, action: PayloadAction<boolean>) {
            state.loadingRole = action.payload;
        },
    },
});

export const { setRoleData, setRoleLoading } = roleSlice.actions;
export default roleSlice.reducer;
