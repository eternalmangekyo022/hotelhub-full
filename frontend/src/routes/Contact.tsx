//hooks
import { useEffect, useState } from 'react'
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
import { useQuery } from '@tanstack/react-query'

type FormData = {
  firstname: string
  lastname: string
  email: string
  message: string
}

export const Route = createFileRoute('/Contact')({
  component: Contact,
})

function Contact() {
  const tel = '+36 30 123 4567'
  const mail = 'hotelhubsupp@gmail.com'
  const contactLocation = 'Herman Kiefer, Detroit, Michigan, Egyesült Államok'
  const initial = {
    firstname: '',
    lastname: '',
    email: '',
    message: '',
  }
  const [alertVisible, setAlertVisible] = useState(false)
  const { register, handleSubmit, getValues } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: initial,
    errors: {
      firstname: {
        message: 'First name is required',
        type: 'required',
      },
      lastname: {
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

  const { refetch, isSuccess, isLoading, isError } = useQuery({
    queryKey: ['email'],
    retry: false,
    queryFn: async () => {
      const formData = getValues()
      try {
        const { status } = await axios.post(
          'http://localhost:3000/api/v1/email/send-contact-email',
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        return status
      } finally {
        setAlertVisible(true)
        const sleep = (ms: number, cb: () => void) =>
          new Promise((res, _rej) => {
            setTimeout(() => {
              cb()
              res(0)
            }, ms)
          })
        sleep(5000, () => {
          setAlertVisible(false)
        })
      }
    },
    enabled: false,
  })

  const onSubmit: SubmitHandler<FormData> = async () => {
    refetch()
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="[&_input,&_textarea]:not-dark:border-1 [&_input,&_textarea]:not-dark:border-gray-300 [&_input,&_textarea]:not-dark:bg-gray-200!"
            >
              <fieldset className="du-fieldset">
                <legend className="du-fieldset-legend">First Name</legend>
                <input
                  type="text"
                  className="du-input"
                  placeholder="First Name"
                  {...register('firstname')}
                />
              </fieldset>
              <fieldset className="du-fieldset">
                <legend className="du-fieldset-legend">Last Name</legend>
                <input
                  type="text"
                  className="du-input"
                  placeholder="Last Name"
                  {...register('lastname')}
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
                  className="du-textarea"
                  placeholder="Message"
                  {...register('message')}
                />
              </fieldset>
              <button
                type="submit"
                className={`du-btn h-8 ${isSuccess && alertVisible ? 'du-btn-success' : isError && alertVisible ? 'du-btn-error' : 'du-btn-primary'}`}
              >
                {isSuccess && alertVisible ? (
                  'Success'
                ) : isLoading ? (
                  <span className="du-loading du-loading-spinner du-loading-md"></span>
                ) : isError && alertVisible ? (
                  'X'
                ) : (
                  'Send'
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  )
}
