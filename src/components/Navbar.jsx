import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ userRole, id }) => {
	const handleLogout = () => {
		document.cookie =
			'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

		window.location.reload()
	}

	return (
		<nav>
			<ul>
				{userRole.indexOf('ROLE_USER') === -1 &&
					userRole.indexOf('ROLE_ADMIN') === -1 && (
						<li>
							<Link to='/login'>Вход</Link>
						</li>
					)}
				{userRole.indexOf('ROLE_ADMIN') !== -1 && (
					<div>
						<li>
							<Link to='/users'>Все пользователи</Link>
						</li>
					</div>
				)}
				{(userRole.indexOf('ROLE_USER') !== -1 ||
					userRole.indexOf('ROLE_ADMIN') !== -1) && (
					<li>
						<button onClick={handleLogout}>Выход</button>
					</li>
				)}
				{id != null && (
					<li>
						<Link to={`/users/${id}`}>Мой профиль</Link>
					</li>
				)}
			</ul>
		</nav>
	)
}

export default Navbar
