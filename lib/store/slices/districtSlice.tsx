import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type DistrictItem = {
    districtName: string,
    districtNameLatin: string,
    provinceCode: string,
    provinceName: string,
}

export type DistrictState = {
    dataDistrict: DistrictItem[] | [];
    loadingDistrict?: boolean;
}

const initialState: DistrictState = {
    dataDistrict: [],
    loadingDistrict: false,
}

const districtSlice = createSlice({
    name: "district",
    initialState,
    reducers: {
        setDistrictData(state, action: PayloadAction<DistrictItem[]>) {
            state.dataDistrict = action.payload;
        },
        setDistrictLoading(state, action: PayloadAction<boolean>) {
            state.loadingDistrict = action.payload;
        },
    },
});

export const { setDistrictData, setDistrictLoading } = districtSlice.actions;
export default districtSlice.reducer;
