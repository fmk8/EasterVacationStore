import type { SxProps, Theme } from '@mui/material';

// Define styles for ProductManagement component
export const productManagementStyles = {
  productImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover'
  } as SxProps<Theme>,
  
  noImageContainer: {
    width: '50px',
    height: '50px',
    bgcolor: 'grey.300',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as SxProps<Theme>
};
