import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { editUser } from '../api'
import useUser from '../hooks/UseUser'
import styles from './EditUser.module.css'
import Navbar from './Navbar'

const EditUser = () => {
	const { id } = useParams()
	const { user, error: userError, token } = useUser(id)
	const [successMessage, setSuccessMessage] = useState('')
	const [userData, setUserData] = useState({
		login: '',
	})
	const [errorMessage, setErrorMessage] = useState('')
	const [roles, setRoles] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
		let tokenValue
		if (tokenCookie) {
			tokenValue = tokenCookie.split('=')[1]
			const decodedToken = jwtDecode(tokenValue)
			setRoles(decodedToken.role)
		}
	}, [])

	const handleChange = e => {
		setUserData({ ...userData, [e.target.name]: e.target.value })
	}

	const handleSubmit = e => {
		e.preventDefault()
		editUser(userData, id, token)
			.then(() => {
				const token = document.cookie
					.split('; ')
					.find(row => row.startsWith('token='))
					.split('=')[1]
				const decodedToken = jwtDecode(token)
				setSuccessMessage('Пользователь успешно обновлен')
				setTimeout(() => {
					if (decodedToken.user_id != id) {
						navigate('/users')
					} else {
						navigate('/login')
					}
				}, 2000)
			})
			.catch(err => {
				setErrorMessage(
					err.response
						? err.response.data.message
						: 'Ошибка изменения данных пользователя'
				)
				setTimeout(() => {
					setErrorMessage('')
				}, 5000)
			})
	}

	useEffect(() => {
		if (user) {
			setUserData(user)
		}
	}, [user])

	const combinedError = userError || errorMessage

	return (
		<div>
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

			{combinedError && (
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

					<p className={styles.errorText}>{combinedError}</p>
				</div>
			)}
			{user && <Navbar userRole={roles} id={user.id} />}

			<div className={styles.root}>
				{user && (
					<p className={styles.headerText}>
						Изменение логина {user.login}
					</p>
				)}
				<form className={styles.form} onSubmit={handleSubmit}>
					<input
						type='text'
						className={styles.formInput}
						id='login'
						name='login'
						value={userData.login}
						onChange={handleChange}
					/>

					<button type='submit' className={styles.formButton}>
						Изменить
					</button>
				</form>
			</div>
		</div>
	)
}

export default EditUser
