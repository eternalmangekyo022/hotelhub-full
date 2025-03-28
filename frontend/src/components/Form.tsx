import {
  Link,
  redirect,
  useNavigate,
  useLocation,
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import LoginFormInput from '../LoginFormInput'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { userAtom } from '@/store'
import { useAtom } from 'jotai'

interface IFormData {
  firstname: string
  lastname: string
  phone: string
  email: string
  password: string
}

interface IProps {
  register?: boolean
}

export default function Login({ register }: IProps) {
  const [error, setError] = useState<string>('')
  const [user, setUser] = useAtom(userAtom)
  const navigate = useNavigate()
  const location = useLocation()

  const { isLoading, refetch } = useQuery({
    queryKey: [register ? 'register' : 'login'],
    async queryFn() {
      try {
        if (register) {
          // Registration flow
          const {
            data: { user },
          } = await axios.post<{ user: User }>(
            'http://localhost:3000/api/v1/register',
            {
              firstname: formData.firstname,
              lastname: formData.lastname,
              phone: formData.phone,
              email: formData.email,
              password: formData.password,
            },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            },
          )

          // Send registration email (fire and forget - don't block registration if email fails)
          try {
            await axios.post(
              'http://localhost:3000/api/v1/email/send-registration-email',
              {
                email: formData.email,
                firstname: formData.firstname,
                lastname: formData.lastname,
              },
            )
          } catch (emailError) {
            console.error('Failed to send welcome email:', emailError)
          }

          setUser(user)
          if (Object.keys(location.search).includes('redirect')) {
            navigate({
              to: decodeURIComponent(
                (location.search as { redirect: string }).redirect,
              ),
              search: {},
            })
          } else navigate({ to: '/' })
          return user
        } else {
          // Login flow
          try {
            const {
              data: { user },
            } = await axios.post<{ user: User }>(
              'http://localhost:3000/api/v1/login',
              {
                email: formData.email,
                password: formData.password,
              },
              {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
              },
            )
            setUser(user)
            if (Object.keys(location.search).includes('redirect')) {
              navigate({
                to: decodeURIComponent(
                  (location.search as { redirect: string }).redirect,
                ),
                search: {},
              })
              return user
            } else navigate({ to: '/' })
          } catch (e) {
            setError('Wrong credentials')
            return null
          }
        }
      } catch (e) {
        setError((e as any).response?.data?.message || (e as Error).message)
        return null
      }
    },
    enabled: false,
    retry: false,
  })

  const [formData, setFormData] = useState<IFormData>({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    phone: '',
  })

  useEffect(() => {
    if (user) redirect({ to: '/' })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  return (
    <div className={`login-wrapper${register ? 'register' : ''} bg-base-100`}>
      <div className={`login-form-wrapper ${register ? 'register' : 'login'}`}>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-inner">
            <div className="form-title dark:text-black">
              <h1>{register ? 'Register' : 'Welcome back'}</h1>
              <h2>
                {register
                  ? 'Create a HotelHub account'
                  : 'Sign in to your HotelHub account'}
              </h2>
            </div>
            <div className="inputs-wrapper">
              {register && (
                <>
                  <LoginFormInput
                    uid="login-firstname"
                    value={formData.firstname}
                    setValue={(val) =>
                      setFormData({ ...formData, firstname: val })
                    }
                    maxLength={20}
                  >
                    First Name
                  </LoginFormInput>
                  <LoginFormInput
                    uid="login-lastname"
                    value={formData.lastname}
                    setValue={(val) =>
                      setFormData({ ...formData, lastname: val })
                    }
                  >
                    Last Name
                  </LoginFormInput>
                  <LoginFormInput
                    uid="login-phone"
                    value={formData.phone}
                    setValue={(val) => setFormData({ ...formData, phone: val })}
                  >
                    Phone
                  </LoginFormInput>
                </>
              )}
              <LoginFormInput
                uid="login-email"
                value={formData.email}
                setValue={(val) => setFormData({ ...formData, email: val })}
                error={error}
              >
                Email
              </LoginFormInput>
              <LoginFormInput
                uid="login-password"
                value={formData.password}
                setValue={(val) => setFormData({ ...formData, password: val })}
                maxLength={16}
                error={error}
              >
                Password
              </LoginFormInput>
            </div>
            <div className="actions">
              {!register && (
                <div className="forgot-password">
                  <span className="no-select">Forgot your password?</span>
                </div>
              )}
              <button className="no-select" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="du-loading du-loading-spinner h-6 w-6"></span>
                ) : (
                  <>{register ? 'Register' : 'Login'}</>
                )}
              </button>
            </div>
          </div>
        </form>
        <div className={`login-sidebar ${register ? 'register' : 'login'}`}>
          <div className="content">
            <h1>{register ? 'Hello, Welcome!' : 'Welcome back!'}</h1>
            <h2>{register ? 'Already have an account?' : 'Not registered?'}</h2>
            <Link
              to={register ? ('/login' as string) : ('/register' as string)}
              className={register ? 'register' : 'login'}
            >
              {register ? 'Login' : 'Sign up'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
