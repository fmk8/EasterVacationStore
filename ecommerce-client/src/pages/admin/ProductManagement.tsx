import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import type { Product, ProductCreateRequest } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../services/categoryService';

const ProductManagement: React.FC = () => {
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<ProductCreateRequest>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    categoryId: '',
    stock: 0
  });

  // Error state
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  // Load products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading products:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load products',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle opening the create dialog
  const handleCreateClick = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      categoryId: '',
      stock: 0
    });
    setFormErrors({});
    setIsEditing(false);
    setDialogOpen(true);
  };
  
  // Handle opening the edit dialog
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      stock: product.stock
    });
    setFormErrors({});
    setIsEditing(true);
    setDialogOpen(true);
  };
  
  // Handle opening the delete dialog
  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };
  
  // Handle text input changes
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Handle select input changes
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    if (!formData.categoryId) {
      errors.categoryId = 'Category is required';
    }
    
    if (formData.stock < 0) {
      errors.stock = 'Stock cannot be negative';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditing && selectedProduct) {
        // Update existing product
        const updatedProduct = await productService.updateProduct(
          selectedProduct.id,
          formData
        );
        
        // Update products list
        setProducts(prevProducts => 
          prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
        
        setSnackbar({
          open: true,
          message: 'Product updated successfully',
          severity: 'success'
        });
      } else {
        // Create new product
        const newProduct = await productService.createProduct(formData);
        
        // Add to products list
        setProducts(prevProducts => [...prevProducts, newProduct]);
        
        setSnackbar({
          open: true,
          message: 'Product created successfully',
          severity: 'success'
        });
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${isEditing ? 'update' : 'create'} product`,
        severity: 'error'
      });
    }
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    
    try {
      await productService.deleteProduct(selectedProduct.id);
      
      // Remove from products list
      setProducts(prevProducts => 
        prevProducts.filter(p => p.id !== selectedProduct.id)
      );
      
      setSnackbar({
        open: true,
        message: 'Product deleted successfully',
        severity: 'success'
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete product',
        severity: 'error'
      });
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Product Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Add Product
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                      />
                    ) : (
                      <Box 
                        width="50px" 
                        height="50px" 
                        bgcolor="grey.300" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                      >
                        No image
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.category ? (
                      <Chip label={product.category.name} size="small" />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(product)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(product)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Product' : 'Create Product'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Product Name"
              value={formData.name}
              onChange={handleTextInputChange}
              fullWidth
              margin="normal"
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
            />
            
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleTextInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              error={!!formErrors.description}
              helperText={formErrors.description}
              required
            />
            
            <TextField
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleTextInputChange}
              fullWidth
              margin="normal"
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              error={!!formErrors.price}
              helperText={formErrors.price}
              required
            />
            
            <TextField
              name="stock"
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={handleTextInputChange}
              fullWidth
              margin="normal"
              InputProps={{ inputProps: { min: 0 } }}
              error={!!formErrors.stock}
              helperText={formErrors.stock}
              required
            />
            
            <TextField
              name="imageUrl"
              label="Image URL"
              value={formData.imageUrl}
              onChange={handleTextInputChange}
              fullWidth
              margin="normal"
            />
            
            <FormControl 
              fullWidth 
              margin="normal" 
              error={!!formErrors.categoryId}
              required
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleSelectChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.categoryId && (
                <FormHelperText>{formErrors.categoryId}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product "{selectedProduct?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
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

export default ProductManagement;
