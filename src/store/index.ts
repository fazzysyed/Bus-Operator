// src/redux/store.ts
import {configureStore} from '@reduxjs/toolkit';
import locationReducer from './slices/locationSlice';
import userReducer from './slices/userSlice';
import languageReducer from './slices/languageSlice';

const store = configureStore({
  reducer: {
    location: locationReducer,
    user: userReducer,
    language: languageReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
