import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { orderService } from '../../services/orderService';
import type { Order } from '../../services/orderService';

const OrderManagement: React.FC = () => {
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  // Statuses for orders
  const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  
  // Load orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // This would need to be implemented in the orderService
        // For now, we'll just use the user orders function as a placeholder
        const userOrders = await orderService.getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load orders',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Handle viewing order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };
  
  // Handle opening status edit dialog
  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };
  
  // Handle status change
  const handleStatusChange = (event: SelectChangeEvent) => {
    setNewStatus(event.target.value);
  };
  
  // Handle status update submission
  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    
    try {
      // Call API to update order status
      const updatedOrder = await orderService.updateOrderStatus(selectedOrder.id, newStatus);
      
      // Update order in state
      setOrders(prevOrders => 
        prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o)
      );
      
      setSnackbar({
        open: true,
        message: 'Order status updated successfully',
        severity: 'success'
      });
      
      setStatusDialogOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update order status',
        severity: 'error'
      });
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status color
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
  
  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Order Management
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={getStatusColor(order.status) as any}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewOrder(order)}
                      size="small"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleEditStatus(order)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* View Order Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">
                  Order #{selectedOrder.id}
                </Typography>
                <Chip 
                  label={selectedOrder.status} 
                  color={getStatusColor(selectedOrder.status) as any}
                />
              </Box>
              
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Placed on {formatDate(selectedOrder.orderDate)}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Order Items
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>
                          {item.product ? item.product.name : `Product ID: ${item.productId}`}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell align="right">
                          ${item.product ? item.product.price.toFixed(2) : '0.00'}
                        </TableCell>
                        <TableCell align="right">
                          ${item.product 
                            ? (item.product.price * item.quantity).toFixed(2) 
                            : '0.00'}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                        Order Total:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        ${selectedOrder.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              setViewDialogOpen(false);
              if (selectedOrder) handleEditStatus(selectedOrder);
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                value={newStatus}
                onChange={handleStatusChange}
                label="Status"
              >
                {orderStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained" 
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderManagement; 