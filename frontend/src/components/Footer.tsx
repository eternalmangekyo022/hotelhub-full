// link, so we can navigate through pages
import { Link } from 'react-router-dom'

// images
import Logo from '../assets/images/Logomarkvector.svg'
import Facebook from '../assets/images/Facebook Iconvector.svg'
import Instagram from '../assets/images/Instagram Iconvector.svg'
import Twitter from '../assets/images/Twitter Iconvector.svg'

// styles
import './styles/footer.scss'

export default function Footer() {
	const phoneNum = '+36 20 551 0080'
	const email = 'support@hotelhub.com'


	return <footer>
			<div className='footer-box'>
				<div className='footer-box-inner between'>
					<img src={Logo} alt="HotelHub™ Logo" />
					<div>
						<span>Follow Us</span>
					</div>
				</div>
				<div className='footer-box-inner between'>
					<Link onClick={() => document.title = 'HotelHub™ - Privacy Policy'} to='/privacy-policy'>Privacy Policy</Link>
					<div className='socials'>
						<a href='https://www.facebook.com/' target='_blank'><img src={Facebook} alt="Follow us on Facebook" title="Follow us on Facebook"/></a>
						<a href='https://www.instagram.com/' target='_blank'><img src={Instagram} alt="Follow us on Instagram" title="Follow us on Instagram"/></a>
						<a href='https://www.x.com/' target='_blank'><img src={Twitter} alt="Follow us on Twitter" title="Follow us on Twitter" /></a>
					</div>
				</div>
				<div className='footer-box-inner start'>
					<a style={{ display: 'inline' }} href={`tel:${phoneNum}`}>{phoneNum}</a>
					<a style={{ display: 'inline' }} href={`mailto:${email}`}>{email}</a>
				</div>
				<span id='trademark'>©2025 All rights reserved</span>
			</div>
		</footer>
}