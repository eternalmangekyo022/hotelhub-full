import React from 'react'
import useScreen from '../hooks/useScreen.ts'
import { Link } from 'react-router-dom'
import Logo from '../assets/images/Logo.png'
import Menu from '../assets/images/Menu Icon.png'
import './styles/header.scss'

const linkStyle: React.CSSProperties = { textDecoration: 'none', color: 'black' }

export default function Header() {
  const [width,] = useScreen();

  return <>
    <header>
      <nav className='navbar'>
      <Link to="/" onClick={() => (document.title = 'HotelHub™')}>
          <img src={Logo} alt="Logo" />
        </Link>
        {width <= 768 ? <><img src={Menu} alt="Menu" className='menu-icon' /></>: <>
          <Link onClick={() => document.title = 'HotelHub™'} style={linkStyle} to='/' className='navlink'>Home</Link>
          <Link onClick={() => document.title = 'HotelHub™ - About'} style={linkStyle} to='/about' className='navlink'>About Us</Link>
          <Link onClick={() => document.title = 'HotelHub™ - Contact'} style={linkStyle} to='/contact' className='navlink' >Contact</Link>
          <Link onClick={() => document.title = 'HotelHub™ - Hotels'} style={linkStyle} to='/hotels' className='navlink' >Hotels</Link>
          <Link onClick={() => document.title = 'HotelHub™ - Register'} style={linkStyle} to='/register' className='navlink' >Register/Login</Link>

        </>}
      </nav>
    </header>
  </>
}