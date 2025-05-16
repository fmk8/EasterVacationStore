import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../services/productService';

// Define the cart item type
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// Define the context structure
interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Define props for CartProvider
interface CartProviderProps {
  children: ReactNode;
}

// Create the provider component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  // Add an item to the cart
  const addItem = (product: Product, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        // If item exists, update quantity
        return prevItems.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // If item doesn't exist, add it
        return [...prevItems, {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity
        }];
      }
    });
  };
  
  // Remove an item from the cart
  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };
  
  // Update the quantity of an item
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear all items from the cart
  const clearCart = () => {
    setItems([]);
  };
  
  // Get the total number of items in the cart
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  // Get the total price of all items in the cart
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Create the context value object
  const contextValue: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook for easy context consumption
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider; 