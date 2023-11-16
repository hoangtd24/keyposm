import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type AreaItem = {
    id?: number,
    areaCode?: string,
    areaName: string,
    areaDescription: string,
    brandId?: number,
    campaignId?: number,
    total?: number,
    totalTransaction?: number,
    channelId?: number; 
    channelName?: string;
}

export type AreaState = {
    listTempArea: AreaItem[] | [];
    listAreaCampaign: AreaItem[] | [];
    listDropdownArea: AreaItem[] | [];
    loadingArea: boolean;
}

const initialState: AreaState = {
    listTempArea: [],
    listAreaCampaign: [],
    listDropdownArea: [],
    loadingArea: false,
}

const areaSlice = createSlice({
    name: "area",
    initialState,
    reducers: {
        setListAreaCampaign(state, action: PayloadAction<AreaItem[]>) {
            state.listAreaCampaign = action.payload;
        },
        setTempAreaData(state, action: PayloadAction<AreaItem[]>) {
            state.listTempArea = action.payload;
        },
        setAreaDropdownData(state, action: PayloadAction<AreaItem[]>) {
            state.listDropdownArea = action.payload;
        },
        setAreaLoading(state, action: PayloadAction<boolean>) {
            state.loadingArea = action.payload;
        },
    },
});

export const { setListAreaCampaign, setTempAreaData, setAreaDropdownData, setAreaLoading } = areaSlice.actions;
export default areaSlice.reducer;
