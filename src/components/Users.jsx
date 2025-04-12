import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteUser, getUsers } from '../api'
import Navbar from './Navbar'
import Paginator from './Paginator'
import styles from './Users.module.css'

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
		<section>
			<Navbar userRole={user.role} id={user.id} />
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
			{isLoading ? (
				<p>Загрузка</p>
			) : (
				<>
					<section className={styles.root}>
						<div className={styles.header}>
							<p className={styles.headerTable}>Пользователи</p>
							<input
								className={styles.search}
								type='text'
								placeholder='Поиск по логину'
								value={searchQuery}
								onChange={handleSearchChange}
							/>
						</div>
						<table className={styles.table}>
							<thead className={styles.tableHeader}>
								<tr className='text-center'>
									<th>ID</th>
									<th>Логин</th>
									<th
										style={{
											display: 'flex',
											justifyContent: 'end',
											marginRight: '31px',
											fontSize: '16px',
											marginTop: '6px',
										}}
									>
										Действия
									</th>
								</tr>
							</thead>
							<tbody className={styles.tbody}>
								{currentUsers.map(user => (
									<tr key={user.id} className='text-center'>
										<td>{user.id}</td>
										<td>{user.login}</td>
										<td className={styles.icons}>
											<Link to={`/users/${user.id}`}>
												<span>
													<svg
														width='28'
														height='28'
														viewBox='0 0 31 31'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
														style={{
															marginRight: '5px',
															marginTop: '5px',
														}}
													>
														<circle
															cx='15.3222'
															cy='15.3222'
															r='15.3222'
															fill='#B0B0B0'
														/>
														<path
															fill-rule='evenodd'
															clip-rule='evenodd'
															d='M3 15.5047C10 5.00466 21.5 6.00466 27.5 15.5047C20.5 26.0047 10 25.5047 3 15.5047ZM15.5 21.0047C18.5376 21.0047 21 18.5422 21 15.5047C21 12.4671 18.5376 10.0047 15.5 10.0047C12.4624 10.0047 10 12.4671 10 15.5047C10 18.5422 12.4624 21.0047 15.5 21.0047Z'
															fill='white'
														/>
														<circle
															cx='15.5'
															cy='15.5046'
															r='3.5'
															fill='white'
														/>
													</svg>
												</span>
											</Link>
											<Link to={`/users/${user.id}/edit`}>
												<span>
													<svg
														width='28'
														height='28'
														viewBox='0 0 31 31'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
														style={{
															marginRight: '5px',
															marginTop: '5px',
														}}
													>
														<circle
															cx='15.3222'
															cy='15.3222'
															r='15.3222'
															fill='#72A5FC'
														/>
														<path
															d='M16.0443 11.1148L19.5058 14.5763L13.1124 20.9697L9.18894 22.2821C8.66332 22.4579 8.16298 21.9575 8.3385 21.4319L9.65088 17.5085L16.0443 11.1148ZM16.906 10.2531L18.5008 8.65824C18.9768 8.18228 19.7486 8.18228 20.2246 8.65824L21.9623 10.396C22.4383 10.8719 22.4383 11.6438 21.9623 12.1197L20.3675 13.7146L16.906 10.2531Z'
															fill='white'
														/>
													</svg>
												</span>
											</Link>

											<svg
												width='28'
												height='28'
												viewBox='0 0 31 31'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
												style={{
													cursor: 'pointer',
													marginRight: '17px',
													marginTop: '5px',
												}}
												onClick={() =>
													handleDelete(user.id)
												}
											>
												<circle
													cx='15.6777'
													cy='15.3222'
													r='15.3222'
													fill='#F25454'
												/>
												<path
													d='M10.0586 9.7041L21.8056 21.4511M21.8056 9.7041L10.0586 21.4511'
													stroke='white'
													stroke-width='2.37178'
													stroke-linecap='round'
													stroke-linejoin='round'
												/>
											</svg>
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
