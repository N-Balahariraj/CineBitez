import { createSlice } from "@reduxjs/toolkit";

const initialNotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "Notification",
  initialState: initialNotificationState,
  reducers: {
    openModel(state, action) {
      state.notifications.push({
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    setNotifications(state, action) {
      // console.log("Setting the initialState of notifications...",action.payload);
      state.notifications = action.payload || [];
    },
    removeNotification(state, action) {
      state.notifications = state.notifications.filter(
        (notification) => notification.timestamp !== action.payload?.timestamp
      );
    },
    clearNotification(state) {
      state.notifications = [];
    },
  },
});

export const notifyActions = notificationSlice.actions;
export default notificationSlice.reducer;
