import { createSlice } from '@reduxjs/toolkit';

// Load favorites from localStorage if available
const getFavoritesFromStorage = () => {
  try {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites from storage:', error);
    return [];
  }
};

// Load theme preference from localStorage if available
const getThemeFromStorage = () => {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch (error) {
    console.error('Error loading theme from storage:', error);
    return 'light';
  }
};

// Load user data from localStorage if available
const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error loading user data from storage:', error);
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  isAuthenticated: !!getUserFromStorage(),
  favorites: getFavoritesFromStorage(),
  theme: getThemeFromStorage(),
  lastSearchQuery: localStorage.getItem('lastSearchQuery') || '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userData');
    },
    toggleFavorite: (state, action) => {
      const movieId = action.payload.id;
      const movieIndex = state.favorites.findIndex(movie => movie.id === movieId);
      
      if (movieIndex >= 0) {
        // Remove from favorites
        state.favorites = state.favorites.filter(movie => movie.id !== movieId);
      } else {
        // Add to favorites
        state.favorites.push(action.payload);
      }
      
      // Update localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    saveLastSearchQuery: (state, action) => {
      state.lastSearchQuery = action.payload;
      localStorage.setItem('lastSearchQuery', action.payload);
    },
  },
});

export const { login, logout, toggleFavorite, toggleTheme, saveLastSearchQuery } = userSlice.actions;

export const selectFavorites = (state) => state.user.favorites;
export const selectTheme = (state) => state.user.theme;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUser = (state) => state.user.user;
export const selectLastSearchQuery = (state) => state.user.lastSearchQuery;

export default userSlice.reducer;
