import { createFileRoute, useLocation } from '@tanstack/react-router'

export const Route = createFileRoute('/NotFoundRoute')({
  notFoundComponent() {
    return () => <NotFound />
  },
})

function NotFound() {
  const location = useLocation()

  return <div>`{location.pathname}` not found</div>
}
