import { useState } from 'react';
import './styles/login.scss'
import { Link } from 'react-router-dom';

interface IFormData {
	firstname: string;
	lastname: string;
	phone: string;
	email: string;
	password: string;
}

interface IProps {
	register?: boolean
}

export default function Login({ register }: IProps) {
	const [formData, setFormData] = useState<IFormData>({
		email: '',
		password: '',
		firstname: '',
		lastname: '',
		phone: ''
	});

	return <div className="login-wrapper">
		<div className="login-form-wrapper">
			<form className="login-form">
				<h1>{register ? 'Register' : 'Welcome back'}</h1>
				<h2>{register ? 'Create a HotelHub account': 'Sign in to your HotelHub account'}</h2>
				<label htmlFor="login-email">Email</label>
				<input type="text" name='login-email' value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}/>
				<div className="password-section">
					<label htmlFor="login-password">Password</label>
					<span>Forgot your password?</span>
				</div>
				<input type="password" name='login-password' value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
				<button onClick={() => {}} type='button'>{register ? 'Register' : 'Login'}</button>
				<div className="login-divider">
					<div className="line" />
					<span>Or continue with</span>
					<div className="line" />
				</div>
				<span>{register ? 'Already have an account?': "Don't have an account?"} <Link to={`/${register ? 'login': 'register'}`}>{register ? 'Login': 'Sign up'}</Link></span>
			</form>
			<div className="login-image" />
		</div>
	</div>
}