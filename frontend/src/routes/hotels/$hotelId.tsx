import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hotels/$hotelId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/hotels/$hotelId"!</div>
}
