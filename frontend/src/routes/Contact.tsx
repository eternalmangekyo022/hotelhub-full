//hooks
import { useState, useEffect } from 'react'

//styles
import './styles/contact.scss'

//assets
import Facebook from '../assets/images/Facebook Iconvector.svg'
import Instagram from '../assets/images/Instagram Iconvector.svg'
import Twitter from '../assets/images/Twitter Iconvector.svg'
import Tel from '../assets/images/phone.svg'
import Location from '../assets/images/location-filled.svg'
import Mail from '../assets/images/email.svg'

type FormData = {
	firstName: string
	lastName: string
	email: string
	phone: string
	message: string
}

export default function Contact() {
	const tel = "+36 30 123 4567";
	const mail = "support@hotelhub.com";
	const contactLocation = "Herman Kiefer, Detroit, Michigan, Egyesült Államok";
	const initial = { firstName: '', lastName: '', email: '', phone: '', message: '' };
	const [formData, setFormData] = useState<FormData>({ ...initial });

	const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault()
		setFormData({ ...initial });
	}

	useEffect(() => {
		document.title = 'HotelHub™ - Contact Us'
	}, [])

	return <>
		<div /**100vw */ className='wrapper'>
			<div /* 90% */ className='wrapper-inner'>
				<section /* 40%, flex-col */ className='contact-card'>
					<section className='contact-title'>
						<h1>Contact Information</h1>
						<h2>Have an inquery? Fill out the form to contact our team.</h2>
					</section>
					<section className='contact-information'>
						<div>
							<img src={Tel} alt=""  />
							<a href={`tel:${tel}`}>{tel}</a>
						</div>
						
						<div>
							<img src={Mail} alt="" />
							<a href={`mailto:${mail}`}>{mail}</a>
						</div>
						
						<div>
							<img src={Location} alt="" />
							<a href={`https://www.google.com/maps/search/${contactLocation}`}>{contactLocation}</a>
						</div>
					</section>
					<section className='socials'>
						<img src={Facebook} alt="Facebook" />
						<img src={Instagram} alt="Instagram" />
						<img src={Twitter} alt="Twitter" />
					</section>

				</section>
				<section /* 60% */ className='contact-form'>
					<h1>Contact Us</h1>
					<h2>Have an inquery? Fill out the form to contact our team.</h2>
					<form onSubmit={onSubmit}>
						<input onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} value={formData.firstName} type="text" placeholder="First Name" />
						<input onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} value={formData.lastName} type="text" placeholder="Last Name" />
						<input onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} value={formData.email} type="text" placeholder="Email" />
						<input onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} value={formData.phone} type="text" placeholder="Phone Number" />
						<input onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} value={formData.message} id='message' type="text" placeholder="Message" />
						<button type="submit">Send Message</button>
					</form>
				</section>
			</div>
		</div>
	</>
}