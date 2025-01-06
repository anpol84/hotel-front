import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api'

const Register = () => {
	const [userData, setUserData] = useState({
		login: '',
		password: '',
		city: '',
	})
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	const handleChange = e => {
		setUserData({ ...userData, [e.target.name]: e.target.value })
	}

	const handleSubmit = e => {
		e.preventDefault()
		register(userData)
			.then(response => {
				document.cookie = `token=${response.data.token}; path=/`
				navigate('/')
			})
			.catch(error => {
				console.log(error)
				console.error('Ошибка регистрации:', error)
				setError(error)
			})
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
				<input
					type='text'
					name='city'
					placeholder='Город'
					onChange={handleChange}
					required
				/>
				<button type='submit'>Зарегистрироваться</button>
			</form>
			<p>
				Уже есть аккаунт? <Link to='/login'>Войдите!</Link>
			</p>
			<p>
				<Link to='/'>На главную</Link>
			</p>
		</div>
	)
}

export default Register
