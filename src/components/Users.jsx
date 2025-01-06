import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteUser, getUsers } from '../api'

const Users = () => {
	const [users, setUsers] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	const fetchUsers = () => {
		let token = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
		if (!token) {
			navigate('/login')
		} else {
			token = token.split('=')[1]
			getUsers(token)
				.then(response => {
					console.log(response)
					setUsers(response.data.users)
				})
				.catch(() => navigate('/login'))
		}
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

	const handleSearchChange = event => {
		setSearchQuery(event.target.value)
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	const filteredUsers = users.filter(user =>
		user.login.toLowerCase().includes(searchQuery.toLowerCase())
	)

	return (
		<div>
			<h1>Users List</h1>
			{error && <p style={{ color: 'red' }}>{error}</p>}

			<input
				type='text'
				placeholder='Поиск по логину'
				value={searchQuery}
				onChange={handleSearchChange}
			/>

			<ul>
				{filteredUsers.map(user => (
					<li key={user.id}>
						{user.login}
						<button onClick={() => handleDelete(user.id)}>
							Delete
						</button>
						<Link to={`/users/${user.id}/edit}`}>Изменить</Link>
						<Link to={`/users/${user.id}`}>Посмотреть</Link>
					</li>
				))}
			</ul>
			<Link to='/'>На главную</Link>
		</div>
	)
}

export default Users
