import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ModelData } from "../shared/@types/Models";
import { storage } from "../storage/storage";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storage.auth.read(),
  },
  reducers: {
    login(state, { payload }: PayloadAction<ModelData.UserToken>) {
      state.user = payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const authActions = authSlice.actions;
