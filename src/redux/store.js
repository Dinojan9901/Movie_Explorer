import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
