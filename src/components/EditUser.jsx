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

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			await editUser(userData, id, token)
			navigate('/login')
		} catch (err) {
			setError(
				err.response
					? err.response.data.message
					: 'Ошибка изменения данных пользователя'
			)
		}
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
				<Link to={`/users/${id}`}>Назад</Link>
			</p>
		</div>
	)
}

export default EditUser
