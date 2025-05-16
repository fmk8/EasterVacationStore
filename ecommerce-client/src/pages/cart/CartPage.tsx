import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Divider,
  Alert,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Shopping Cart
          </Typography>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Alert severity="info">
              Your cart is empty. Add some products to your cart!
            </Alert>
            <Box mt={2}>
              <Button 
                variant="contained" 
                component={Link} 
                to="/products"
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Shopping Cart
        </Typography>

        <Paper sx={{ mt: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Subtotal</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Box 
                          component="img" 
                          src={item.imageUrl || 'https://via.placeholder.com/80x80'} 
                          alt={item.name}
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            objectFit: 'contain',
                            mr: 2,
                            borderRadius: 1
                          }} 
                        />
                        <Typography variant="body1">
                          {item.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <IconButton 
                          size="small"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          size="small"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value, 10))}
                          inputProps={{ 
                            min: 1, 
                            style: { textAlign: 'center', width: '40px' } 
                          }}
                          variant="outlined"
                          sx={{ mx: 1 }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between">
              <Button 
                variant="outlined" 
                color="error" 
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <Button 
                variant="outlined" 
                component={Link} 
                to="/products"
              >
                Continue Shopping
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Order Summary */}
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Stack spacing={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">Subtotal:</Typography>
              <Typography variant="body1">
                ${getTotalPrice().toFixed(2)}
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">Shipping:</Typography>
              <Typography variant="body1">
                Free
              </Typography>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">
                ${getTotalPrice().toFixed(2)}
              </Typography>
            </Box>
          </Stack>
          
          <Box sx={{ mt: 3 }}>
            {isAuthenticated ? (
              <Button 
                fullWidth 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            ) : (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Please log in to complete your purchase.
                </Alert>
                <Button 
                  fullWidth 
                  variant="contained" 
                  component={Link}
                  to={`/login?redirect=cart`}
                  color="primary" 
                  size="large"
                >
                  Login to Checkout
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CartPage; 