import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <CssBaseline />
      <Navbar />
      <Container 
        component="main" 
        sx={{ mt: 4, mb: 4, flex: 1 }}
        maxWidth={false}
      >
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout; 