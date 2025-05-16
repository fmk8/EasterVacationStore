import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardMedia, 
  Button, 
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import productService from '../../services/productService';
import type { Product } from '../../services/productService';
import { useCart } from '../../contexts/CartContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Product ID not found');
        setLoading(false);
        return;
      }
      
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);
  
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      setAddedToCart(true);
      
      // Reset the added to cart message after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !product) {
    return (
      <Container maxWidth="lg">
        <Box my={4}>
          <Alert severity="error">
            {error || 'Product not found'}
          </Alert>
          <Button 
            component={Link} 
            to="/products"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Return to Products
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        {/* Breadcrumbs navigation */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink component={Link} to="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <MuiLink component={Link} to="/products" underline="hover" color="inherit">
            Products
          </MuiLink>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>
        
        {/* Product details */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          {/* Product image */}
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardMedia
                component="img"
                image={product.imageUrl || 'https://via.placeholder.com/600x400'}
                alt={product.name}
                sx={{ height: { xs: 300, md: 400 } }}
              />
            </Card>
          </Box>
          
          {/* Product info */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              
              <Typography variant="h5" color="primary" gutterBottom>
                ${product.price.toFixed(2)}
              </Typography>
              
              {product.category && (
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Category: {product.category.name}
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              
              <Box sx={{ my: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Availability: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </Typography>
                
                {product.stock > 0 ? (
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        InputProps={{ inputProps: { min: 1, max: product.stock } }}
                        size="small"
                        sx={{ width: 100, mr: 2 }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                    
                    {addedToCart && (
                      <Alert severity="success">
                        Product added to cart!
                      </Alert>
                    )}
                  </Box>
                ) : (
                  <Alert severity="warning">
                    This product is currently out of stock.
                  </Alert>
                )}
              </Box>
            </Paper>
          </Box>
        </Stack>
        
        {/* Related products section could be added here */}
        
        {/* Back to products button */}
        <Box mt={4}>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/products"
          >
            Back to Products
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetailPage; 