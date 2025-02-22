import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as doLogin } from '../api'

const Login = () => {
	const [error, setError] = useState('')
	const [login, setLogin] = useState({
		login: '',
		password: '',
	})

	const navigate = useNavigate()

	const handleInputChange = e => {
		setLogin({ ...login, [e.target.name]: e.target.value })
	}

	const handleSubmit = e => {
		e.preventDefault()
		doLogin(login)
			.then(response => {
				document.cookie = `token=${response.data.token}; path=/`
				navigate('/')
			})
			.catch(error => {
				console.error('Ошибка входа:', error)
				setError(error.response.data.message)
				setTimeout(() => {
					setError('')
				}, 4000)
			})
	}

	return (
		<section className='container col-6 mt-5 mb-5'>
			{error && <p className='alert alert-danger'>{error}</p>}
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div className='row mb-3'>
					<label htmlFor='login' className='col-sm-2 col-form-label'>
						Email
					</label>
					<div>
						<input
							id='login'
							name='login'
							type='text'
							className='form-control'
							value={login.login}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				<div className='row mb-3'>
					<label
						htmlFor='password'
						className='col-sm-2 col-form-label'
					>
						Password
					</label>
					<div>
						<input
							id='password'
							name='password'
							type='password'
							className='form-control'
							value={login.password}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				<div className='mb-3'>
					<button
						type='submit'
						className='btn btn-hotel'
						style={{ marginRight: '10px' }}
					>
						Login
					</button>
					<span style={{ marginLeft: '10px' }}>
						Don't' have an account yet?
						<Link to={'/register'}>Register</Link>
					</span>
				</div>
			</form>
		</section>
	)
}

export default Login
