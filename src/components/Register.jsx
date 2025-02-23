import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api'

const Register = () => {
	const [registration, setRegistration] = useState({
		login: '',
		password: '',
	})
	const navigate = useNavigate()

	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	const handleInputChange = e => {
		setRegistration({ ...registration, [e.target.name]: e.target.value })
	}

	const handleRegistration = e => {
		e.preventDefault()
		register(registration)
			.then(response => {
				document.cookie = `token=${response.data.token}; path=/`
				setSuccessMessage('Registration success!')
				setErrorMessage('')
				setRegistration({
					login: '',
					password: '',
				})
				setTimeout(() => {
					setSuccessMessage('')
					navigate('/')
				}, 3000)
			})
			.catch(error => {
				setErrorMessage(error.response.data.message)
			})
		setTimeout(() => {
			setErrorMessage('')
			setSuccessMessage('')
		}, 5000)
	}

	return (
		<section className='container col-6 mt-5 mb-5'>
			{errorMessage && (
				<p className='alert alert-danger'>{errorMessage}</p>
			)}
			{successMessage && (
				<p className='alert alert-success'>{successMessage}</p>
			)}
			<h2>Register</h2>
			<form onSubmit={handleRegistration}>
				<div className='mb-3 row'>
					<label htmlFor='login' className='col-sm-2 col-form-label'>
						Login
					</label>
					<div className='col-sm-10'>
						<input
							id='login'
							name='login'
							type='text'
							className='form-control'
							value={registration.login}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				<div className='mb-3 row'>
					<label
						htmlFor='password'
						className='col-sm-2 col-form-label'
					>
						Password
					</label>
					<div className='col-sm-10'>
						<input
							type='password'
							className='form-control'
							id='password'
							name='password'
							value={registration.password}
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
						Register
					</button>
					<span style={{ marginLeft: '10px' }}>
						Already have an account?{' '}
						<Link to={'/login'}>Login</Link>
					</span>
				</div>
			</form>
		</section>
	)
}

export default Register
