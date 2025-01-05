import { React, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteUser } from '../api'
import useUser from '../hooks/useUser'

const UserPage = () => {
	const { id } = useParams()
	const { user, loading, error: userError, token } = useUser(id)
	const navigate = useNavigate()
	const [error, setError] = useState(null)

	const handleDelete = async e => {
		e.preventDefault()
		try {
			await deleteUser({ id: id, token: token })
			navigate('/login')
		} catch (err) {
			console.error('Ошибка удаления:', err)
			setError(
				err.response
					? err.response.data.message
					: 'Ошибка изменения данных пользователя'
			)
		}
	}
	const combinedError = userError || error
	if (loading) return <div>Загрузка...</div>
	if (combinedError) return <div>Ошибка: {combinedError}</div>

	return (
		<div>
			<h1>Профиль пользователя</h1>
			<p>login: {user.login}</p>
			<p>Город: {user.city}</p>
			<button onClick={handleDelete}>Удалить профиль</button>
			<Link to={`/users/${id}/edit`}>Изменить профиль</Link>
			<Link to='/'>На главную</Link>
		</div>
	)
}

export default UserPage
