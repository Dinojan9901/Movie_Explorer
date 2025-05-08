import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box } from '@mui/material';
import { fetchTrendingMovies } from '../redux/slices/moviesSlice';
import MovieGrid from '../components/movie/MovieGrid';

const TrendingPage = () => {
  const dispatch = useDispatch();
  
  const { movies, status, error, page, totalPages } = useSelector(
    (state) => state.movies.trending
  );
  
  const isLoading = status === 'loading';
  const hasMore = page < totalPages;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTrendingMovies());
    }
  }, [dispatch, status]);

  const handleLoadMore = (nextPage) => {
    dispatch(fetchTrendingMovies(nextPage));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Trending Movies
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Discover the most popular movies this week according to The Movie Database.
        </Typography>
        
        <MovieGrid
          movies={movies}
          loading={isLoading}
          error={error}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          emptyMessage="No trending movies found at the moment. Please check back later."
        />
      </Box>
    </Container>
  );
};

export default TrendingPage;
