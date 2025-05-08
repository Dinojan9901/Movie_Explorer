import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrendingMovies, searchMovies, getMovieDetails, getMoviesByGenre } from '../../services/tmdbApi';

// Async thunks
export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async (page = 1, { rejectWithValue }) => {
    try {
      return await getTrendingMovies(page);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSearchResults = createAsyncThunk(
  'movies/fetchSearchResults',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      return await searchMovies(query, page);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (movieId, { rejectWithValue }) => {
    try {
      return await getMovieDetails(movieId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMoviesByGenre = createAsyncThunk(
  'movies/fetchMoviesByGenre',
  async ({ genreId, page = 1 }, { rejectWithValue }) => {
    try {
      return await getMoviesByGenre(genreId, page);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  trending: {
    movies: [],
    page: 1,
    totalPages: 0,
    status: 'idle',
    error: null,
  },
  search: {
    query: '',
    movies: [],
    page: 1,
    totalPages: 0,
    status: 'idle',
    error: null,
  },
  genreMovies: {
    currentGenre: null,
    movies: [],
    page: 1,
    totalPages: 0,
    status: 'idle',
    error: null,
  },
  movieDetails: {
    movie: null,
    status: 'idle',
    error: null,
  },
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
      // Reset search results when query changes
      if (state.search.query !== action.payload) {
        state.search.movies = [];
        state.search.page = 1;
      }
    },
    clearSearchResults: (state) => {
      state.search.movies = [];
      state.search.query = '';
      state.search.page = 1;
      state.search.totalPages = 0;
      state.search.status = 'idle';
      state.search.error = null;
    },
    resetMovieDetails: (state) => {
      state.movieDetails.movie = null;
      state.movieDetails.status = 'idle';
      state.movieDetails.error = null;
    },
  },
  extraReducers: (builder) => {
    // Trending movies reducers
    builder
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.trending.status = 'loading';
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.trending.status = 'succeeded';
        state.trending.page = action.payload.page;
        state.trending.totalPages = action.payload.total_pages;
        
        // Append new results for infinite scrolling
        if (action.payload.page > 1) {
          state.trending.movies = [...state.trending.movies, ...action.payload.results];
        } else {
          state.trending.movies = action.payload.results;
        }
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.trending.status = 'failed';
        state.trending.error = action.payload || 'Failed to fetch trending movies';
      });

    // Search results reducers
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.search.status = 'loading';
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.search.status = 'succeeded';
        state.search.page = action.payload.page;
        state.search.totalPages = action.payload.total_pages;
        
        // Append new results for infinite scrolling
        if (action.payload.page > 1) {
          state.search.movies = [...state.search.movies, ...action.payload.results];
        } else {
          state.search.movies = action.payload.results;
        }
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.search.status = 'failed';
        state.search.error = action.payload || 'Failed to fetch search results';
      });

    // Movie details reducers
    builder
      .addCase(fetchMovieDetails.pending, (state) => {
        state.movieDetails.status = 'loading';
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.movieDetails.status = 'succeeded';
        state.movieDetails.movie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.movieDetails.status = 'failed';
        state.movieDetails.error = action.payload || 'Failed to fetch movie details';
      });

    // Genre movies reducers
    builder
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.genreMovies.status = 'loading';
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.genreMovies.status = 'succeeded';
        state.genreMovies.page = action.payload.page;
        state.genreMovies.totalPages = action.payload.total_pages;
        state.genreMovies.currentGenre = action.meta.arg.genreId;
        
        // Append new results for infinite scrolling
        if (action.payload.page > 1 && state.genreMovies.currentGenre === action.meta.arg.genreId) {
          state.genreMovies.movies = [...state.genreMovies.movies, ...action.payload.results];
        } else {
          state.genreMovies.movies = action.payload.results;
        }
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        state.genreMovies.status = 'failed';
        state.genreMovies.error = action.payload || 'Failed to fetch movies by genre';
      });
  },
});

export const { setSearchQuery, clearSearchResults, resetMovieDetails } = moviesSlice.actions;

export default moviesSlice.reducer;
