import { configureStore } from '@reduxjs/toolkit';
import masterReducer from "./features/MasterSlice"
import userReducer from "./features/UserSlice"

export const store = configureStore({
  reducer: {
    master: masterReducer,
    user: userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>