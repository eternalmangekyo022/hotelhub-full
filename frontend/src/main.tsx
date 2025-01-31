import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Home.tsx'
import About from './routes/About.tsx'
import Contact from './routes/Contact.tsx'
import NotFound from './routes/NotFound.tsx'
import Hotels from './routes/Hotels.tsx'
import PrivacyPolicy from './routes/PrivacyPolicy.tsx'
import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx'
import HotelDetails from './components/HotelDetails.tsx'; // Import the component
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import './components/styles/style.scss'

// import styles, routing, component, routes, and necessary react utilities

const router = createBrowserRouter([
  {
    element: <><Header /><Outlet /><Footer /></>,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy/>
      },
      {
        path: '/hotelcard',
        element: <Hotels/>
      },
      {
        path: '/hotel/:id', // Add this route
        element: <HotelDetails />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
])
//mapping through each object to wrap the obj.element in the header

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);