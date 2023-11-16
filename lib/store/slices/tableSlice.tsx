import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type TableState = {
    data: any | [];
    loading?: boolean;
    timestamp?: number;
    pageIndex?: number;
    pageSize?: number;
    pagesCount?: number;
}

const initialState: TableState = {
    data: [],
    loading: false,
    timestamp: 0,
    pageIndex: 0,
    pageSize: 50,
    pagesCount: 0,
}

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        setTableData(state, action: PayloadAction<any>) {
            state.data = action.payload;
        },
        setTableLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setTableTimeStamp(state, action: PayloadAction<number>) {
            state.timestamp = action.payload;
        },
        setTablePageIndex(state, action: PayloadAction<number>) {
            state.pageIndex = action.payload;
        },
        setTablePageSize(state, action: PayloadAction<number>) {
            state.pageSize = action.payload;
        },
        setTablePageCount(state, action: PayloadAction<number>) {
            state.pagesCount = action.payload;
        }
    },
});

export const { 
    setTableData, 
    setTableLoading, 
    setTableTimeStamp, 
    setTablePageIndex, 
    setTablePageSize,
    setTablePageCount 
} = tableSlice.actions;

export default tableSlice.reducer;
