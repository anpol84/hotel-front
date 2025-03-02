import { jwtDecode } from 'jwt-decode'
import { React, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
	addFavouriteHotel,
	deleteFavouriteHotel,
	deleteHotel,
	deleteHotelFeedback,
	getHotel,
	getHotelFeedbacks,
	validateAdmin,
} from '../api.js'

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

	return (
		<div className='container'>
			{errorMessage && <p className='text-danger'>{errorMessage}</p>}
			{hotel ? (
				<div
					className='card p-5 mt-5'
					style={{ backgroundColor: 'whitesmoke' }}
				>
					<h4 className='card-title text-center'>
						Hotel Information
					</h4>
					<div className='card-body'>
						<div className='col-md-10 mx-auto'>
							<div className='card mb-3 shadow'>
								<div className='col-md-12'>
									<div className='d-flex justify-content-center align-items-center mb-4 mt-4'>
										<div style={{ position: 'relative' }}>
											<img
												src={`${hotel.imageUrl}`}
												alt='Hotel'
												style={{
													width: '300px',
													height: '300px',
													objectFit: 'cover',
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
									</div>
								</div>
								<div className='row g-0'>
									<div className='col-md-10'>
										<div className='card-body'>
											<div className='form-group row'>
												<label className='col-md-2 col-form-label fw-bold'>
													Name:
												</label>
												<div className='col-md-10'>
													<p
														className='card-text'
														style={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															height: '100%',
														}}
													>
														{hotel.name}
													</p>
												</div>
											</div>
											<hr />
											<div className='form-group row'>
												<label className='col-md-4 col-form-label fw-bold'>
													City:
												</label>
												<div className='col-md-6'>
													<p
														className='card-text'
														style={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															height: '100%',
														}}
													>
														{hotel.city}
													</p>
												</div>
											</div>
											<hr />
											<div className='form-group row'>
												<label className='col-md-4 col-form-label fw-bold'>
													Stars:
												</label>
												<div className='col-md-6'>
													<p
														className='card-text'
														style={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															height: '100%',
														}}
													>
														{hotel.stars}
													</p>
												</div>
											</div>
											<hr />
											<div className='form-group row'>
												<label className='col-md-4 col-form-label fw-bold'>
													Minimal price for the room:
												</label>
												<div className='col-md-6'>
													<p
														className='card-text'
														style={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															height: '100%',
														}}
													>
														{hotel.minPrice}
													</p>
												</div>
											</div>
											<hr />
											<div className='form-group row'>
												<label className='col-md-4 col-form-label fw-bold'>
													Maximum price for the room:
												</label>
												<div className='col-md-6'>
													<p
														className='card-text'
														style={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															height: '100%',
														}}
													>
														{hotel.maxPrice}
													</p>
												</div>
											</div>
											<hr />
											<div className='form-group row'>
												<label className='col-md-4 col-form-label fw-bold'>
													Avg Rate:
												</label>
												<div className='col-md-6'>
													<p
														className='card-text'
														style={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															height: '100%',
														}}
													>
														{hotel.avgRate}
													</p>
												</div>
											</div>
											<hr />
											<div className='form-group row'>
												<label className='col-md-4 col-form-label fw-bold'>
													Additions:
												</label>
												<div className='col-md-6'>
													<p
														className='card-text'
														style={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															height: '100%',
														}}
													>
														{hotel.additions}
													</p>
												</div>
											</div>
											<hr />
											<div className='form-group row'>
												<label className='col-md-4 col-form-label fw-bold'>
													Positions:
												</label>
												<div className='col-md-6'>
													<p
														className='card-text'
														style={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															height: '100%',
														}}
													>
														{hotel.positions}
													</p>
												</div>
											</div>
											<hr />
											<div className='form-group row'>
												<label className='col-md-4 col-form-label fw-bold'>
													Rooms for views:
												</label>
												<div className='col-md-6'>
													<p
														className='card-text'
														style={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															height: '100%',
															flexDirection:
																'column',
														}}
													>
														{hotel.roomViews.map(
															(room, index) => (
																<span
																	key={index}
																>
																	{room.type}{' '}
																	:{' '}
																	{room.price}{' '}
																	руб.
																</span>
															)
														)}
													</p>
												</div>
											</div>
											<hr />
											<div className='form-group row'>
												<label className='col-md-4 col-form-label fw-bold'>
													Room for types:
												</label>
												<div className='col-md-6'>
													<p
														className='card-text'
														style={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															height: '100%',
															flexDirection:
																'column',
														}}
													>
														{hotel.roomTypes.map(
															(room, index) => (
																<span
																	key={index}
																>
																	{room.type}{' '}
																	:{' '}
																	{room.price}{' '}
																	руб.
																</span>
															)
														)}
													</p>
												</div>
											</div>
											<hr />
											<div className='form-group row'>
												<label className='col-md-4 col-form-label fw-bold'>
													Room for peoples:
												</label>
												<div className='col-md-6'>
													<p
														className='card-text'
														style={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															height: '100%',
															flexDirection:
																'column',
														}}
													>
														{hotel.roomPeople.map(
															(room, index) => (
																<span
																	key={index}
																>
																	{room.type}{' '}
																	:{' '}
																	{room.price}{' '}
																	руб.
																</span>
															)
														)}
													</p>
												</div>
											</div>
											<hr />
										</div>
									</div>
								</div>
							</div>

							<div className='d-flex justify-content-center'>
								<div className='mx-2'>
									<Link
										to={`/`}
										className='btn btn-outline-info btn'
									>
										На главную
									</Link>
								</div>
								{isAdmin && (
									<>
										<div className='mx-2'>
											<button
												className='btn btn-danger btn'
												onClick={handleDelete}
											>
												Close hotel
											</button>
										</div>
										<div className='mx-2'>
											<button
												className='btn btn-warning btn'
												onClick={handleEdit}
											>
												Edit hotel
											</button>
										</div>
									</>
								)}
							</div>
						</div>
					</div>
					<div
						className='mt-4'
						style={{
							border: '1px solid #ccc',
							padding: '15px',
							margin: '10px',
							borderRadius: '5px',
						}}
					>
						<h5>Отзывы на отель</h5>
						{!haveFeedback && (
							<button
								className='btn btn-info btn mb-2'
								onClick={handleCreateFeedback}
							>
								Добавить отзыв
							</button>
						)}
						{feedbacks && feedbacks.length > 0 ? (
							feedbacks.map((feedback, index) => (
								<div
									key={index}
									className='review-card mb-3 p-3 border rounded'
								>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
										}}
									>
										<div>{feedback.userLogin}</div>
										<div>{feedback.createdAt}</div>
									</div>
									<div style={{ marginTop: '10px' }}>
										{feedback.body}
									</div>
									<div
										style={{
											marginTop: '10px',
											fontWeight: 'bold',
										}}
									>
										Оценка: {feedback.mark}/5
									</div>
									{(isAdmin ||
										user.login === feedback.userLogin) && (
										<div
											style={{
												display: 'flex',
												justifyContent: 'center',
												marginTop: '10px',
											}}
										>
											<button
												className='btn btn-danger btn-sm'
												onClick={e => {
													e.preventDefault()
													handleDeleteFeedback(
														e,
														feedback.id,
														feedback.userLogin
													)
												}}
											>
												Удалить отзыв
											</button>
											<button
												className='btn btn-warning btn-sm'
												onClick={e =>
													handleEditFeedback(
														e,
														feedback.id
													)
												}
												style={{ marginLeft: '10px' }}
											>
												Редактировать отзыв
											</button>
										</div>
									)}
								</div>
							))
						) : (
							<p>Нет отзывов на этот отель.</p>
						)}
					</div>
				</div>
			) : (
				<p>Loading user data...</p>
			)}
		</div>
	)
}

export default Hotel
