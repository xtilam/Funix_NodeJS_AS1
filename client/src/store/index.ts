import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { authSlice } from "./auth-slice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export const useAppSelector: <T>(
  callback: (storeObject: ReturnType<typeof store.getState>) => T
) => T = useSelector;
