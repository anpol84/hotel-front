import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { Card, Carousel, Col, Container, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { addFavouriteHotel, deleteFavouriteHotel, getHotels } from '../api'

const HotelCarousel = () => {
	const [hotels, setHotels] = useState([
		{ id: '', name: '', city: '', imageUrl: '', avgRate: '' },
	])
	const [errorMessage, setErrorMessage] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [token, setToken] = useState('')
	const navigate = useNavigate()
	useEffect(() => {
		setIsLoading(true)
		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
		const tokenValue = tokenCookie ? tokenCookie.split('=')[1] : null
		setToken(tokenValue)
		getHotels(tokenValue)
			.then(data => {
				setHotels(data.data.hotels)
				setIsLoading(false)
			})
			.catch(error => {
				setErrorMessage(error.message)
				setIsLoading(false)
			})
	}, [])

	const handleChangeFavourite = hotelId => {
		setHotels(prevData =>
			prevData.map(hotel =>
				hotel.id === hotelId
					? { ...hotel, isFavourite: !hotel.isFavourite }
					: hotel
			)
		)
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

	if (isLoading) {
		return <div className='mt-5'>Loading hotels....</div>
	}
	if (errorMessage) {
		return (
			<div className=' text-danger mb-5 mt-5'>Error : {errorMessage}</div>
		)
	}

	return (
		<section className='bg-light mb-5 mt-5 shadow'>
			<Link to={'/hotels'} className='hotel-color text-center'>
				Browse all hotels
			</Link>

			<Container>
				<Carousel indicators={true}>
					{[...Array(Math.ceil(hotels.length / 4))].map(
						(_, index) => (
							<Carousel.Item key={index}>
								<Row>
									{hotels
										.slice(index * 4, index * 4 + 4)
										.map(hotel => (
											<Col
												key={hotel.id}
												className='mb-4'
												xs={12}
												md={6}
												lg={3}
											>
												<Card>
													<div
														style={{
															position:
																'relative',
														}}
													>
														<Card.Img
															variant='top'
															src={hotel.imageUrl}
															alt='Hotel Photo'
															className='w-100'
															style={{
																height: '200px',
															}}
														/>
														<div
															style={{
																position:
																	'absolute',
																top: '10px',
																right: '10px',
																cursor: 'pointer',
															}}
														>
															<img
																src={
																	hotel.isFavourite
																		? '/img/heart-liked.svg'
																		: '/img/heart-unliked.svg'
																}
																onClick={() =>
																	handleFavourite(
																		hotel
																	)
																}
																alt='Unliked'
															/>
														</div>
													</div>
													<Card.Body>
														<Card.Title className='hotel-color'>
															{hotel.name}
														</Card.Title>
														<Card.Title className='room-price'>
															{hotel.city}
														</Card.Title>
														<div className='flex-shrink-0'>
															<Link
																to={`/hotels/${hotel.id}`}
																className='btn btn-hotel btn-sm'
															>
																Подробнее
															</Link>
														</div>
													</Card.Body>
												</Card>
											</Col>
										))}
								</Row>
							</Carousel.Item>
						)
					)}
				</Carousel>
			</Container>
		</section>
	)
}

export default HotelCarousel
