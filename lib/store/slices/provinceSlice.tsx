import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ProvinceItem = {
    code: string,
    provinceName: string,
    provinceNameLatin: string,
    disabled?: boolean,
}

export type ProvinceState = {
    dataProvince: ProvinceItem[] | [];
    loadingProvince?: boolean;
    selectedProvince?: string;
}

const initialState: ProvinceState = {
    dataProvince: [],
    loadingProvince: false,
    selectedProvince: "",
}

const provinceSlice = createSlice({
    name: "province",
    initialState,
    reducers: {
        setProvinceData(state, action: PayloadAction<ProvinceItem[]>) {
            state.dataProvince = action.payload;
        },
        setProvinceLoading(state, action: PayloadAction<boolean>) {
            state.loadingProvince = action.payload;
        },
        setSelectedProvince(state, action: PayloadAction<string>){
            state.selectedProvince = action.payload;
        }
    },
});

export const { setProvinceData, setProvinceLoading, setSelectedProvince } = provinceSlice.actions;
export default provinceSlice.reducer;
