import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { getTotalItems } = useCart();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
  };
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ 
          flexGrow: 1, 
          textDecoration: 'none',
          color: 'white'
        }}>
          Ecommerce Store
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Navigation links */}
          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>
          
          {/* Cart icon with badge */}
          <IconButton 
            color="inherit" 
            component={Link} 
            to="/cart"
            sx={{ marginLeft: 1 }}
          >
            <Badge badgeContent={getTotalItems()} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          
          {isAuthenticated ? (
            <>
              {/* User account menu */}
              <IconButton 
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ marginLeft: 1 }}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  {user?.username}
                </MenuItem>
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  My Profile
                </MenuItem>
                <MenuItem component={Link} to="/orders" onClick={handleMenuClose}>
                  My Orders
                </MenuItem>
                {user?.role === 'Admin' && (
                  <MenuItem component={Link} to="/admin/products" onClick={handleMenuClose}>
                    Admin Dashboard
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* Authentication buttons */}
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 