import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { editHotelFeedback, getFeedback, validateToken } from '../api.js'

const EditFeedback = () => {
	const { id } = useParams()
	const [feedback, setFeedback] = useState({
		body: '',
		mark: 0,
	})
	const location = useLocation()
	const hotel = location.state
	const [token, setToken] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
		let tokenValue
		if (tokenCookie) {
			tokenValue = tokenCookie.split('=')[1]
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
		getFeedback(id, tokenValue).then(response => setFeedback(response.data))
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
		editHotelFeedback(id, feedback, token)
			.then(() => {
				setSuccessMessage('Feedback updated success!')
				setErrorMessage('')
				setFeedback({
					body: '',
					mark: '',
				})
				setTimeout(() => {
					setSuccessMessage('')
					navigate(`/hotels/${hotel.id}`)
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
			<h2>Update Feedback</h2>
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
						Update Feedback
					</button>
					<div className='mx-2'>
						<Link
							to={`/hotels/${hotel.id}`}
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

export default EditFeedback
