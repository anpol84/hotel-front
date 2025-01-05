import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api'

const Login = () => {
	const [credentials, setCredentials] = useState({ login: '', password: '' })
	const navigate = useNavigate()
	const [error, setError] = useState(null)

	const handleChange = e => {
		setCredentials({ ...credentials, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const response = await login(credentials)
			document.cookie = `token=${response.data.token}; path=/`
			navigate('/')
		} catch (error) {
			console.error('Ошибка входа:', error)
			setError(error)
		}
	}

	return (
		<div>
			{error != null && error.response.data.message}
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					name='login'
					placeholder='Логин'
					onChange={handleChange}
					required
				/>
				<input
					type='password'
					name='password'
					placeholder='Пароль'
					onChange={handleChange}
					required
				/>
				<button type='submit'>Войти</button>
			</form>
			<p>
				Нет аккаунта? <Link to='/register'>Создайте!</Link>
			</p>
			<p>
				<Link to='/'>На главную</Link>
			</p>
		</div>
	)
}

export default Login
