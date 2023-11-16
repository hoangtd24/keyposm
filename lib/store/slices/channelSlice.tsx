import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ChannelItem = {
    id?: number | string,
    channelCode?: string,
    channelName: string,
    channelDescription: string,
    brandId?: number,
    campaignId?: number,
    total?: number,
    totalTransaction?: number,
}

export type ChannelState = {
    listChannelCampaign: ChannelItem[] | [];
    listTempChannel: ChannelItem[] | [];
    listDropdownChannel: ChannelItem[] | [];
    loadingChannel: boolean;
}

const initialState: ChannelState = {
    listChannelCampaign: [],
    listTempChannel: [],
    listDropdownChannel: [],
    loadingChannel: false,
}

const channelSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
        setListChannelCampaign(state, action: PayloadAction<ChannelItem[]>) {
            state.listChannelCampaign = action.payload;
        },
        setTempChannelData(state, action: PayloadAction<ChannelItem[]>) {
            state.listTempChannel = action.payload;
        },
        setDropdownChannelData(state, action: PayloadAction<ChannelItem[]>) {
            state.listDropdownChannel = action.payload;
        },
        setChannelLoading(state, action: PayloadAction<boolean>) {
            state.loadingChannel = action.payload;
        },
    },
});

export const { setTempChannelData, setChannelLoading, setListChannelCampaign, setDropdownChannelData } = channelSlice.actions;
export default channelSlice.reducer;
