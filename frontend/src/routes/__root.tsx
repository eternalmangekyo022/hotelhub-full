import { Outlet, createRootRoute } from '@tanstack/react-router'

import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import '../global.scss'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
		<Header />
		<Outlet />
		<Footer />
    </>
  )
}