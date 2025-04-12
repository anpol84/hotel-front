import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
const Logout = ({ id }) => {
	const navigate = useNavigate()

	const handleLogout = () => {
		document.cookie =
			'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

		navigate('/login', { state: { message: ' You have been logged out!' } })
	}

	return (
		<>
			<li>
				<Link className='dropdown-item' to={`/users/${id}`}>
					Профиль
				</Link>
				<Link className='dropdown-item' to={`/users/${id}/favourite`}>
					Избранное
				</Link>
			</li>
			<li>
				<hr className='dropdown-divider' />
			</li>
			<button className='dropdown-item' onClick={handleLogout}>
				Выйти
			</button>
		</>
	)
}

export default Logout
