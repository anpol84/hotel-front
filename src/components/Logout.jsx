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
					Profile
				</Link>
			</li>
			<li>
				<hr className='dropdown-divider' />
			</li>
			<button className='dropdown-item' onClick={handleLogout}>
				Logout
			</button>
		</>
	)
}

export default Logout
