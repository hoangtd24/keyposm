import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type BrandItem = {
    id: number,
    brandName: string,
    brandLogo: string,
}

export type RoleState = {
    dataBrand: BrandItem[] | [];
    loadingBrand?: boolean;
}

const initialState: RoleState = {
    dataBrand: [],
    loadingBrand: false,
}

const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {
        setBrandData(state, action: PayloadAction<any>) {
            state.dataBrand = action.payload;
        },
        setBrandLoading(state, action: PayloadAction<boolean>) {
            state.loadingBrand = action.payload;
        },
    },
});

export const { setBrandData, setBrandLoading } = brandSlice.actions;
export default brandSlice.reducer;
