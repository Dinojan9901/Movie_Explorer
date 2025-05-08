import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MovieGrid from '../components/movie/MovieGrid';
import { selectFavorites, selectIsAuthenticated } from '../redux/slices/userSlice';

const FavoritesPage = () => {
  const favorites = useSelector(selectFavorites);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Favorites
          </Typography>
          <Typography variant="body1" paragraph>
            Please log in to view and manage your favorite movies.
          </Typography>
          <Button variant="contained" component={Link} to="/login">
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Favorites
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Your collection of favorite movies.
        </Typography>
        
        <MovieGrid
          movies={favorites}
          loading={false}
          error={null}
          hasMore={false}
          emptyMessage="You haven't added any movies to your favorites yet. Browse movies and click the heart icon to add them here."
        />
      </Box>
    </Container>
  );
};

export default FavoritesPage;
