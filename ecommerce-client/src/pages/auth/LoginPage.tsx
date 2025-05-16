import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper,
  Alert,
  Stack
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      // Redirect to home page after successful login
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/register">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage; 