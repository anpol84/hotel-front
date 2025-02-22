import { React, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteHotel, getHotel, validateAdmin } from '../api.js'

const Hotel = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [errorMessage, setErrorMessage] = useState('')
	const [token, setToken] = useState('')
	const [hotel, setHotel] = useState(null)
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		getHotel({ id: id })
			.then(response => {
				console.log(response.data)
				setHotel(response.data)
			})
			.catch(err => {
				setErrorMessage(err.response.data.message)
			})

		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))

		if (tokenCookie) {
			const tokenValue = tokenCookie.split('=')[1]
			setToken(tokenValue)

			validateAdmin({ token: tokenValue })
				.then(response => {
					console.log(response.data.isValid)
					setIsAdmin(response.data.isValid)
				})
				.catch(err => {
					setIsAdmin(false)
				})
		}
	}, [id])

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

	const handleEdit = e => {
		e.preventDefault()
		navigate(`/hotels/${id}/edit`)
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
										<img
											src={`${hotel.imageUrl}`}
											alt='Hotel'
											style={{
												width: '300px',
												height: '300px',
												objectFit: 'cover',
											}}
										/>
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
				</div>
			) : (
				<p>Loading user data...</p>
			)}
		</div>
	)
}

export default Hotel
