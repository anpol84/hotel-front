import { jwtDecode } from 'jwt-decode'
import { React, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
	addFavouriteHotel,
	deleteFavouriteHotel,
	deleteHotel,
	deleteHotelFeedback,
	getHotel,
	getHotelFeedbacks,
	validateAdmin,
} from '../api.js'
import FeedbackCard from './FeedbackCard.jsx'
import FeedbackModal from './FeedbackModal.jsx'
import styles from './Hotel.module.css'
import Navbar from './Navbar'

const Hotel = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [errorMessage, setErrorMessage] = useState('')
	const [token, setToken] = useState('')
	const [hotel, setHotel] = useState(null)
	const [feedbacks, setFeedbacks] = useState([])
	const [isAdmin, setIsAdmin] = useState(false)
	const [user, setUser] = useState(null)
	const [haveFeedback, setHaveFeedback] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [currentFeedback, setCurrentFeedback] = useState(null)

	const handleModalClick = feedback => {
		setCurrentFeedback(feedback)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setCurrentFeedback(null)
	}

	const positionDict = {
		CENTER: 'В центре',
		PARK: 'Рядом с парком',
		SEA: 'Рядом с море',
		AIRPORT: 'Рядом с аэропортом',
		RAILWAY: 'Рядом с вокзалом',
	}

	const additionDict = {
		WIFI: 'Wi-Fi',
		PARKING: 'Парковка',
		RESTAURANT: 'Ресторан',
		BEACH: 'Пляж',
		POOL: 'Бассейн',
		AQUA_PARK: 'Аквапарк',
		SAUNA: 'Сауна',
		FITNESS: 'Тренажерный зал',
	}

	const roomPeopleDict = {
		SINGLE: 'На одного',
		DOUBLE: 'На двоих с 2 кроватями',
		TWIN: 'На двоих с 1 кроватью',
		DBL_EXB: 'На двоих с ребенком',
		TRIPLE: 'На троих',
	}

	const roomViewsDict = {
		SEA_VIEW: 'На море',
		CITY_VIEW: 'На город',
		GARDEN_VIEW: 'На природу',
		POOL_VIEW: 'На бассейн',
	}

	const roomTypesDict = {
		STANDARD: 'Стандартный',
		SUPERIOR: 'Стандартный+',
		STUDIO: 'Студия',
		FAMILY_ROOM: 'С кухней',
		FAMILY_STUDIO: 'Студия с кухней',
		DELUX: 'Делюкс',
		SUITE: 'Премиум',
		PRESIDENTIAL_SUITE: 'Президентский',
		HONEYMOON_SUITE: 'Для молодоженов',
	}

	useEffect(() => {
		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))

		let tokenValue
		let user
		if (tokenCookie) {
			tokenValue = tokenCookie.split('=')[1]
			setToken(tokenValue)
			const decodedToken = jwtDecode(tokenValue)
			user = {
				login: decodedToken.username,
				role: decodedToken.role,
				id: decodedToken.user_id,
			}
			setUser(user)
		}

		getHotel({ id: id }, tokenValue)
			.then(response => {
				setHotel(response.data)
			})
			.catch(err => {
				setErrorMessage(err.response.data.message)
			})
		getHotelFeedbacks(id)
			.then(response => {
				setFeedbacks(response.data.hotels)
				if (user != null) {
					setHaveFeedback(
						response.data.hotels
							.map(hotel => hotel.userLogin)
							.some(login => login === user.login)
					)
				}
			})
			.catch(err => {
				setErrorMessage(err.response.data.message)
			})

		if (tokenValue) {
			validateAdmin({ token: tokenValue })
				.then(response => {
					setIsAdmin(response.data.isValid)
				})
				.catch(err => {
					setIsAdmin(false)
				})
		}
	}, [id])

	const handleChangeFavourite = () => {
		setHotel(prevHotel => ({
			...prevHotel,
			isFavourite: !prevHotel.isFavourite,
		}))
	}

	const handleFavourite = () => {
		if (!token) {
			navigate('/login')
		}
		if (hotel.isFavourite) {
			deleteFavouriteHotel({ hotelId: hotel.id }, user.id, token).then(
				() => handleChangeFavourite()
			)
		} else {
			addFavouriteHotel({ hotelId: hotel.id }, user.id, token).then(() =>
				handleChangeFavourite()
			)
		}
	}

	const handleDelete = e => {
		e.preventDefault()
		deleteHotel(id, token)
			.then(() => navigate('/hotels'))
			.catch(err => {
				setErrorMessage(
					err.response
						? err.response.data.message
						: 'Ошибка удаления отелей'
				)
			})
	}

	const handleDeleteFeedback = (e, id, userLogin) => {
		e.preventDefault()
		deleteHotelFeedback(id, token)
			.then(() => {
				setFeedbacks(prevData =>
					prevData.filter(feedback => feedback.id !== id)
				)
				if (userLogin == user.login) {
					setHaveFeedback(false)
				}
			})
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
		navigate(`/hotels/${id}/edit`)
	}

	const handleCreateFeedback = e => {
		e.preventDefault()
		navigate(`/hotels/${id}/feedback`)
	}

	const handleEditFeedback = (e, feedbackId) => {
		e.preventDefault()
		navigate(`/feedback/${feedbackId}`, { state: { id: id } })
	}
	const renderStars = () => {
		const rate = Math.floor(hotel.stars)
		const stars = []

		for (let i = 0; i < rate; i++) {
			stars.push(
				<svg
					key={i}
					width='40'
					height='36'
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

		return <div style={{ marginTop: '72%', marginLeft: '5%' }}>{stars}</div>
	}

	return (
		<div>
			{user && <Navbar userRole={user.role} id={user.id} />}
			{errorMessage && (
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

					<p className={styles.errorText}>{errorMessage}</p>
				</div>
			)}
			{isAdmin && (
				<div className={styles.buttons}>
					<button className={styles.editButton} onClick={handleEdit}>
						Редактировать карточку
					</button>
					<button
						className={styles.deleteButton}
						onClick={handleDelete}
					>
						Удалить карточку
					</button>
				</div>
			)}
			{hotel ? (
				<div
					style={{
						display: 'block',
						margin: '0 auto',
						width: '100%',
					}}
				>
					<div className={styles.card}>
						<div
							style={{
								backgroundImage: `url(${hotel.imageUrl})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								width: '474px',
								height: '474px',
								borderRadius: '19px',
								marginLeft: '4%',
								marginTop: '4%',
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
									marginLeft: '82%',
									marginTop: '4%',
									width: '69px',
									height: '61px',
									cursor: 'pointer',
								}}
								onClick={handleFavourite}
								alt='Unliked'
							/>
							{renderStars()}
						</div>
						<div className={styles.content}>
							<p className={styles.hotelName}>{hotel.name}</p>
							<div>
								<span className={styles.header}>Город: </span>
								<span className={styles.text}>
									{hotel.city}
								</span>
							</div>
							<div>
								<span className={styles.header}>
									Минимальная стоимость комнаты:{' '}
								</span>
								<span className={styles.text}>
									{hotel.minPrice} руб.
								</span>
							</div>
							<div>
								<span className={styles.header}>
									Расположение:{' '}
								</span>
								<span className={styles.text}>
									{hotel.positions
										.map(pos => positionDict[pos])
										.join(', ')}
								</span>
							</div>
							<div>
								<span className={styles.header}>
									Дополнения:{' '}
								</span>
								<span className={styles.text}>
									{hotel.additions
										.map(add => additionDict[add])
										.join(', ')}
								</span>
							</div>
							<div>
								<span className={styles.header}>
									Комнаты с красивыми видами:{' '}
								</span>
								{hotel.roomViews.map(view => (
									<div>
										<span className={styles.text}>
											{roomViewsDict[view.type]}{' '}
											{view.price} руб.
										</span>
									</div>
								))}
							</div>
							<div>
								<span className={styles.header}>
									Типы комнат:{' '}
								</span>
								{hotel.roomTypes.map(type => (
									<div>
										<span className={styles.text}>
											{roomTypesDict[type.type]}{' '}
											{type.price} руб.
										</span>
									</div>
								))}
							</div>
							<div>
								<span className={styles.header}>
									Комната для n людей:{' '}
								</span>
								{hotel.roomPeople.map(type => (
									<div>
										<span className={styles.text}>
											{roomPeopleDict[type.type]}{' '}
											{type.price} руб.
										</span>
									</div>
								))}
							</div>
							<span className={styles.header}>
								Средний рейтинг:{' '}
							</span>
							<span className={styles.text}>
								{hotel.avgRate} / 5
							</span>
						</div>
					</div>
					<div>
						<div className={styles.feedbackHead}>
							<p className={styles.feedbackHeader}>Отзывы</p>
							{!haveFeedback && (
								<button
									className={styles.addFeedback}
									onClick={handleCreateFeedback}
								>
									Добавить отзыв
								</button>
							)}
						</div>
						<div className={styles.cards}>
							{feedbacks && feedbacks.length > 0 ? (
								feedbacks.map((feedback, index) => (
									<FeedbackCard
										key={index}
										feedback={feedback}
										user={user}
										isAdmin={isAdmin}
										handleDeleteFeedback={
											handleDeleteFeedback
										}
										handleEditFeedback={handleEditFeedback}
										handleModalClick={handleModalClick}
									/>
								))
							) : (
								<div
									style={{
										marginLeft: '25%',
										marginTop: '-4%',
									}}
								>
									<p className={styles.zeroFeedback}>
										Никто еще не написал отзыв на этот
										отель.
									</p>
									<p className={styles.zeroFeedback}>
										Будьте первым, кто займется этим
										прекрасным делом!
									</p>
								</div>
							)}
						</div>
						<br />
						<br />
					</div>
					{isModalOpen && (
						<div
							className={styles.modalOverlay}
							onClick={closeModal}
						>
							<FeedbackModal
								feedback={currentFeedback}
								closeModal={closeModal}
								onClick={e => e.stopPropagation()}
							/>
						</div>
					)}
				</div>
			) : (
				<p>Загрузка</p>
			)}
		</div>
	)
}

export default Hotel
