import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Skeleton
} from '@mui/material';
import { useCart } from '../../contexts/CartContext';
import type { Product } from '../../services/productService';

interface ProductCardProps {
  product: Product;
  loading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, loading = false }) => {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem(product, 1);
  };
  
  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={140} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" height={32} width="80%" />
          <Skeleton variant="text" height={24} width="40%" />
          <Skeleton variant="text" height={20} width="60%" />
        </CardContent>
        <CardActions>
          <Skeleton variant="rounded" height={36} width={120} />
          <Skeleton variant="rounded" height={36} width={120} />
        </CardActions>
      </Card>
    );
  }
  
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative', // Added to create positioning context
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      }
    }}>
      <CardMedia
        component="img"
        height="160"
        image={product.imageUrl || 'https://placehold.co/400x300/png?text=No+Image'}
        alt={product.name}
        sx={{ objectFit: 'contain', padding: 1, backgroundColor: '#f5f5f5' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          minHeight: '40px'
        }}>
          {product.description || 'No description available'}
        </Typography>
        <Box sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>
          ${product.price.toFixed(2)}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', padding: 2 }}>
        <Button 
          size="small" 
          color="primary" 
          component={Link} 
          to={`/products/${product.id}`}
        >
          View Details
        </Button>
        <Button 
          size="small" 
          color="primary" 
          variant="contained" 
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          Add to Cart
        </Button>
      </CardActions>
      {product.stock <= 0 && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          backgroundColor: 'error.main',
          color: 'white',
          padding: '4px 12px',
          borderTopRightRadius: 4,
          borderBottomLeftRadius: 8,
          fontWeight: 'bold',
          fontSize: '0.75rem',
          zIndex: 1,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          Out of Stock
        </Box>
      )}
    </Card>
  );
};

export default ProductCard;
