// store.js

import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
  FLUSH,
  PERSIST,
  PURGE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import rootReducer from "./reducers/rootReducer";

const persistConfig = {
  key: "root",
  storage,
  blacklist: [],
  whitelist: [REGISTER, REHYDRATE, FLUSH, PERSIST, PURGE, "course"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false }).concat([]);
  },
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export default store;
