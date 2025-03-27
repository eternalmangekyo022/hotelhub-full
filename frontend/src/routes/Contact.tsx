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

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
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
    phone: '',
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
      phone: {
        message: 'Phone is required',
        type: 'required',
      },
      message: {
        message: 'Message is required',
        type: 'required',
      },
    },
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data) // handle your form submission here
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
              <label className="du-input">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                  </g>
                </svg>
                <input type="text" className="grow" placeholder="index.php" />
              </label>
              <input
                type="text"
                placeholder="First Name"
                {...register('firstName')}
              />
              <input
                type="text"
                placeholder="Last Name"
                {...register('lastName')}
              />
              <input type="email" placeholder="Email" {...register('email')} />
              <input type="tel" placeholder="Phone" {...register('phone')} />
              <textarea placeholder="Message" {...register('message')} />
            </form>
          </section>
        </div>
      </div>
    </>
  )
}
