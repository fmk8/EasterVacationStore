import React from 'react';
import { Container, Typography, Box, Link, Stack } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We offer a wide selection of products at competitive prices. Our mission is to provide excellent customer service and quality products.
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" display="block">Home</Link>
            <Link href="/products" color="inherit" display="block">Products</Link>
            <Link href="/cart" color="inherit" display="block">Cart</Link>
            <Link href="/profile" color="inherit" display="block">My Account</Link>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              123 Main Street, Anytown, USA 12345
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: info@ecommerce-store.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +1 (123) 456-7890
            </Typography>
          </Box>
        </Stack>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}{' '}
            Ecommerce Store. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 