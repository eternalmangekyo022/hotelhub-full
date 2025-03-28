import { createFileRoute } from '@tanstack/react-router'
import Form from '../components/Form'
import './styles/login.scss'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  return <Form register />
}
