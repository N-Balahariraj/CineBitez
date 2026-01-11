import { createSlice } from "@reduxjs/toolkit";

const initialSelectionState = {
  selectedMovie: null,
  selectedTheatre: null,
  bookingSelection: null
};

const selectionSlice = createSlice({
  name: "Selection",
  initialState: initialSelectionState,
  reducers: {
    setSelectedMovie(state, action) {
      state.selectedMovie = action.payload;
    },
    setSelectedTheatre(state, action) {
      state.selectedTheatre = action.payload;
    },
    setBookingSelection(state, action) {
      state.bookingSelection = action.payload;
    },
    clearBookingSelection(state) {
      state.bookingSelection = null;
    },
  },
});

export const selectionActions = selectionSlice.actions;
export default selectionSlice.reducer;
