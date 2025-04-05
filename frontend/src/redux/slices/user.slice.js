import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  first:true
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.first = false
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.first = false
      state.user = null;
    },
    update:(state,action)=>{
      state.user = action.payload
    },
    includePosts:(state,action)=>{
      state.user.posts = action.payload
    },
    addPost:(state,action)=>{
      state.user.posts.push(action.payload)
    },
    deletePost:(state,action)=>{
      state.user.posts = state.user.posts.filter((post)=>post._id!==action.payload);
    }
  },
});

export const { login, logout, update, includePosts, addPost, deletePost } = userSlice.actions;
export default userSlice.reducer;