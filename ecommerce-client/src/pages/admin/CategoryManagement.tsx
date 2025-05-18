import React, { useState, useEffect } from 'react';
import { errorService } from '../../services/errorService';
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
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { categoryService } from '../../services/categoryService';
import type { Category, CategoryCreateRequest } from '../../services/categoryService';

const CategoryManagement: React.FC = () => {
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CategoryCreateRequest>({
    name: '',
    description: ''
  });

  // Error state
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  // Load categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        errorService.logError('Category Management - fetchCategories', error);
        const formattedError = errorService.formatError(error);
        setSnackbar({
          open: true,
          message: `Failed to load categories: ${formattedError.message}`,
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
      description: ''
    });
    setFormErrors({});
    setIsEditing(false);
    setDialogOpen(true);
  };
  
  // Handle opening the edit dialog
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setFormErrors({});
    setIsEditing(true);
    setDialogOpen(true);
  };
  
  // Handle opening the delete dialog
  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditing && selectedCategory) {
        // Update existing category
        const updatedCategory = await categoryService.updateCategory(
          selectedCategory.id,
          formData
        );
        
        // Update categories list
        setCategories(prevCategories => 
          prevCategories.map(c => c.id === updatedCategory.id ? updatedCategory : c)
        );
        
        setSnackbar({
          open: true,
          message: 'Category updated successfully',
          severity: 'success'
        });
      } else {
        // Create new category
        const newCategory = await categoryService.createCategory(formData);
        
        // Add to categories list
        setCategories(prevCategories => [...prevCategories, newCategory]);
        
        setSnackbar({
          open: true,
          message: 'Category created successfully',
          severity: 'success'
        });
      }
      
      setDialogOpen(false);
    } catch (error) {
      errorService.logError(`Category Management - ${isEditing ? 'update' : 'create'} category`, error);
      const formattedError = errorService.formatError(error);
      setSnackbar({
        open: true,
        message: `Failed to ${isEditing ? 'update' : 'create'} category: ${formattedError.message}`,
        severity: 'error'
      });
    }
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    
    try {
      await categoryService.deleteCategory(selectedCategory.id);
      
      // Remove from categories list
      setCategories(prevCategories => 
        prevCategories.filter(c => c.id !== selectedCategory.id)
      );
      
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success'
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      errorService.logError('Category Management - deleteCategory', error);
      const formattedError = errorService.formatError(error);
      setSnackbar({
        open: true,
        message: `Failed to delete category: ${formattedError.message}`,
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
          Category Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Add Category
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
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(category)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(category)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Category' : 'Create Category'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Category Name"
              value={formData.name}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
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
            Are you sure you want to delete the category "{selectedCategory?.name}"?
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

export default CategoryManagement;
