import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import authSlice from './slices/authSlice';
import roleSlice from './slices/roleSlice';
import brandSlice from './slices/brandSlice';
import campaignSlice from './slices/campaignSlice';
import tableSlice from './slices/tableSlice';
import provinceSlice from './slices/provinceSlice';
import districtSlice from './slices/districtSlice';
import channelSlice from './slices/channelSlice';
import areaSlice from './slices/areaSlice';
import menuSlice from './slices/menuSlice';
import typeDefaultSlice from './slices/typeDefaultSlice';
import ticketStatusSlice from './slices/ticketStatusSlice';

const rootReducer = combineReducers({
    auth: authSlice,
    table: tableSlice,
    role: roleSlice,
    brand: brandSlice,
    province: provinceSlice,
    district: districtSlice,
    channel: channelSlice,
    area: areaSlice,
    campaign: campaignSlice,
    menu: menuSlice,
    typeDefault: typeDefaultSlice,
    ticketStatus: ticketStatusSlice,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;