import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  Avatar, 
  Switch, 
  useMediaQuery, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon 
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Brightness4 as DarkModeIcon, 
  Brightness7 as LightModeIcon, 
  AccountCircle, 
  Favorite as FavoriteIcon, 
  Menu as MenuIcon,
  Home as HomeIcon,
  Movie as MovieIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { toggleTheme, logout, selectTheme, selectIsAuthenticated, selectUser } from '../../redux/slices/userSlice';
import SearchBar from './SearchBar';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem disabled sx={{ opacity: 1 }}>
        <Typography>{user?.username || 'User'}</Typography>
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate('/favorites'); }}>
        <FavoriteIcon fontSize="small" sx={{ mr: 1 }} />
        My Favorites
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Movie Explorer
      </Typography>
      <List>
        <ListItem component={Link} to="/" button>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component={Link} to="/trending" button>
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary="Trending" />
        </ListItem>
        {isAuthenticated && (
          <ListItem component={Link} to="/favorites" button>
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Favorites" />
          </ListItem>
        )}
        <ListItem>
          <ListItemIcon>
            {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <Switch checked={theme === 'dark'} onChange={handleThemeToggle} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              display: { xs: 'none', sm: 'block' },
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: isMobile ? 0 : 1,
            }}
          >
            Movie Explorer
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', mx: 2 }}>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/trending">
                Trending
              </Button>
              {isAuthenticated && (
                <Button color="inherit" component={Link} to="/favorites">
                  Favorites
                </Button>
              )}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={toggleSearch}>
              <SearchIcon />
            </IconButton>
            
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            
            {isAuthenticated ? (
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  alt={user?.username || 'User'}
                  src={user?.avatar}
                  sx={{ width: 32, height: 32 }}
                >
                  {user?.username?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
        
        {showSearch && <SearchBar onClose={toggleSearch} />}
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      
      {renderMenu}
    </>
  );
};

export default Header;
