import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteUser, getUsers } from '../api'

const Users = () => {
	const [users, setUsers] = useState([])
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	const fetchUsers = () => {
		const token = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
			.split('=')[1]
		if (!token) {
			navigate('/login')
		}
		getUsers(token)
			.then(response => {
				console.log(response)
				setUsers(response.data.users)
			})
			.catch(() => navigate('/login'))
	}

	const handleDelete = userId => {
		const token = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
			.split('=')[1]
		if (!token) {
			navigate('/login')
		}

		deleteUser({ id: userId, token: token })
			.then(() => {
				setUsers(users.filter(user => user.id !== userId))
			})
			.catch(err => {
				setError(
					err.response
						? err.response.data.message
						: 'Failed to delete user'
				)
			})
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	return (
		<div>
			<h1>Users List</h1>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<ul>
				{users.map(user => (
					<li key={user.id}>
						{user.login}
						<button onClick={() => handleDelete(user.id)}>
							Delete
						</button>
						<Link to={`/users/${user.id}/edit`}>Изменить</Link>
						<Link to={`/users/${user.id}`}>Посмотреть</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Users
