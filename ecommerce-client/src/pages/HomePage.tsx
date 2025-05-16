import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardMedia, 
  CardContent,
  CardActions,
  Button,
  Divider,
  CircularProgress,
  Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import type { Product } from '../services/productService';
import type { Category } from '../services/categoryService';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // For now, we just load all products as featured products
        // In a real app, you'd have a specific endpoint for featured products
        const productsData = await productService.getProducts();
        setFeaturedProducts(productsData.slice(0, 6)); // Show only 6 products
        
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to load homepage data', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ width: '100%' }}>
      {/* Hero section */}
      <Box 
        sx={{ 
          my: 4,
          py: 6,
          textAlign: 'center',
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          width: '100%'
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Our Store
        </Typography>
        <Typography variant="h6" paragraph>
          The best products at the best prices
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          component={Link} 
          to="/products" 
          size="large"
        >
          Shop Now
        </Button>
      </Box>
      
      {/* Featured products section */}
      <Box my={6} width="100%">
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Products
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {featuredProducts.length === 0 ? (
          <Typography>No products available at the moment.</Typography>
        ) : (
          <Stack direction="row" flexWrap="wrap" gap={3} justifyContent="center" width="100%">
            {featuredProducts.map((product) => (
              <Card key={product.id} sx={{ width: 280, maxWidth: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl || 'https://via.placeholder.com/300x200'}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/products/${product.id}`}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Stack>
        )}
        
        <Box textAlign="center" mt={4}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/products"
          >
            View All Products
          </Button>
        </Box>
      </Box>
      
      {/* Categories section */}
      <Box my={6} width="100%">
        <Typography variant="h4" component="h2" gutterBottom>
          Categories
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {categories.length === 0 ? (
          <Typography>No categories available.</Typography>
        ) : (
          <Stack direction="row" flexWrap="wrap" gap={3} justifyContent="center" width="100%">
            {categories.map((category) => (
              <Card key={category.id} sx={{ width: 280, maxWidth: '100%', height: '100%' }}>
                <CardContent sx={{ height: '100%' }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/products?category=${category.id}`}
                  >
                    Browse Products
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default HomePage; 