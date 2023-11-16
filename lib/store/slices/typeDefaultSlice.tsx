import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type TypeDefaultItem = {
    id?: number,
    tempId?: number,
    posmTypeName: string,
    posmTypeDescription: string,
    images?: String[],
    manualAdd?: boolean,
}

export type TypeDefaultState = {
    listTempPosm: TypeDefaultItem[] | [];
    listPosmCampaign: TypeDefaultItem[] | [];
    listDropdownPosm: TypeDefaultItem[] | [];
    loadingPosm: boolean;
}

const initialState: TypeDefaultState = {
    listTempPosm: [],
    listPosmCampaign: [],
    listDropdownPosm: [],
    loadingPosm: false,
}

const posmDefaultSlice = createSlice({
    name: "typeposm",
    initialState,
    reducers: {
        setListPosmCampaign(state, action: PayloadAction<TypeDefaultItem[]>) {
            state.listPosmCampaign = action.payload;
        },
        setTempPosmData(state, action: PayloadAction<TypeDefaultItem[]>) {
            state.listTempPosm = action.payload;
        },
        setPosmDropdownData(state, action: PayloadAction<TypeDefaultItem[]>) {
            state.listDropdownPosm = action.payload;
        },
        setPosmLoading(state, action: PayloadAction<boolean>) {
            state.loadingPosm = action.payload;
        },
    },
});

export const { setListPosmCampaign, setTempPosmData, setPosmDropdownData, setPosmLoading } = posmDefaultSlice.actions;
export default posmDefaultSlice.reducer;
