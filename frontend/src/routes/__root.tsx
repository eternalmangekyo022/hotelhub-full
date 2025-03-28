import { Outlet, createRootRoute } from '@tanstack/react-router'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import '../global.scss'
import '../components/styles/index.css'
import { useAtom } from 'jotai'
import { userAtom } from '@store'
import axios from 'axios'
import { useEffect } from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [, setUser] = useAtom(userAtom)

  useEffect(() => {
    async function check() {
      try {
        const { data } = await axios.post<User>(
          'http://localhost:3000/api/v1/check',
          null,
          { withCredentials: true },
        )

        setUser(data)
      } catch (e) {}
    }
    check()
  }, [])

  return (
    <>
      <Header />
      <main className="dark:bg-base-100 text-black not-dark:bg-white dark:text-white">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
