import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import {
	addFavouriteHotel,
	deleteFavouriteHotel,
	getFavouriteHotels,
} from '../api'
import useUser from '../hooks/useUser'
import HotelCard from './HotelCard'
import Paginator from './Paginator'

const FavouriteHotels = () => {
	const { id } = useParams()
	const { user, error: userError, token } = useUser(id)
	const [data, setData] = useState([])
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [hotelsPerPage] = useState(20)
	const [searchQuery, setSearchQuery] = useState('')

	useEffect(() => {
		setIsLoading(true)
		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
		let tokenValue
		if (tokenCookie) {
			tokenValue = tokenCookie.split('=')[1]
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
	const combinedError = userError || error
	if (isLoading) {
		return <div>Loading rooms........</div>
	}
	if (combinedError) {
		return <div className='text-danger'>Error : {error}</div>
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
		<section className='container'>
			<Container>
				<Row>
					<Col md={6} className='mb-3 mb-md-0'>
						<input
							type='text'
							placeholder='Поиск по названию'
							value={searchQuery}
							onChange={handleSearchChange}
						/>
					</Col>
				</Row>

				<Row>
					<Col
						md={6}
						className='d-flex align-items-center justify-content-end'
					>
						<Paginator
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageNumber}
						/>
					</Col>
				</Row>
				<Row>{renderHotels()}</Row>
				<Row>
					<Col
						md={6}
						className='d-flex align-items-center justify-content-end'
					>
						<Paginator
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageNumber}
						/>
					</Col>
				</Row>
			</Container>
		</section>
	)
}

export default FavouriteHotels
