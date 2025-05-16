import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Pagination,
  Stack,
  Alert,
  InputAdornment,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import type { Product } from '../../services/productService';
import type { Category } from '../../services/categoryService';

const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering and pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 6;

  // Load initial data from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || '';
    const searchFromUrl = searchParams.get('search') || '';
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    
    setSelectedCategory(categoryFromUrl);
    setSearchTerm(searchFromUrl);
    setPage(pageFromUrl);
  }, [searchParams]);
  
  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
        setError('Failed to load categories');
      }
    };
    
    loadCategories();
  }, []);
  
  // Load products with filtering
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let productsData: Product[] = [];
        
        if (selectedCategory) {
          productsData = await productService.getProductsByCategory(selectedCategory);
        } else {
          productsData = await productService.getProducts();
        }
        
        // Apply search filter if provided
        if (searchTerm) {
          productsData = productsData.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Update total pages for pagination
        setTotalPages(Math.ceil(productsData.length / productsPerPage));
        
        // Apply pagination
        const startIndex = (page - 1) * productsPerPage;
        const paginatedProducts = productsData.slice(startIndex, startIndex + productsPerPage);
        
        setProducts(paginatedProducts);
      } catch (err) {
        console.error('Failed to load products', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [selectedCategory, searchTerm, page]);
  
  // Update URL when filters change
  const updateFilters = (category: string, search: string, newPage: number) => {
    const params: Record<string, string> = {};
    
    if (category) params.category = category;
    if (search) params.search = search;
    if (newPage > 1) params.page = newPage.toString();
    
    setSearchParams(params);
  };
  
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    setPage(1); // Reset to first page when changing filters
    updateFilters(newCategory, searchTerm, 1);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1); // Reset to first page when changing filters
    updateFilters(selectedCategory, searchTerm, 1);
  };
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    updateFilters(selectedCategory, searchTerm, value);
  };
  
  if (loading && page === 1) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
        
        {/* Filters */}
        <Box mb={4}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-end">
            <Box sx={{ width: { xs: '100%', sm: '33.3%' } }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ width: { xs: '100%', sm: '66.7%' } }}>
              <form onSubmit={handleSearchSubmit}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button type="submit">
                          <SearchIcon />
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </Box>
          </Stack>
        </Box>
        
        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        {/* Products grid */}
        {products.length === 0 ? (
          <Typography align="center" variant="h6">
            No products found. Try changing your filters.
          </Typography>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -1.5 }}>
              {products.map(product => (
                <Box key={product.id} sx={{ width: { xs: '100%', sm: '50%', md: '33.3%' }, padding: 1.5 }}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageUrl || 'https://via.placeholder.com/300x200'}
                      alt={product.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {product.description.substring(0, 100)}
                        {product.description.length > 100 ? '...' : ''}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${product.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        component={Link}
                        to={`/products/${product.id}`}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>
            
            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ProductListPage; 