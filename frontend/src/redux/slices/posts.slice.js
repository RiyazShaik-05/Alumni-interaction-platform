import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allPosts: []
};

const postSlice = createSlice({
    name: "allPosts",
    initialState,
    reducers: {
        includeInAllPosts: (state, action) => {
            const newPosts = action.payload.filter(newPost => 
              !state.allPosts.some(existingPost => 
                existingPost._id === newPost._id
              )
            );
            state.allPosts = [ ...newPosts,...state.allPosts];
          }
    }
});

export const { includeInAllPosts } = postSlice.actions;
export default postSlice.reducer;