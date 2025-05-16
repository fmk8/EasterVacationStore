import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import orderService from '../../services/orderService';
import type { Order } from '../../services/orderService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
        setError('Failed to load your order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box my={4}>
          <Alert severity="error">
            You need to be logged in to view your profile.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>

        <Paper>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Account Information" />
            <Tab label="Order History" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            <TabPanel value={tabValue} index={0}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mr: 3
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5">{user.username}</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {user.email}
                  </Typography>
                  <Chip
                    label={user.role}
                    color={user.role === 'Admin' ? 'secondary' : 'primary'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <List>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="User ID"
                    secondary={user.id}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Role"
                    secondary={user.role}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 3 }} />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="outlined" color="primary">
                  Edit Profile
                </Button>
                <Button variant="outlined" color="primary">
                  Change Password
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={logout}
                >
                  Logout
                </Button>
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              ) : orders.length === 0 ? (
                <Box textAlign="center" my={4}>
                  <Typography variant="h6" gutterBottom>
                    No orders found
                  </Typography>
                  <Typography variant="body1" paragraph>
                    You haven't placed any orders yet.
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/products"
                  >
                    Browse Products
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id.substring(0, 8)}...</TableCell>
                          <TableCell>{formatDate(order.orderDate)}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={getStatusColor(order.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button size="small" component={Link} to={`/orders/${order.id}`}>
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage; 