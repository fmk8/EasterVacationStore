import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Stack
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import orderService from '../../services/orderService';

const steps = ['Shipping Address', 'Payment Details', 'Review Order'];

const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.username || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
  });
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  
  const handleShippingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePaymentDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCountryChange = (event: SelectChangeEvent) => {
    setShippingAddress(prev => ({
      ...prev,
      country: event.target.value
    }));
  };
  
  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!validateShippingAddress()) {
        return;
      }
    } else if (activeStep === 1) {
      if (!validatePaymentDetails()) {
        return;
      }
    }
    
    setActiveStep(prevStep => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  const validateShippingAddress = () => {
    const { fullName, addressLine1, city, state, postalCode, country } = shippingAddress;
    if (!fullName || !addressLine1 || !city || !state || !postalCode || !country) {
      setError('Please fill in all required fields.');
      return false;
    }
    setError('');
    return true;
  };
  
  const validatePaymentDetails = () => {
    const { cardName, cardNumber, expiryDate, cvv } = paymentDetails;
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      setError('Please fill in all payment details.');
      return false;
    }
    
    // Simple validation for card number (16 digits)
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid 16-digit card number.');
      return false;
    }
    
    // Simple validation for CVV (3-4 digits)
    if (!/^\d{3,4}$/.test(cvv)) {
      setError('Please enter a valid CVV number.');
      return false;
    }
    
    setError('');
    return true;
  };
  
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Create order items from cart
      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
      
      // Submit order to the API
      await orderService.createOrder({ items: orderItems });
      
      // Clear the cart and mark order as complete
      clearCart();
      setOrderComplete(true);
      setActiveStep(steps.length);
    } catch (err) {
      console.error('Failed to place order', err);
      setError('Failed to place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="fullName"
                value={shippingAddress.fullName}
                onChange={handleShippingAddressChange}
              />
              <TextField
                required
                fullWidth
                label="Address Line 1"
                name="addressLine1"
                value={shippingAddress.addressLine1}
                onChange={handleShippingAddressChange}
              />
              <TextField
                fullWidth
                label="Address Line 2"
                name="addressLine2"
                value={shippingAddress.addressLine2}
                onChange={handleShippingAddressChange}
              />
              <Box display="flex" gap={2}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleShippingAddressChange}
                />
                <TextField
                  required
                  fullWidth
                  label="State/Province/Region"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleShippingAddressChange}
                />
              </Box>
              <Box display="flex" gap={2}>
                <TextField
                  required
                  fullWidth
                  label="Postal Code"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleShippingAddressChange}
                />
                <FormControl fullWidth required>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select
                    labelId="country-label"
                    value={shippingAddress.country}
                    label="Country"
                    onChange={handleCountryChange}
                  >
                    <MenuItem value="USA">United States</MenuItem>
                    <MenuItem value="CAN">Canada</MenuItem>
                    <MenuItem value="MEX">Mexico</MenuItem>
                    <MenuItem value="GBR">United Kingdom</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                label="Name on Card"
                name="cardName"
                value={paymentDetails.cardName}
                onChange={handlePaymentDetailsChange}
              />
              <TextField
                required
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handlePaymentDetailsChange}
                placeholder="1234 5678 9012 3456"
              />
              <Box display="flex" gap={2}>
                <TextField
                  required
                  fullWidth
                  label="Expiry Date"
                  name="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={handlePaymentDetailsChange}
                  placeholder="MM/YY"
                />
                <TextField
                  required
                  fullWidth
                  label="CVV"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handlePaymentDetailsChange}
                  type="password"
                />
              </Box>
            </Stack>
            <Alert severity="info" sx={{ mt: 3 }}>
              This is a demo application. No actual payment will be processed.
            </Alert>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Stack spacing={2}>
              {items.map((item) => (
                <Box key={item.productId} display="flex" justifyContent="space-between">
                  <Typography>
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Shipping
                </Typography>
                <Typography variant="subtitle1">
                  Free
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">
                  Total
                </Typography>
                <Typography variant="h6">
                  ${getTotalPrice().toFixed(2)}
                </Typography>
              </Box>
            </Stack>
            
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Typography gutterBottom>
                {shippingAddress.fullName}
              </Typography>
              <Typography gutterBottom>
                {shippingAddress.addressLine1}
                {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
              </Typography>
              <Typography gutterBottom>
                {`${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}`}
              </Typography>
              <Typography gutterBottom>
                {shippingAddress.country}
              </Typography>
            </Box>
            
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              <Typography gutterBottom>
                Card: **** **** **** {paymentDetails.cardNumber.slice(-4)}
              </Typography>
              <Typography gutterBottom>
                Name: {paymentDetails.cardName}
              </Typography>
              <Typography gutterBottom>
                Expiry: {paymentDetails.expiryDate}
              </Typography>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };
  
  if (items.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }
  
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Checkout
        </Typography>
        
        <Paper sx={{ p: 3, mt: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === steps.length ? (
            // Order completed
            <Box textAlign="center">
              <Typography variant="h5" gutterBottom>
                Thank you for your order!
              </Typography>
              <Typography variant="body1" paragraph>
                Your order has been placed successfully. We will send you a confirmation email shortly.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/')}
                sx={{ mt: 2 }}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            // Checkout steps
            <Box>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              {getStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default CheckoutPage; 