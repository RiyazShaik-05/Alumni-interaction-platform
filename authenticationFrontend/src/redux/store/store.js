import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createIndexedDBStorage from "redux-persist-indexeddb-storage";
import userReducer from "../slices/user.slice.js";


const persistConfig = {
  key: "user",
  storage: createIndexedDBStorage("myReduxDB"),
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
