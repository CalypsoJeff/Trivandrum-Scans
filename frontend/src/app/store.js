import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import adminReducer from "../features/admin/adminSlice";
import cartReducer from "../features/cart/cartSlice";
import bookingReducer from "../features/booking/bookingSlice";
import chatReducer from "../features/chat/chatSlice";
const authPersistConfig = {
  key: "auth",
  storage,
};

const adminPersistConfig = {
  key: "admin",
  storage,
};
const cartPersistConfig = {
  key: "cart",
  storage,
};
const bookingPersistConfig = {
  key: "booking",
  storage,
};
const chatPersistConfig = {
  key: "chat",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedBookingReducer = persistReducer(
  bookingPersistConfig,
  bookingReducer
);
const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  admin: persistedAdminReducer,
  cart: persistedCartReducer,
  booking: persistedBookingReducer,
  chat: persistedChatReducer,
});
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
