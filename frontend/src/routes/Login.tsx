import { createFileRoute } from '@tanstack/react-router'
import Form from '../components/Form'

import './styles/login.scss'

export const Route = createFileRoute('/login')({
	component: Form,
})

