import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { editUser } from '../api'
import useUser from '../hooks/useUser'

const EditUser = () => {
	const { id } = useParams()
	const { user, loading, error: userError, token } = useUser(id)
	const [userData, setUserData] = useState({
		login: '',
		city: '',
	})
	const [error, setError] = useState(null)

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
				if (decodedToken.user_id != id) {
					navigate('/users')
				} else {
					navigate('/login')
				}
			})
			.catch(err => {
				setError(
					err.response
						? err.response.data.message
						: 'Ошибка изменения данных пользователя'
				)
			})
	}

	useEffect(() => {
		if (user) {
			setUserData(user)
		}
	}, [user])

	const combinedError = userError || error

	if (loading) return <div>Загрузка...</div>

	return (
		<div>
			{combinedError && <div>Ошибка: {combinedError}</div>}
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					name='login'
					placeholder='Логин'
					onChange={handleChange}
					value={userData.login}
					required
				/>
				<input
					type='text'
					name='city'
					placeholder='Город'
					onChange={handleChange}
					value={userData.city}
					required
				/>
				<button type='submit'>Изменить профиль</button>
			</form>
			<p>
				<Link to={`/users/${id}`}>К профилю</Link>
			</p>
		</div>
	)
}

export default EditUser
