import React, { useEffect, useState } from 'react'
import { Card, Carousel, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getHotels } from '../api'

const HotelCarousel = () => {
	const [hotels, setHotels] = useState([
		{ id: '', name: '', city: '', imageUrl: '', avgRate: '' },
	])
	const [errorMessage, setErrorMessage] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	useEffect(() => {
		setIsLoading(true)
		getHotels()
			.then(data => {
				setHotels(data.data.hotels)
				setIsLoading(false)
			})
			.catch(error => {
				setErrorMessage(error.message)
				setIsLoading(false)
			})
	}, [])

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
													<Link
														to={`/hotels/${hotel.id}`}
													>
														<Card.Img
															variant='top'
															src={`${hotel.imageUrl}`}
															alt='Hotel Photo'
															className='w-100'
															style={{
																height: '200px',
															}}
														/>
													</Link>
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
