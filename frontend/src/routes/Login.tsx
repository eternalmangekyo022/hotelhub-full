import { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/login.scss'

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
				<div className="login-form-inner">
					<h1>{register ? 'Register' : 'Welcome back'}</h1>
					<h2>{register ? 'Create a HotelHub account': 'Sign in to your HotelHub account'}</h2>
					<div className="input-wrapper">
						<label htmlFor="login-email">Email</label>
						<input type="text" name='login-email' value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}/>
					</div>
					<div className="input-wrapper">
						<label htmlFor="login-password">Password</label>
						<input type="password" name='login-password' value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
					</div>
					<div className="forgot-password">
						<span>Forgot your password?</span>
					</div>
					<button onClick={() => {}} type='button'>{register ? 'Register' : 'Login'}</button>
					<span>{register ? 'Already have an account?': "Don't have an account?"} <Link to={`/${register ? 'login': 'register'}`}>{register ? 'Login': 'Sign up'}</Link></span>
				</div>
			</form>
			<div className="login-image" />
		</div>
	</div>
}