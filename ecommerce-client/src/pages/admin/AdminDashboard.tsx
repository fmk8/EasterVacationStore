import React, { useState, useEffect } from 'react';
import { errorService } from '../../services/errorService';
import { 
  Typography, 
  Paper, 
  Box, 
  Card, 
  CardContent,
  Divider
} from '@mui/material';
import {
  ShoppingCart as OrderIcon,
  Inventory as ProductIcon,
  Category as CategoryIcon,
  Person as UserIcon
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardCard {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [productCount, setProductCount] = useState<number>(0);
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products and categories count
        const products = await productService.getProducts();
        const categories = await categoryService.getCategories();

        setProductCount(products.length);
        setCategoryCount(categories.length);
      } catch (error) {
        errorService.logError('Admin Dashboard - fetchData', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards: DashboardCard[] = [
    {
      title: 'Products',
      value: productCount,
      icon: <ProductIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      title: 'Categories',
      value: categoryCount,
      icon: <CategoryIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
    },
    {
      title: 'Orders',
      value: 0, // Will be implemented in future
      icon: <OrderIcon sx={{ fontSize: 40, color: 'success.main' }} />
    },
    {
      title: 'Users',
      value: 1, // Hardcoded for now
      icon: <UserIcon sx={{ fontSize: 40, color: 'warning.main' }} />
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom component="h1">
        Dashboard
      </Typography>
      
      <Box mb={4}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Welcome, {user?.username}!
          </Typography>
          <Typography variant="body1">
            This is your admin dashboard where you can manage your store.
          </Typography>
        </Paper>
      </Box>
      
      <Typography variant="h5" gutterBottom>
        Store Summary
      </Typography>
      
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: 'repeat(4, 1fr)'
          },
          gap: 3
        }}
      >
        {cards.map((card) => (
          <Card raised key={card.title}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {loading ? '...' : card.value}
                  </Typography>
                </div>
                {card.icon}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      <Box mt={4}>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="h5" gutterBottom>
          Quick Links
        </Typography>
        
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)'
            },
            gap: 3
          }}
        >
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Manage Products</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Add, edit, or remove products from your store.
            </Typography>
            <Typography variant="body2" color="primary" component="a" href="/admin/products">
              Go to Products →
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Manage Categories</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Organize your products with categories.
            </Typography>
            <Typography variant="body2" color="primary" component="a" href="/admin/categories">
              Go to Categories →
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">View Orders</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Manage customer orders and track status.
            </Typography>
            <Typography variant="body2" color="primary" component="a" href="/admin/orders">
              Go to Orders →
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
