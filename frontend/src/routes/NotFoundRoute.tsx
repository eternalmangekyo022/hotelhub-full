import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/NotFoundRoute')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/NotFoundRoute"!</div>
}
