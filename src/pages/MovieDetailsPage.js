import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
  Card,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Skeleton,
  IconButton,
  Paper,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { fetchMovieDetails, resetMovieDetails } from '../redux/slices/moviesSlice';
import { toggleFavorite, selectFavorites, selectIsAuthenticated } from '../redux/slices/userSlice';
import { getImageUrl } from '../services/tmdbApi';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const { movie, status, error } = useSelector((state) => state.movies.movieDetails);
  const favorites = useSelector(selectFavorites);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [showTrailer, setShowTrailer] = useState(false);
  
  const isLoading = status === 'loading';
  const isFavorite = favorites.some(fav => fav.id === Number(id));
  
  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails(id));
    }
    
    return () => {
      dispatch(resetMovieDetails());
    };
  }, [dispatch, id]);
  
  const handleToggleFavorite = () => {
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
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleToggleTrailer = () => {
    setShowTrailer(!showTrailer);
  };
  
  // Find official trailer if available
  const getTrailerKey = () => {
    if (!movie || !movie.videos || !movie.videos.results) return null;
    
    const trailer = movie.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    return trailer ? trailer.key : null;
  };
  
  const trailerKey = movie ? getTrailerKey() : null;
  
  // Show loading skeleton if data is being fetched
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleGoBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Skeleton variant="text" width="50%" height={60} />
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={30} width="70%" sx={{ mb: 1 }} />
            <Skeleton variant="text" height={30} width="50%" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {[1, 2, 3].map((_, index) => (
                <Skeleton key={index} variant="rectangular" width={80} height={32} sx={{ borderRadius: 4 }} />
              ))}
            </Box>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        </Grid>
      </Container>
    );
  }
  
  // Show error message if there was a problem fetching movie details
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" onClick={handleGoBack}>
              Go Back
            </Button>
          }
        >
          Error loading movie details: {error}
        </Alert>
      </Container>
    );
  }
  
  // Return empty if no movie data
  if (!movie) return null;
  
  // Format release date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={handleGoBack}
          sx={{ 
            mr: 2, 
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {movie.title}
          {movie.release_date && (
            <Typography 
              component="span" 
              variant="h6" 
              color="text.secondary" 
              sx={{ ml: 1 }}
            >
              ({new Date(movie.release_date).getFullYear()})
            </Typography>
          )}
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* Movie Poster */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={movie.poster_path 
                ? getImageUrl(movie.poster_path, 'w500') 
                : '/movie-placeholder.jpg'}
              alt={movie.title}
              sx={{ borderRadius: 1 }}
            />
          </Card>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color={isFavorite ? "error" : "primary"}
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={handleToggleFavorite}
              sx={{ mr: 1 }}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </Box>
          
          {trailerKey && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<PlayArrowIcon />}
                onClick={handleToggleTrailer}
              >
                Watch Trailer
              </Button>
            </Box>
          )}
        </Grid>
        
        {/* Movie Details */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating
              value={movie.vote_average / 2}
              precision={0.5}
              readOnly
              emptyIcon={<StarIcon fontSize="inherit" />}
            />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votes)
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Release Date:
                </Typography>
                <Typography variant="body1">
                  {formatDate(movie.release_date)}
                </Typography>
              </Grid>
              
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Runtime:
                </Typography>
                <Typography variant="body1">
                  {formatRuntime(movie.runtime)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Overview
          </Typography>
          <Typography variant="body1" paragraph>
            {movie.overview || "No overview available."}
          </Typography>
          
          {movie.genres && movie.genres.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Genres
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {movie.genres.map((genre) => (
                  <Chip 
                    key={genre.id} 
                    label={genre.name} 
                    color="primary" 
                    variant="outlined" 
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {/* Cast */}
          {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Top Cast
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <List>
                  {movie.credits.cast.slice(0, 5).map((person, index) => (
                    <React.Fragment key={person.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            alt={person.name}
                            src={person.profile_path 
                              ? getImageUrl(person.profile_path, 'w92') 
                              : '/person-placeholder.jpg'}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={person.name}
                          secondary={`as ${person.character || 'Unknown'}`}
                        />
                      </ListItem>
                      {index < Math.min(movie.credits.cast.length, 5) - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>
          )}
          
          {/* Trailer */}
          {showTrailer && trailerKey && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trailer
              </Typography>
              <Paper 
                elevation={3} 
                sx={{ 
                  position: 'relative',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title={`${movie.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Paper>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MovieDetailsPage;
