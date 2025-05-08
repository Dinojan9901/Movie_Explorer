import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import { fetchSearchResults, setSearchQuery } from '../redux/slices/moviesSlice';
import MovieGrid from '../components/movie/MovieGrid';

const SearchResultsPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { movies, status, error, page, totalPages } = useSelector(
    (state) => state.movies.search
  );
  
  const isLoading = status === 'loading';
  const hasMore = page < totalPages;

  useEffect(() => {
    if (query) {
      dispatch(setSearchQuery(query));
      dispatch(fetchSearchResults({ query }));
    }
  }, [dispatch, query]);

  const handleLoadMore = (nextPage) => {
    dispatch(fetchSearchResults({ query, page: nextPage }));
  };

  if (!query) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Search Results
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please enter a search query to find movies.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Results for "{query}"
        </Typography>
        
        <MovieGrid
          movies={movies}
          loading={isLoading}
          error={error}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          emptyMessage={isLoading ? "Searching..." : "No movies found matching your query. Try a different search term."}
        />
      </Box>
    </Container>
  );
};

export default SearchResultsPage;
