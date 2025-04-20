import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createFeedback, validateToken } from '../api.js'
import styles from './CreateFeedback.module.css'
import Navbar from './Navbar'

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
	const [user, setUser] = useState(null)
	const [mark, setMark] = useState(0)

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
					setUser({
						login: decodedToken.username,
						role: decodedToken.role,
						id: decodedToken.user_id,
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

	const handleStarClick = index => {
		setMark(index)
		renderStars()
	}

	const renderStars = () => {
		const stars = []

		for (let i = 0; i < mark; i++) {
			stars.push(
				<svg
					width='27'
					height='25'
					viewBox='0 0 27 25'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					style={{ marginTop: '9px', cursor: 'pointer' }}
					onClick={() => handleStarClick(i + 1)}
				>
					<path
						d='M13.7852 2.71958L16.2686 10.0306L16.4182 10.4709H16.8832H24.8374L18.4275 14.9255L18.0261 15.2044L18.1833 15.6672L20.6472 22.9205L14.1555 18.4091L13.7852 18.1517L13.4148 18.4091L6.92314 22.9205L9.38699 15.6672L9.5442 15.2044L9.14283 14.9255L2.73294 10.4709H10.6871H11.1521L11.3017 10.0306L13.7852 2.71958Z'
						fill='#FFE53D'
						stroke='#FFE53D'
						stroke-width='1.29808'
					/>
				</svg>
			)
		}

		for (let i = stars.length; i < 5; i++) {
			stars.push(
				<svg
					width='27'
					height='25'
					viewBox='0 0 27 25'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					style={{ marginTop: '9px', cursor: 'pointer' }}
					onClick={() => handleStarClick(i + 1)}
				>
					<path
						d='M13.3672 2.71958L15.8507 10.0306L16.0002 10.4709H16.4652H24.4194L18.0095 14.9255L17.6081 15.2044L17.7653 15.6672L20.2292 22.9205L13.7376 18.4091L13.3672 18.1517L12.9968 18.4091L6.50517 22.9205L8.96902 15.6672L9.12623 15.2044L8.72486 14.9255L2.31497 10.4709H10.2692H10.7341L10.8837 10.0306L13.3672 2.71958Z'
						stroke='#C9C9C9'
						stroke-width='1.29808'
					/>
				</svg>
			)
		}

		return <div className={styles.stars}>{stars}</div>
	}

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
		setFeedback({ ...feedback, ['mark']: mark })
		let feedbackToSend = { ...feedback, ['mark']: mark }

		createFeedback(feedbackToSend, token)
			.then(() => {
				setSuccessMessage('Отзыв успешно создан')
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
				}, 1000)
			})
			.catch(error => {
				setErrorMessage(error.response.data.message)
			})
		setTimeout(() => {
			setErrorMessage('')
			setSuccessMessage('')
		}, 3000)
	}

	return (
		<section className={styles.root}>
			{errorMessage && (
				<div className={styles.error}>
					<svg
						width='65'
						height='65'
						viewBox='0 0 65 65'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M29.9019 4.5C31.0566 2.5 33.9434 2.5 35.0981 4.5L58.0477 44.25C59.2024 46.25 57.7591 48.75 55.4497 48.75H9.55033C7.24093 48.75 5.79755 46.25 6.95225 44.25L29.9019 4.5Z'
							fill='#FF780A'
						/>
						<path
							d='M29.9648 34.4106L29.1431 23.228V18.8936H35.7495V23.228L34.8794 34.4106H29.9648ZM29.9326 41.4521C29.2988 40.8721 28.9819 40.061 28.9819 39.019C28.9819 37.9878 29.2988 37.1821 29.9326 36.6021C30.5557 36.022 31.3936 35.7319 32.4463 35.7319C33.499 35.7319 34.3423 36.022 34.9761 36.6021C35.5991 37.1821 35.9106 37.9878 35.9106 39.019C35.9106 40.061 35.5991 40.8721 34.9761 41.4521C34.3423 42.0322 33.499 42.3223 32.4463 42.3223C31.3936 42.3223 30.5557 42.0322 29.9326 41.4521Z'
							fill='white'
						/>
					</svg>

					<p className={styles.errorText}>{errorMessage}</p>
				</div>
			)}
			{successMessage && (
				<div className={styles.success}>
					<svg
						width='56'
						height='54'
						viewBox='0 0 56 54'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M6 29.9223L27.2461 48L50 6'
							stroke='#6BE637'
							stroke-width='12'
							stroke-linecap='round'
							stroke-linejoin='round'
						/>
					</svg>

					<p className={styles.successText}>{successMessage}</p>
				</div>
			)}
			{user != null && <Navbar userRole={user.role} id={user.id} />}
			<p className={styles.feedbackHeader}>Мой Отзыв</p>
			<form className={styles.feedbackForm} onSubmit={handleSubmit}>
				<div className={styles.formHeader}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='40'
						height='40'
						viewBox='0 0 45 46'
						fill='none'
					>
						<circle
							cx='22.3452'
							cy='22.8711'
							r='22.1656'
							fill='#F2F8FF'
						/>
					</svg>

					<p className={styles.userLogin}>{user && user.login}</p>
				</div>
				<div className={styles.formBody}>
					<label htmlFor='body' className={styles.label}>
						Расскажите о вашем впечатлении:
					</label>

					<textarea
						required
						id='body'
						name='body'
						type='text'
						value={feedback.body}
						onChange={handleInputChange}
						placeholder='Введите текст'
						className={styles.textarea}
					/>
				</div>

				<div className={styles.formFooter}>
					<div className={styles.mark}>
						<label
							className={styles.label}
							style={{ marginTop: '45px', marginBottom: '5px' }}
						>
							Ваша оценка:{' '}
						</label>
						{renderStars()}
					</div>
					<button type='submit' className={styles.addFeedback}>
						Сохранить
					</button>
				</div>
			</form>
		</section>
	)
}

export default CreateFeedback
