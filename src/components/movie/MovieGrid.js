import React, { useEffect, useCallback } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert, 
  useTheme 
} from '@mui/material';
import MovieCard from './MovieCard';
import { useInView } from 'react-intersection-observer';

const MovieGrid = ({ 
  title, 
  movies = [], 
  loading = false, 
  error = null, 
  hasMore = false, 
  onLoadMore = null, 
  useInfiniteScroll = true,
  emptyMessage = "No movies found" 
}) => {
  const theme = useTheme();
  
  // For infinite scrolling
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  const loadMoreMovies = useCallback(() => {
    // The caller owns pagination state, so it decides which page comes next.
    if (onLoadMore && !loading && hasMore) {
      onLoadMore();
    }
  }, [onLoadMore, loading, hasMore]);
  
  // Handle infinite scroll
  useEffect(() => {
    if (inView && useInfiniteScroll) {
      loadMoreMovies();
    }
  }, [inView, loadMoreMovies, useInfiniteScroll]);
  
  // Create skeleton loaders when loading
  const renderSkeletons = () => {
    return Array(8).fill(0).map((_, index) => (
      <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={`skeleton-${index}`}>
        <MovieCard loading={true} />
      </Grid>
    ));
  };
  
  return (
    <Box sx={{ py: 4 }}>
      {title && (
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          sx={{ 
            mb: 3, 
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            paddingBottom: 1,
            fontWeight: 'bold',
          }}
        >
          {title}
        </Typography>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {movies.length === 0 && !loading && !error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {emptyMessage}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={movie.id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
        
        {loading && renderSkeletons()}
      </Grid>
      
      {/* Loading indicator or Load More button */}
      {hasMore && (
        <Box 
          ref={ref}
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
            py: 2,
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            !useInfiniteScroll && (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={loadMoreMovies}
                disabled={loading || !hasMore}
              >
                Load More
              </Button>
            )
          )}
        </Box>
      )}
    </Box>
  );
};

export default MovieGrid;
