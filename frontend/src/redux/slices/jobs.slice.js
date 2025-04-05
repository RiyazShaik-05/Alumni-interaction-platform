import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allJobs: [],
};

const JobSlice = createSlice({
  name: "allJobs",
  initialState,
  reducers: {
    includeInAllJobs: (state, action) => {
      const newJobs = action.payload.filter(
        (newJob) =>
          !state.allJobs.some((existingJob) => existingJob._id === newJob._id)
      );
      state.allJobs = [ ...state.allJobs,...newJobs];
    },
    includeJob: (state,action) => {
      state.allJobs = [...state.allJobs,...action.payload]
    }
  },
});

export const { includeInAllJobs, includeJob } = JobSlice.actions;
export default JobSlice.reducer;
