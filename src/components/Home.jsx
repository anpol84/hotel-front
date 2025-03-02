import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { validateToken } from '../api'
import HotelCarousel from './HotelCarousel'
import HotelSearch from './HotelSearch'
import Navbar from './Navbar'

const Home = () => {
	const [user, setUser] = useState({ role: [], id: null, login: 'Гость' })
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const token = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))

		if (token) {
			const tokenValue = token.split('=')[1]
			validateToken({ token: tokenValue })
				.then(response => {
					if (response.data.isValid) {
						const decodedToken = jwtDecode(tokenValue)
						setUser({
							login: decodedToken.username,
							role: decodedToken.role,
							id: decodedToken.user_id,
						})
					}
				})
				.catch(() =>
					setUser({
						login: 'Гость',
					})
				)
				.finally(() => setLoading(false))
		} else {
			setLoading(false)
		}
	}, [])

	if (loading) return <div>Загрузка...</div>

	return (
		<section>
			<section className='container'>
				<Navbar userRole={user.role} id={user.id} />
				<HotelSearch />
				<HotelCarousel />
			</section>
		</section>
	)
}

export default Home
