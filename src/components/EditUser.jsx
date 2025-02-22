import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { editUser } from '../api'
import useUser from '../hooks/useUser'

const EditUser = () => {
	const { id } = useParams()
	const { user, error: userError, token } = useUser(id)
	const [successMessage, setSuccessMessage] = useState('')
	const [userData, setUserData] = useState({
		login: '',
	})
	const [errorMessage, setErrorMessage] = useState('')

	const navigate = useNavigate()

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
				setSuccessMessage('User updated successfully')
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
		<div className='container mt-5 mb-5'>
			<h3 className='text-center mb-5 mt-5'>Edit User</h3>
			<div className='row justify-content-center'>
				<div className='col-md-8 col-lg-6'>
					{successMessage && (
						<div className='alert alert-success' role='alert'>
							{successMessage}
						</div>
					)}
					{combinedError && (
						<div className='alert alert-danger' role='alert'>
							{combinedError}
						</div>
					)}
					<form onSubmit={handleSubmit}>
						<div className='mb-3'>
							<label
								htmlFor='login'
								className='form-label hotel-color'
							>
								Login
							</label>
							<input
								type='text'
								className='form-control'
								id='login'
								name='login'
								value={userData.login}
								onChange={handleChange}
							/>
						</div>
						<div className='d-grid gap-2 d-md-flex mt-2'>
							<Link
								to={`/users/${id}`}
								className='btn btn-outline-info ml-5'
							>
								К профилю
							</Link>
							<button
								type='submit'
								className='btn btn-outline-warning'
							>
								Edit User
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default EditUser
