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
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { getTotalItems } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
    handleMobileMenuClose();
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
        
        {isMobile ? (
          // Mobile view
          <Box>
            {/* Always show cart icon */}
            <IconButton 
              color="inherit" 
              component={Link} 
              to="/cart"
              sx={{ marginRight: 1 }}
            >
              <Badge badgeContent={getTotalItems()} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Hamburger menu for mobile */}
            <IconButton 
              color="inherit"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Mobile menu */}
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
            >
              <MenuItem component={Link} to="/products" onClick={handleMobileMenuClose}>
                Products
              </MenuItem>
              
              {isAuthenticated ? (
                // Authenticated user items
                <>
                  <MenuItem component={Link} to="/profile" onClick={handleMobileMenuClose}>
                    My Profile
                  </MenuItem>
                  <MenuItem component={Link} to="/orders" onClick={handleMobileMenuClose}>
                    My Orders
                  </MenuItem>
                  {user?.role === 'Admin' && (
                    <MenuItem component={Link} to="/admin/products" onClick={handleMobileMenuClose}>
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </>
              ) : (
                // Guest user items
                <>
                  <MenuItem component={Link} to="/login" onClick={handleMobileMenuClose}>
                    Login
                  </MenuItem>
                  <MenuItem component={Link} to="/register" onClick={handleMobileMenuClose}>
                    Register
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        ) : (
          // Desktop view
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
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 