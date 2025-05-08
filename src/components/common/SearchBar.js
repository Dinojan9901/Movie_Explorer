import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  InputBase, 
  IconButton, 
  Paper,
  CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Close as CloseIcon 
} from '@mui/icons-material';
import { saveLastSearchQuery } from '../../redux/slices/userSlice';
import { setSearchQuery } from '../../redux/slices/moviesSlice';

const SearchBar = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lastSearchQuery = useSelector(state => state.user.lastSearchQuery);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    // Pre-fill with last search query if available
    if (lastSearchQuery) {
      setSearchTerm(lastSearchQuery);
    }
    
    // Focus on the search input when component mounts
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }, [lastSearchQuery]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Save search query to Redux and localStorage
    dispatch(saveLastSearchQuery(searchTerm));
    dispatch(setSearchQuery(searchTerm));
    
    // Navigate to search results page with the query
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    
    if (onClose) {
      onClose();
    }
    
    setIsSearching(false);
  };
  
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  return (
    <Box sx={{ p: 1, backgroundColor: 'background.paper' }}>
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          p: '2px 4px',
        }}
      >
        <IconButton disabled>
          <SearchIcon />
        </IconButton>
        
        <InputBase
          id="search-input"
          placeholder="Search for movies..."
          inputProps={{ 'aria-label': 'search movies' }}
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          sx={{ ml: 1, flex: 1 }}
          autoFocus
        />
        
        {isSearching ? (
          <CircularProgress size={24} sx={{ mx: 1 }} />
        ) : (
          searchTerm && (
            <IconButton 
              aria-label="clear" 
              onClick={() => setSearchTerm('')}
            >
              <CloseIcon />
            </IconButton>
          )
        )}
        
        <IconButton 
          type="submit" 
          aria-label="search"
          disabled={!searchTerm.trim() || isSearching}
        >
          <SearchIcon />
        </IconButton>
        
        <IconButton 
          aria-label="close search" 
          onClick={onClose}
          edge="end"
        >
          <CloseIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar;
