import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { validateAdmin, validateToken } from '../api'
import styles from './GptResponse.module.css'
import HotelCard from './HotelCard'
import Navbar from './Navbar'
import Paginator from './Paginator'

const GptResponse = () => {
	const location = useLocation()
	const [data, setData] = useState(location.state.hotels)
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [hotelsPerPage] = useState(20)
	const [token, setToken] = useState('')
	const [searchQuery, setSearchQuery] = useState('')
	const [isAdmin, setIsAdmin] = useState(false)
	const [user, setUser] = useState({ role: [], id: null, login: 'Гость' })
	const notFoundHotels = location.state.isError

	useEffect(() => {
		setIsLoading(true)
		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
		if (tokenCookie) {
			const tokenValue = tokenCookie.split('=')[1]
			validateToken({ token: tokenValue }).then(response => {
				if (response.data.isValid == false) {
					navigate('/login')
				}
			})
		} else {
			navigate('/login')
		}

		if (tokenCookie) {
			const tokenValue = tokenCookie.split('=')[1]

			validateAdmin({ token: tokenValue })
				.then(response => {
					setIsAdmin(response.data.isValid)
					setToken(tokenValue)
					const decodedToken = jwtDecode(tokenValue)
					setUser({
						login: decodedToken.username,
						role: decodedToken.role,
						id: decodedToken.user_id,
					})
				})
				.catch(err => {
					setIsAdmin(false)
				})
		}
		setIsLoading(false)
	}, [])

	const handleDeleteHotel = hotelId => {
		setData(prevData => prevData.filter(hotel => hotel.id !== hotelId))
	}

	const handleChangeFavourite = hotelId => {
		setData(prevData =>
			prevData.map(hotel =>
				hotel.id === hotelId
					? { ...hotel, isFavourite: !hotel.isFavourite }
					: hotel
			)
		)
	}

	if (isLoading) {
		return <div>Загрузка........</div>
	}
	if (error) {
		return <div className='text-danger'>Error : {error}</div>
	}

	const handlePageNumber = pageNumber => {
		setCurrentPage(pageNumber)
	}

	const handleSearchChange = event => {
		setSearchQuery(event.target.value)
	}

	const filteredData = data.filter(hotel =>
		hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const totalPages = Math.ceil(filteredData.length / hotelsPerPage)

	const renderHotels = () => {
		if (filteredData.length == 0) {
			return (
				<p className={styles.hotelsNotExists}>
					Подходящего отеля не существует, но вы можете выбрать любой
					другой!
				</p>
			)
		}
		const startIndex = (currentPage - 1) * hotelsPerPage
		const endIndex = startIndex + hotelsPerPage
		return filteredData
			.slice(startIndex, endIndex)
			.map(hotel => (
				<HotelCard
					key={hotel.id}
					hotel={hotel}
					isAdmin={isAdmin}
					token={token}
					onDelete={handleDeleteHotel}
					onChangeFavourite={handleChangeFavourite}
				/>
			))
	}

	return (
		<section>
			<Navbar userRole={user.role} id={user.id} />
			<div className={styles.root}>
				<div className={styles.searchHeader}>
					<input
						type='text'
						placeholder='Поиск по названию'
						value={searchQuery}
						onChange={handleSearchChange}
						className={styles.search}
					/>
				</div>
				<div className={styles.headerText}>
					{notFoundHotels && (
						<p>
							К сожалению, подходящих отелей найдено не было, но
							вот наши лучшие отели!
						</p>
					)}
					{!notFoundHotels && <p>Результаты поиска</p>}
				</div>
				<Paginator
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageNumber}
				/>
				<div className={styles.hotels}>{renderHotels()}</div>
				<Paginator
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageNumber}
				/>
				<br />
				<br />
			</div>
		</section>
	)
}

export default GptResponse
