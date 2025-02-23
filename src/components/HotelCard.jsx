import { jwtDecode } from 'jwt-decode'
import { React, useState } from 'react'
import { Card, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { addFavouriteHotel, deleteFavouriteHotel, deleteHotel } from '../api'

const HotelCard = ({ hotel, isAdmin, token, onDelete, onChangeFavourite }) => {
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
	const handleFavourite = () => {
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
				() => onChangeFavourite(hotel.id)
			)
		} else {
			addFavouriteHotel({ hotelId: hotel.id }, user.id, token).then(() =>
				onChangeFavourite(hotel.id)
			)
		}
	}
	return (
		<Col key={hotel.id} className='mb-4' xs={12} md={6} lg={3}>
			<Card>
				<div style={{ position: 'relative' }}>
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
							position: 'absolute',
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
							onClick={handleFavourite}
							alt='Unliked'
						/>
					</div>
				</div>
				<Card.Body>
					<Card.Title className='hotel-color'>
						{hotel.name}
					</Card.Title>
					<Card.Title className='room-price'>{hotel.city}</Card.Title>
					<Card.Title className='room-price'>
						Средний рейтинг: {hotel.avgRate}
					</Card.Title>
					<>
						<div className='flex-shrink-0 m-1'>
							<Link
								to={`/hotels/${hotel.id}`}
								className='btn btn-hotel btn-sm'
								style={{ width: '95px' }}
							>
								Подробнее
							</Link>
						</div>
						{isAdmin && (
							<div className='flex-shrink-0 m-1'>
								<button
									className='btn btn-danger btn-sm'
									style={{ width: '95px' }}
									onClick={handleDelete}
								>
									Close hotel
								</button>
							</div>
						)}
						{isAdmin && (
							<div className='flex-shrink-0 m-1'>
								<button
									className='btn btn-warning btn-sm'
									onClick={handleEdit}
									style={{ width: '95px' }}
								>
									Edit hotel
								</button>
							</div>
						)}
					</>
				</Card.Body>
			</Card>
		</Col>
	)
}

export default HotelCard
