import React, { createContext, useContext, useState } from 'react';

interface Hotel {
  id: number;
  name: string;
  city: string;
  price: number;
  images: { full: string }[];
  averageRating: number;
  ratingCount: number;
  payment: string;
  class: number;
  description: string;
}

interface WishlistContextType {
  wishlist: Hotel[];
  addToWishlist: (hotel: Hotel) => void;
  removeFromWishlist: (id: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Hotel[]>([]);

  const addToWishlist = (hotel: Hotel) => {
    if (!wishlist.some((item) => item.id === hotel.id)) {
      setWishlist([...wishlist, hotel]);
    }
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};