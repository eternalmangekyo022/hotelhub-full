import React from 'react';
import { WishlistProvider } from '../components/WishListContext'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const AppWrapper: React.FC = () => {
  return (
    <WishlistProvider>
      <Header />
      <Outlet />
      <Footer />
    </WishlistProvider>
  );
};

export default AppWrapper;