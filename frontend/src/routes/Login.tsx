import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginFormInput from '../LoginFormInput';
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
					<LoginFormInput uid='login-email' value={formData.email} setValue={(val: string) => setFormData({ ...formData, email: val })} >Email</LoginFormInput>
					<LoginFormInput uid='login-password' value={formData.password} setValue={(val: string) => setFormData({ ...formData, password: val })} >Password</LoginFormInput>
					<div className="forgot-password">
						<span className='no-select'>Forgot your password?</span>
					</div>
					<button className='no-select' onClick={() => {}} type='button'>{register ? 'Register' : 'Login'}</button>
					<span>{register ? 'Already have an account?': "Don't have an account?"} <Link to={`/${register ? 'login': 'register'}`}>{register ? 'Login': 'Sign up'}</Link></span>
				</div>
			</form>
			<div className="login-image" />
		</div>
	</div>
}