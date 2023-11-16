import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type TicketStatusItem = {
    id: number,
    statusName: string,
}

export type TicketStatusState = {
    dataTicketStatus: TicketStatusItem[] | [];
    loadingTicketStatus?: boolean;
}

const initialState: TicketStatusState = {
    dataTicketStatus: [],
    loadingTicketStatus: false,
}

const ticketStatusSlice = createSlice({
    name: "ticketStatus",
    initialState,
    reducers: {
        setTicketStatusData(state, action: PayloadAction<any>) {
            state.dataTicketStatus = action.payload;
        },
        setTicketStatusLoading(state, action: PayloadAction<boolean>) {
            state.loadingTicketStatus = action.payload;
        },
    },
});

export const { setTicketStatusData, setTicketStatusLoading } = ticketStatusSlice.actions;
export default ticketStatusSlice.reducer;
