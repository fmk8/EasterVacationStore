import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Divider,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import orderService from '../../services/orderService';
import type { Order } from '../../services/orderService';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order details', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="md">
        <Box my={4}>
          <Alert severity="error">
            {error || 'Order not found'}
          </Alert>
          <Button 
            component={Link} 
            to="/profile"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Return to Profile
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Order Details
          </Typography>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/profile"
          >
            Back to Profile
          </Button>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Order #{order.id.substring(0, 8)}...
              </Typography>
              <Chip
                label={order.status}
                color={getStatusColor(order.status) as any}
              />
            </Box>
            
            <Divider />
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Order Date
              </Typography>
              <Typography variant="body1">
                {formatDate(order.orderDate)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                ${order.total.toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Typography variant="h5" gutterBottom>
          Order Items
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {item.product && (
                        <Box 
                          component="img" 
                          src={item.product.imageUrl || 'https://via.placeholder.com/60x60'} 
                          alt={item.product.name}
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            objectFit: 'contain',
                            mr: 2,
                            borderRadius: 1
                          }} 
                        />
                      )}
                      <Typography variant="body1">
                        {item.product ? item.product.name : `Product ID: ${item.productId}`}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    ${item.product ? item.product.price.toFixed(2) : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    {item.quantity}
                  </TableCell>
                  <TableCell align="right">
                    ${item.product ? (item.product.price * item.quantity).toFixed(2) : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell align="right">
                  <Typography variant="subtitle1">Total:</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle1" fontWeight="bold">
                    ${order.total.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={4} display="flex" justifyContent="center">
          <Button 
            variant="contained" 
            component={Link} 
            to="/products"
          >
            Continue Shopping
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderDetailPage; 