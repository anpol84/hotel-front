import { React, useState } from 'react'
import { Card, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { deleteHotel } from '../api'

const HotelCard = ({ hotel, isAdmin, token, onDelete }) => {
	const navigate = useNavigate()
	const [errorMessage, setErrorMessage] = useState('')
	const handleDelete = e => {
		e.preventDefault()
		deleteHotel(hotel.id, token)
			.then(() => onDelete(hotel.id))
			.catch(err => {
				setErrorMessage(
					err.response
						? err.response.data.message
						: 'Ошибка удаления отелей'
				)
			})
	}

	const handleEdit = e => {
		e.preventDefault()
		navigate(`/hotels/${hotel.id}/edit`)
	}
	return (
		<Col key={hotel.id} className='mb-4' xs={12}>
			<Card>
				<Card.Body className='d-flex flex-wrap align-items-center'>
					<div className='flex-shrink-0 mr-3 mb-3 mb-md-0'>
						<Link to={`/book-room/${hotel.id}`}>
							<Card.Img
								variant='top'
								src={`${hotel.imageUrl}`}
								alt='Hotel Photo'
								style={{
									width: '100%',
									maxWidth: '200px',
									height: 'auto',
								}}
							></Card.Img>
						</Link>
					</div>
					<div className='flex-grow-1 ml-3 px-5'>
						<Card.Title className='hotel-color'>
							{hotel.name}
						</Card.Title>
						<Card.Title className='room-price'>
							{hotel.city}
						</Card.Title>
						<Card.Title className='room-price'>
							Средний рейтинг: {hotel.avgRate}
						</Card.Title>
					</div>
					<>
						{isAdmin && (
							<div className='mx-2'>
								<button
									className='btn btn-danger btn'
									onClick={handleDelete}
								>
									Close hotel
								</button>
							</div>
						)}
						{isAdmin && (
							<div className='mx-2'>
								<button
									className='btn btn-warning btn'
									onClick={handleEdit}
								>
									Edit hotel
								</button>
							</div>
						)}
						<div className='mx-2'>
							<Link
								to={`/hotels/${hotel.id}`}
								className='btn btn-hotel btn'
							>
								Подробнее
							</Link>
						</div>
					</>
				</Card.Body>
			</Card>
		</Col>
	)
}

export default HotelCard
