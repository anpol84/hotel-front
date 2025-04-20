import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	addFavouriteHotel,
	deleteFavouriteHotel,
	getFavouriteHotels,
} from '../api'
import useUser from '../hooks/UseUser'
import styles from './FavouriteHotels.module.css'
import HotelCard from './HotelCard'
import Navbar from './Navbar'
import Paginator from './Paginator'

const FavouriteHotels = () => {
	const { id } = useParams()
	const { user, error: userError, token } = useUser(id)
	const [data, setData] = useState([])
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [hotelsPerPage] = useState(20)
	const [searchQuery, setSearchQuery] = useState('')
	const [roles, setRoles] = useState(false)

	useEffect(() => {
		setIsLoading(true)
		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
		let tokenValue
		if (tokenCookie) {
			tokenValue = tokenCookie.split('=')[1]
			const decodedToken = jwtDecode(tokenValue)
			setRoles(decodedToken.role)
		}
		getFavouriteHotels(id, tokenValue)
			.then(data => {
				setData(data.data.hotels)
				setIsLoading(false)
			})
			.catch(error => {
				setError(error.response.data.message)
				setIsLoading(false)
			})
	}, [])

	if (isLoading) {
		return <div>Loading rooms........</div>
	}

	const handleChangeFavourite = hotelId => {
		setData(prevData => prevData.filter(prevData => prevData.id != hotelId))
	}

	const handleFavourite = hotel => {
		if (!token) {
			navigate('/login')
		}
		const decodedToken = jwtDecode(token)
		const user = {
			login: decodedToken.username,
			role: decodedToken.role,
			id: decodedToken.user_id,
		}
		if (hotel.isFavourite) {
			deleteFavouriteHotel({ hotelId: hotel.id }, user.id, token).then(
				() => handleChangeFavourite(hotel.id)
			)
		} else {
			addFavouriteHotel({ hotelId: hotel.id }, user.id, token).then(() =>
				handleChangeFavourite(hotel.id)
			)
		}
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
					У вас не добавлено отелей в избранное, ознакомьтесь с нашими
					лучшими отелями!
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
					token={token}
					onChangeFavourite={handleChangeFavourite}
				/>
			))
	}

	return (
		<section>
			{user != null && <Navbar userRole={roles} id={user.id} />}
			{error && (
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

					<p className={styles.errorText}>{error}</p>
				</div>
			)}
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
			</div>
		</section>
	)
}

export default FavouriteHotels
