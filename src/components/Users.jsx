import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { deleteUser, getUsers } from '../api'
import Navbar from './Navbar'
import Paginator from './Paginator'

const Users = () => {
	const [users, setUsers] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [usersPerPage] = useState(8)
	const [isLoading, setIsLoading] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [user, setUser] = useState({ role: [], id: null, login: 'Гость' })
	const navigate = useNavigate()

	const fetchUsers = () => {
		let token = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
		if (!token) {
			navigate('/login')
		} else {
			token = token.split('=')[1]
			setIsLoading(true)
			getUsers(token)
				.then(response => {
					setUsers(response.data.users)
					setIsLoading(false)
					const decodedToken = jwtDecode(token)
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
		}
	}

	const handlePaginationClick = pageNumber => {
		setCurrentPage(pageNumber)
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
				fetchUsers()
				setSuccessMessage(`User with id ${userId} was deleted`)
			})
			.catch(err => {
				setErrorMessage(
					err.response
						? err.response.data.message
						: 'Failed to delete user'
				)
			})
		setTimeout(() => {
			setSuccessMessage('')
			setErrorMessage('')
		}, 3000)
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

	const calculateTotalPages = (filteredUsers, usersPerPage, users) => {
		const totalUsers =
			filteredUsers.length > 0 ? filteredUsers.length : users.length
		return Math.ceil(totalUsers / usersPerPage)
	}

	const indexOfLastUser = currentPage * usersPerPage
	const indexOfFirstUser = indexOfLastUser - usersPerPage
	const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

	return (
		<section className='container'>
			<Navbar userRole={user.role} id={user.id} />
			<br />
			{errorMessage && <p className='text-danger'>{errorMessage}</p>}
			{successMessage && (
				<p className='alert alert-success'>{successMessage}</p>
			)}
			{isLoading ? (
				<p>Loading users</p>
			) : (
				<>
					<section className='mt-5 mb-5 container'>
						<input
							type='text'
							placeholder='Поиск по логину'
							value={searchQuery}
							onChange={handleSearchChange}
						/>
						<div className='d-flex justify-content-between mb-3 mt-5'>
							<h2>Users</h2>
						</div>
						<table className='table table-bordered table-hover'>
							<thead>
								<tr className='text-center'>
									<th>ID</th>
									<th>Login</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{currentUsers.map(user => (
									<tr key={user.id} className='text-center'>
										<td>{user.id}</td>
										<td>{user.login}</td>
										<td className='gap-2'>
											<Link to={`/users/${user.id}`}>
												<span className='btn btn-info btn-sm'>
													<FaEye />
												</span>
											</Link>
											<Link to={`/users/${user.id}/edit`}>
												<span className='btn btn-warning btn-sm'>
													<FaEdit />
												</span>
											</Link>
											<button
												className='btn btn-danger btn-sm'
												onClick={() =>
													handleDelete(user.id)
												}
											>
												<FaTrashAlt />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<Paginator
							currentPage={currentPage}
							totalPages={calculateTotalPages(
								filteredUsers,
								usersPerPage,
								users
							)}
							onPageChange={handlePaginationClick}
						/>
					</section>
				</>
			)}
		</section>
	)
}

export default Users
