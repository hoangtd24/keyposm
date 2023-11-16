import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type CampaignItem = {
    id: number,
    campaignName: string,
    brandId: number
}

export type CampaignTypeItem = {
    id: number,
    typeName: string,
    disabled?: boolean,
}

export type CampaignState = {
    dataCampaign: CampaignItem[] | [];
    dataCampaignType: CampaignTypeItem[] | [];
    loadingCampaign: boolean;
}

const initialState: CampaignState = {
    dataCampaign: [],
    dataCampaignType: [],
    loadingCampaign: false,
}

const campaignSlice = createSlice({
    name: "campaign",
    initialState,
    reducers: {
        setCampaignData(state, action: PayloadAction<CampaignItem[]>) {
            state.dataCampaign = action.payload;
        },
        setCampaignTypeData(state, action: PayloadAction<CampaignTypeItem[]>) {
            state.dataCampaignType = action.payload;
        },
        setCampaignLoading(state, action: PayloadAction<boolean>) {
            state.loadingCampaign = action.payload;
        },
    },
});

export const { setCampaignData, setCampaignTypeData, setCampaignLoading } = campaignSlice.actions;
export default campaignSlice.reducer;
