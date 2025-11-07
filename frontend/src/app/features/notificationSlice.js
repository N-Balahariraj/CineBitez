import { createSlice } from "@reduxjs/toolkit";

const initialNotificationState = {
  head: "",
  message: "",
  type: "",
};

const notificationSlice = createSlice({
  name: "Notification",
  initialState: initialNotificationState,
  reducers: {
    openModel(state, action) {
      const { head = "", message = "", type = "" } = action.payload || {};
      state.head = head;
      state.message = message;
      state.type = type;
    },
    closeModal(state) {
      state.head = "";
      state.message = "";
      state.type = "";
    },
  },
});

export const notifyActions = notificationSlice.actions;
export default notificationSlice.reducer;
