import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logout from './Logout'

const Navbar = ({ userRole, id }) => {
	const [showAccount, setShowAccount] = useState(false)

	const handleAccountClick = () => {
		setShowAccount(!showAccount)
	}

	const isLoggedIn =
		userRole.indexOf('ROLE_USER') !== -1 ||
		userRole.indexOf('ROLE_ADMIN') !== -1

	return (
		<nav className='navbar navbar-expand-lg bg-body-tertiary px-5 shadow mt-5 sticky-top'>
			<div className='container-fluid'>
				<Link to={'/'} className='navbar-brand'>
					<span className='hotel-color'>Hotel krutoy</span>
				</Link>

				<button
					className='navbar-toggler'
					type='button'
					data-bs-toggle='collapse'
					data-bs-target='#navbarScroll'
					aria-controls='navbarScroll'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon'></span>
				</button>

				<div className='collapse navbar-collapse' id='navbarScroll'>
					<ul className='navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll'>
						<li className='nav-item'>
							<NavLink
								className='nav-link'
								aria-current='page'
								to={'/hotels'}
							>
								Hotels
							</NavLink>
						</li>

						{userRole.indexOf('ROLE_ADMIN') !== -1 && (
							<li className='nav-item'>
								<NavLink
									className='nav-link'
									aria-current='page'
									to={'/users'}
								>
									Users
								</NavLink>
							</li>
						)}
					</ul>

					<ul className='d-flex navbar-nav'>
						<li className='nav-item dropdown'>
							<a
								className={`nav-link dropdown-toggle ${
									showAccount ? 'show' : ''
								}`}
								href='#'
								role='button'
								data-bs-toggle='dropdown'
								aria-expanded='false'
								onClick={handleAccountClick}
							>
								{' '}
								Account
							</a>

							<ul
								className={`dropdown-menu ${
									showAccount ? 'show' : ''
								}`}
								aria-labelledby='navbarDropdown'
							>
								{isLoggedIn ? (
									<div>
										<Logout id={id} />
										<Link></Link>
									</div>
								) : (
									<li>
										<Link
											className='dropdown-item'
											to={'/login'}
										>
											Login
										</Link>
									</li>
								)}
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
