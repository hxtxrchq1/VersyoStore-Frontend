import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
  variacion?: {
    id?: number;
    color?: string;
    talla?: string;
    stock: number;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'cantidad'>, cantidad?: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, cantidad: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user).id?.toString() || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [items, setItems] = useState<CartItem[]>(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        const userCartKey = `versyo-cart-${parsedUser.id}`;
        const savedCart = localStorage.getItem(userCartKey);
        return savedCart ? JSON.parse(savedCart) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Watch for user changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          const newUserId = parsedUser.id?.toString();
          if (newUserId !== userId) {
            setUserId(newUserId);
            const userCartKey = `versyo-cart-${newUserId}`;
            const savedCart = localStorage.getItem(userCartKey);
            setItems(savedCart ? JSON.parse(savedCart) : []);
          }
        } catch {
          setUserId(null);
          setItems([]);
        }
      } else {
        setUserId(null);
        setItems([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const userCartKey = `versyo-cart-${userId}`;
      localStorage.setItem(userCartKey, JSON.stringify(items));
    }
  }, [items, userId]);

  const addToCart = (item: Omit<CartItem, 'cantidad'>, cantidad: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.variacion?.talla === item.variacion?.talla && i.variacion?.color === item.variacion?.color
      );

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id && i.variacion?.talla === item.variacion?.talla && i.variacion?.color === item.variacion?.color
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }

      return [...prevItems, { ...item, cantidad }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (userId) {
      const userCartKey = `versyo-cart-${userId}`;
      localStorage.removeItem(userCartKey);
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.cantidad, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
