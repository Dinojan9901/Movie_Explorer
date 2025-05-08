import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardActionArea, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Rating, 
  IconButton,
  Tooltip,
  Skeleton,
  useTheme
} from '@mui/material';
import { 
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon 
} from '@mui/icons-material';
import { toggleFavorite, selectFavorites } from '../../redux/slices/userSlice';
import { getImageUrl } from '../../services/tmdbApi';

const MovieCard = ({ movie, loading = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const favorites = useSelector(selectFavorites);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  
  const isFavorite = favorites.some(fav => fav.id === movie?.id);
  
  const handleCardClick = () => {
    if (!loading && movie) {
      navigate(`/movie/${movie.id}`);
    }
  };
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isAuthenticated && movie) {
      dispatch(toggleFavorite({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      }));
    } else {
      navigate('/login');
    }
  };
  
  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" sx={{ paddingTop: '150%' }} animation="wave" />
        <CardContent>
          <Skeleton variant="text" width="80%" height={24} animation="wave" />
          <Skeleton variant="text" width="60%" height={20} animation="wave" />
          <Skeleton variant="text" width="40%" height={20} animation="wave" />
        </CardContent>
      </Card>
    );
  }
  
  if (!movie) return null;
  
  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'Unknown';
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component="img"
          image={movie.poster_path 
            ? getImageUrl(movie.poster_path) 
            : '/movie-placeholder.jpg'}
          alt={movie.title}
          sx={{ paddingTop: '150%', objectFit: 'cover' }}
        />
        
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '0 0 0 8px',
          }}
        >
          <Typography color="white" fontWeight="bold">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </Typography>
        </Box>
        
        {isAuthenticated && (
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: theme.palette.background.paper,
              '&:hover': {
                backgroundColor: theme.palette.background.default,
              },
            }}
          >
            <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
              {isFavorite 
                ? <FavoriteIcon color="error" />
                : <FavoriteBorderIcon />
              }
            </Tooltip>
          </IconButton>
        )}
        
        <CardContent>
          <Typography variant="h6" component="div" noWrap>
            {movie.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            {releaseYear}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Rating 
              value={movie.vote_average / 2} 
              precision={0.5} 
              readOnly 
              size="small"
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
