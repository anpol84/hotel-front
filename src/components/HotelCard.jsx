import { jwtDecode } from 'jwt-decode'
import { React, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addFavouriteHotel, deleteFavouriteHotel, deleteHotel } from '../api'
import styles from './HotelCard.module.css'

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

	const renderStars = () => {
		const rate = Math.floor(hotel.stars)
		const stars = []

		for (let i = 0; i < rate; i++) {
			stars.push(
				<svg
					key={i}
					width='20'
					height='18'
					viewBox='0 0 20 18'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M10.3796 -3.05176e-05L12.6464 6.67308H19.9818L14.0473 10.7973L16.3141 17.4704L10.3796 13.3462L4.44509 17.4704L6.71187 10.7973L0.777356 6.67308H8.11281L10.3796 -3.05176e-05Z'
						fill='white'
					/>
				</svg>
			)
		}

		return <div style={{ marginTop: '49%', marginLeft: '5%' }}>{stars}</div>
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
		<div key={hotel.id} className={styles.card}>
			<div
				style={{
					backgroundImage: `url(${hotel.imageUrl})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					width: '42%',
					height: '80%',
					borderRadius: '19px',
					marginLeft: '5%',
					marginTop: '5%',
				}}
				className={styles.cardImage}
			>
				<img
					src={
						hotel.isFavourite
							? '/img/heart-liked.svg'
							: '/img/heart-unliked.svg'
					}
					style={{
						marginLeft: '75%',
						marginTop: '6%',
						width: '18%',
						cursor: 'pointer',
					}}
					onClick={handleFavourite}
					alt='Unliked'
				/>
				{renderStars()}
			</div>
			{isAdmin && (
				<svg
					width='32'
					height='32'
					viewBox='0 0 52 52'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					style={{
						marginLeft: '81%',
						marginTop: '-4%',
						position: 'absolute',
						cursor: 'pointer',
					}}
					onClick={handleEdit}
				>
					<circle
						cx='25.8408'
						cy='25.8408'
						r='25.8408'
						fill='#72A5FC'
					/>
					<path
						d='M27.0561 18.745L32.8938 24.5828L22.1114 35.3652L15.4946 37.5785C14.6081 37.8751 13.7643 37.0312 14.0603 36.1448L16.2736 29.5279L27.0561 18.745ZM28.5093 17.2917L31.199 14.602C32.0017 13.7993 33.3034 13.7993 34.1061 14.602L37.0368 17.5327C37.8395 18.3354 37.8395 19.6371 37.0368 20.4398L34.3471 23.1295L28.5093 17.2917Z'
						fill='white'
					/>
				</svg>
			)}
			{isAdmin && (
				<svg
					width='32'
					height='32'
					viewBox='0 0 52 52'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					style={{
						marginLeft: '92%',
						marginTop: '-4%',
						position: 'absolute',
						cursor: 'pointer',
					}}
					onClick={handleDelete}
				>
					<circle
						cx='25.8408'
						cy='25.8408'
						r='25.8408'
						fill='#F25454'
					/>
					<path
						d='M16.3652 16.3658L36.1765 36.1771M36.1765 16.3658L16.3652 36.1771'
						stroke='white'
						stroke-width='4'
						stroke-linecap='round'
						stroke-linejoin='round'
					/>
				</svg>
			)}

			<div className={styles.cardContent}>
				<p className={styles.hotelName}>{hotel.name}</p>
				<p className={styles.hotelCity}>{hotel.city}</p>
				<p className={styles.hotelPrice}>От {hotel.minPrice} руб</p>
				<Link to={`/hotels/${hotel.id}`}>
					<button className={styles.cardButton}>
						<p className={styles.buttonText}>Подробнее</p>
					</button>
				</Link>
			</div>
		</div>
	)
}

export default HotelCard
