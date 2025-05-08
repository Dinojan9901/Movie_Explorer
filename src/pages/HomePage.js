import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  useTheme
} from '@mui/material';
import { TrendingUp as TrendingIcon } from '@mui/icons-material';
import { fetchTrendingMovies } from '../redux/slices/moviesSlice';
import MovieGrid from '../components/movie/MovieGrid';

const HomePage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
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
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(https://image.tmdb.org/t/p/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.png)`,
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.6)',
          }}
        />
        <Grid container>
          <Grid item md={6}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
              }}
            >
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                Discover Your Favorite Films
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Browse trending movies, search for your favorites, and keep track of what you want to watch.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/trending"
                startIcon={<TrendingIcon />}
                size="large"
                sx={{ mt: 2 }}
              >
                Explore Trending Movies
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Featured Movies Section */}
      <MovieGrid
        title="Trending Movies"
        movies={movies.slice(0, 12)} // Show only first 12 movies on homepage
        loading={isLoading && movies.length === 0}
        error={error}
        hasMore={false} // No load more on home page, user can go to trending page
        emptyMessage="Loading trending movies..."
      />

      {/* CTA Section */}
      {movies.length > 0 && (
        <Box
          sx={{
            textAlign: 'center',
            my: 5,
            p: 3,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Want to explore more movies?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/trending"
            size="large"
            sx={{ mt: 2 }}
          >
            View All Trending Movies
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
