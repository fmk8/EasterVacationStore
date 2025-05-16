import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Import pages 
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductListPage from './pages/products/ProductListPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/cart/CheckoutPage';
import ProfilePage from './pages/profile/ProfilePage';
import OrderDetailPage from './pages/profile/OrderDetailPage';

// Import Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import OrderManagement from './pages/admin/OrderManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Main Store Routes with Layout */}
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
              </Route>
            </Route>
            
            {/* Admin routes with Admin Layout - require admin role */}
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/categories" element={<CategoryManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
              </Route>
            </Route>
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
