import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import notifyReducer from "./features/notificationSlice"
import selectionReducer from "./features/selectionsSlice"

export const store = configureStore({
  reducer: {
    notify: notifyReducer,
    selection: selectionReducer
  }
});

setupListeners(store.dispatch);
