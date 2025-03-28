//hooks
import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'

//styles
import './styles/contact.scss'

//assets
import Facebook from '../assets/images/Facebook Iconvector.svg'
import Instagram from '../assets/images/Instagram Iconvector.svg'
import Twitter from '../assets/images/Twitter Iconvector.svg'
import Tel from '../assets/images/phone.svg'
import Location from '../assets/images/location-filled.svg'
import Mail from '../assets/images/email.svg'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'

type FormData = {
  firstName: string
  lastName: string
  email: string
  message: string
}

export const Route = createFileRoute('/Contact')({
  component: Contact,
})

function Contact() {
  const tel = '+36 30 123 4567'
  const mail = 'support@hotelhub.com'
  const contactLocation = 'Herman Kiefer, Detroit, Michigan, Egyesült Államok'
  const initial = {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  }
  const { register, handleSubmit } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: initial,
    errors: {
      firstName: {
        message: 'First name is required',
        type: 'required',
      },
      lastName: {
        message: 'Last name is required',
        type: 'required',
      },
      email: {
        message: 'Email is required',
        type: 'required',
      },
      message: {
        message: 'Message is required',
        type: 'required',
      },
    },
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await axios.post(
      'http://localhost:3000/api/v1/email/send-contact-email',
      {
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        message: data.message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }

  useEffect(() => {
    document.title = 'HotelHub™ - Contact Us'
  }, [])

  return (
    <>
      <div className="wrapper">
        <div className="wrapper-inner">
          <section className="contact-card bg-blue-800">
            <section className="contact-title">
              <h1>Contact Information</h1>
              <h2>Have an inquery? Fill out the form to contact our team.</h2>
            </section>
            <section className="contact-information">
              <div>
                <img src={Tel} alt="" />
                <a href={`tel:${tel}`}>{tel}</a>
              </div>

              <div>
                <img src={Mail} alt="" />
                <a href={`mailto:${mail}`}>{mail}</a>
              </div>

              <div>
                <img src={Location} alt="" />
                <a
                  href={`https://www.google.com/maps/search/${contactLocation}`}
                >
                  {contactLocation}
                </a>
              </div>
            </section>
            <section className="socials">
              <a
                href="https://www.facebook.com/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  src={Facebook}
                  alt="Follow us on Facebook"
                  title="Follow us on Facebook"
                />
              </a>
              <a
                href="https://www.instagram.com/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  src={Instagram}
                  alt="Follow us on Instagram"
                  title="Follow us on Instagram"
                />
              </a>
              <a href="https://www.x.com/" rel="noreferrer" target="_blank">
                <img
                  src={Twitter}
                  alt="Follow us on Twitter"
                  title="Follow us on Twitter"
                />
              </a>
            </section>
          </section>
          <section className="contact-form">
            <h1>Contact Us</h1>
            <h2>Have an inquery? Fill out the form to contact our team.</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="du-fieldset">
                <legend className="du-fieldset-legend">First Name</legend>
                <input
                  type="text"
                  className="du-input"
                  placeholder="First Name"
                  {...register('firstName')}
                />
              </fieldset>
              <fieldset className="du-fieldset">
                <legend className="du-fieldset-legend">Last Name</legend>
                <input
                  type="text"
                  className="du-input"
                  placeholder="Last Name"
                  {...register('lastName')}
                />
              </fieldset>
              <fieldset className="du-fieldset">
                <legend className="du-fieldset-legend">Email</legend>
                <input
                  type="text"
                  className="du-input"
                  placeholder="Email"
                  {...register('email')}
                />
              </fieldset>
              <fieldset className="du-fieldset">
                <legend className="du-fieldset-legend">Message</legend>
                <textarea
                  className="du-input"
                  placeholder="Message"
                  {...register('message')}
                />
              </fieldset>
              <button type="submit" className="du-btn du-btn-primary h-8">
                Send
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  )
}
