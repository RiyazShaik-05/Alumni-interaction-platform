import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createIndexedDBStorage from "redux-persist-indexeddb-storage";
import userReducer from "../slices/user.slice.js";
import postsReducer from "../slices/posts.slice.js";
import jobsReducer from "../slices/jobs.slice.js";
import eventReducer from "../slices/events.slice.js";

const persistConfig = {
  key: "user",
  storage: createIndexedDBStorage("myReduxDB"),
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,  
    posts: postsReducer,         
    jobs: jobsReducer,
    events: eventReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
