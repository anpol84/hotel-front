import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createFeedback, validateToken } from '../api.js'

const CreateFeedback = () => {
	const { id } = useParams()
	const [feedback, setFeedback] = useState({
		body: '',
		mark: 0,
		hotelId: parseInt(id),
		userId: null,
	})
	const [token, setToken] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))

		if (tokenCookie) {
			const tokenValue = tokenCookie.split('=')[1]
			setToken(tokenValue)
			validateToken({ token: tokenValue })
				.then(response => {
					if (response.data.isValid == false) {
						navigate('/login')
					}
					const decodedToken = jwtDecode(tokenValue)
					setFeedback({
						...feedback,
						['userId']: decodedToken.user_id,
					})
				})
				.catch(err => {
					setErrorMessage(err.response.data.message)
					navigate('/login')
				})
		} else {
			navigate('/login')
		}
	}, [])

	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	const handleInputChange = e => {
		const name = e.target.name
		let value = e.target.value
		if (name === 'mark') {
			if (!isNaN(value)) {
				value = parseInt(value)
			} else {
				value = ''
			}
		}
		setFeedback({ ...feedback, [name]: value })
	}

	const handleSubmit = e => {
		e.preventDefault()
		createFeedback(feedback, token)
			.then(() => {
				setSuccessMessage('Feedback created success!')
				setErrorMessage('')
				setFeedback({
					body: '',
					mark: '',
					hotelId: 0,
					userId: 0,
				})
				setTimeout(() => {
					setSuccessMessage('')
					navigate(`/hotels/${id}`)
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
			<h2>Create Feedback</h2>
			<form onSubmit={handleSubmit}>
				<div className='mb-3 row'>
					<label htmlFor='body' className='col-sm-2 col-form-label'>
						Body
					</label>
					<div className='col-sm-10'>
						<input
							required
							id='body'
							name='body'
							type='text'
							className='form-control'
							value={feedback.body}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				<div className='mb-3 row'>
					<label htmlFor='mark' className='col-sm-2 col-form-label'>
						Mark
					</label>
					<div className='col-sm-10'>
						<input
							required
							type='number'
							className='form-control'
							id='mark'
							name='mark'
							value={feedback.mark}
							onChange={handleInputChange}
						/>
					</div>
				</div>
				<div className='d-flex justify-content-center'>
					<button
						type='submit'
						className='btn btn-hotel'
						style={{ marginRight: '10px' }}
					>
						Create Feedback
					</button>
					<div className='mx-2'>
						<Link
							to={`/hotels/${id}`}
							className='btn btn-outline-info btn'
						>
							Назад
						</Link>
					</div>
				</div>
			</form>
		</section>
	)
}

export default CreateFeedback
