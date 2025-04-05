import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allEvents: [],
};

const EventSlice = createSlice({
  name: "allEvents",
  initialState,
  reducers: {
    includeInAllEvents: (state, action) => {
      const newEvents = action.payload.filter(
        (newEvent) =>
          !state.allEvents.some((existingEvent) => existingEvent._id === newEvent._id)
      );
      state.allEvents = [ ...state.allEvents,...newEvents];
    },
    includeEvent: (state,action) => {
      state.allEvents = [...state.allEvents,...action.payload]
    }
  },
});

export const { includeInAllEvents, includeEvent } = EventSlice.actions;
export default EventSlice.reducer;
