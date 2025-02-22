import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { editHotel, getHotel, validateToken } from '../api'

const EditHotel = () => {
	const { id } = useParams()
	const positionsList = [
		{ id: 1, name: 'CENTER' },
		{ id: 2, name: 'PARK' },
		{ id: 3, name: 'SEA' },
		{ id: 4, name: 'AIRPORT' },
		{ id: 5, name: 'RAILWAY' },
	]

	const additionsList = [
		{ id: 1, name: 'WIFI' },
		{ id: 2, name: 'PARKING' },
		{ id: 3, name: 'RESTAURANT' },
		{ id: 4, name: 'BEACH' },
		{ id: 5, name: 'POOL' },
		{ id: 6, name: 'AQUA_PARK' },
		{ id: 7, name: 'SAUNA' },
		{ id: 8, name: 'FITNESS' },
	]

	const roomPeopleList = [
		{ id: 1, type: 'SINGLE' },
		{ id: 2, type: 'DOUBLE' },
		{ id: 3, type: 'TWIN' },
		{ id: 4, type: 'DBL_EXB' },
		{ id: 5, type: 'TRIPLE' },
	]

	const roomViewsList = [
		{ id: 1, type: 'SEA_VIEW' },
		{ id: 2, type: 'CITY_VIEW' },
		{ id: 3, type: 'GARDEN_VIEW' },
		{ id: 4, type: 'POOL_VIEW' },
	]

	const roomTypesList = [
		{ id: 1, type: 'STANDARD' },
		{ id: 2, type: 'SUPERIOR' },
		{ id: 3, type: 'STUDIO' },
		{ id: 4, type: 'FAMILY_ROOM' },
		{ id: 5, type: 'FAMILY_STUDIO' },
		{ id: 6, type: 'DELUX' },
		{ id: 7, type: 'SUITE' },
		{ id: 8, type: 'PRESIDENTIAL_SUITE' },
		{ id: 9, type: 'HONEYMOON_SUITE' },
	]

	const [newHotel, setNewHotel] = useState({
		city: '',
		name: '',
		stars: 0,
		imageUrl: '',
		positions: [],
		additions: [],
		roomPeople: [],
		roomViews: [],
		roomTypes: [],
	})

	const [selectedRoomPeople, setSelectedRoomPeople] = useState('')
	const [roomPeoplePrice, setRoomPeoplePrice] = useState('')

	const [selectedRoomView, setSelectedRoomView] = useState('')
	const [roomViewPrice, setRoomViewPrice] = useState('')

	const [selectedRoomType, setSelectedRoomType] = useState('')
	const [roomTypePrice, setRoomTypePrice] = useState('')

	const [selectedPosition, setSelectedPosition] = useState('')

	const [selectedAddition, setSelectedAddition] = useState('')

	const [successMessage, setSuccessMessage] = useState('')

	const [errorMessage, setErrorMessage] = useState('')

	const [token, setToken] = useState('')

	const navigate = useNavigate()

	const handleHotelInputChange = e => {
		const name = e.target.name
		let value = e.target.value
		if (name === 'stars') {
			if (!isNaN(value)) {
				value = parseInt(value)
			} else {
				value = ''
			}
		}
		setNewHotel({ ...newHotel, [name]: value })
	}

	useEffect(() => {
		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))

		if (tokenCookie) {
			const tokenValue = tokenCookie.split('=')[1]
			setToken(tokenValue)
			validateToken({ token: tokenValue })
				.then(response => {
					if (response.data.isValid == false) {
						navigate('/login')
					}
				})
				.catch(err => {
					setErrorMessage(err.response.data.message)
					navigate('/login')
				})
			getHotel({ id: id })
				.then(response => {
					setNewHotel(response.data)
				})
				.catch(err => {
					setErrorMessage(err.response.data.message)
					navigate('/login')
				})
		} else {
			navigate('/login')
		}
	}, [])

	const handleSubmit = async e => {
		e.preventDefault()
		if (
			newHotel.additions.length == 0 ||
			newHotel.positions.length == 0 ||
			newHotel.roomPeople.length == 0 ||
			newHotel.roomViews.length == 0 ||
			newHotel.roomTypes.length == 0
		) {
			setErrorMessage('Заполните все поля')
			setTimeout(() => {
				setErrorMessage('')
			}, 5000)
			return
		}
		editHotel(newHotel, id, token)
			.then(() => {
				setSuccessMessage('Hotel updated!')
				setErrorMessage('')
			})
			.catch(error => {
				setErrorMessage(error.response.data.message)
			})
		setTimeout(() => {
			setErrorMessage('')
			setSuccessMessage('')
		}, 5000)
	}

	return (
		<>
			<section className='container mt-5 mb-5'>
				<div className='row justify-content-center'>
					<div className='col-md-8 col-lg-6'>
						<h2 className='mt-5 mb-2'>Edit Hotel</h2>
						{successMessage && (
							<div className='alert alert-success fade show'>
								{successMessage}
							</div>
						)}

						{errorMessage && (
							<div className='alert alert-danger fade show'>
								{errorMessage}
							</div>
						)}

						<form onSubmit={handleSubmit}>
							<div className='mb-3'>
								<label htmlFor='name' className='form-label'>
									Hotel name
								</label>
								<input
									required
									type='text'
									className='form-control'
									id='name'
									name='name'
									value={newHotel.name}
									onChange={handleHotelInputChange}
								/>
							</div>
							<div className='mb-3'>
								<label htmlFor='city' className='form-label'>
									City
								</label>
								<input
									required
									type='text'
									className='form-control'
									id='city'
									name='city'
									value={newHotel.city}
									onChange={handleHotelInputChange}
								/>
							</div>
							<div className='mb-3'>
								<label
									htmlFor='imageUrl'
									className='form-label'
								>
									Image Url
								</label>
								<input
									required
									type='text'
									className='form-control'
									id='imageUrl'
									name='imageUrl'
									value={newHotel.imageUrl}
									onChange={handleHotelInputChange}
								/>
							</div>
							<div className='mb-3'>
								<label htmlFor='stars' className='form-label'>
									Stars
								</label>
								<input
									required
									type='number'
									className='form-control'
									id='stars'
									name='stars'
									value={newHotel.stars}
									onChange={handleHotelInputChange}
									min='1'
									max='5'
								/>
							</div>
							<br />
							<div className='border p-3 mb-3'>
								<label
									htmlFor='positionSelect'
									className='form-label'
								>
									Select Position
								</label>
								<select
									className='form-control'
									id='positionSelect'
									value={selectedPosition}
									onChange={e =>
										setSelectedPosition(e.target.value)
									}
								>
									<option value='' disabled>
										Select a position
									</option>
									{positionsList.map(position => (
										<option
											key={position.id}
											value={position.name}
										>
											{position.name}
										</option>
									))}
								</select>
								<div className='d-grid gap-2 d-md-flex mt-2'>
									<button
										type='button'
										className='btn btn-primary mt-2'
										onClick={() => {
											if (
												selectedPosition &&
												!newHotel.positions.includes(
													selectedPosition
												)
											) {
												setNewHotel(prev => ({
													...prev,
													positions: [
														...prev.positions,
														selectedPosition,
													],
												}))
												setSelectedPosition('')
											}
										}}
									>
										Add Position
									</button>
									<button
										type='button'
										className='btn btn-danger mt-2'
										onClick={() => {
											setNewHotel(prev => ({
												...prev,
												positions: [],
											}))
										}}
									>
										Clear All Positions
									</button>
								</div>
								<div className='mt-3'>
									<p>Current Positions:</p>
									<ul>
										{newHotel.positions.map(
											(position, index) => (
												<li key={index}>{position}</li>
											)
										)}
									</ul>
								</div>
							</div>
							<br />
							<div className='border p-3 mb-3'>
								<label
									htmlFor='additionSelect'
									className='form-label'
								>
									Select Addition
								</label>
								<select
									className='form-control'
									id='additionSelect'
									value={selectedAddition}
									onChange={e =>
										setSelectedAddition(e.target.value)
									}
								>
									<option value='' disabled>
										Select a addition
									</option>
									{additionsList.map(addition => (
										<option
											key={addition.id}
											value={addition.name}
										>
											{addition.name}
										</option>
									))}
								</select>
								<div className='d-grid gap-2 d-md-flex mt-2'>
									<button
										type='button'
										className='btn btn-primary mt-2'
										onClick={() => {
											if (
												selectedAddition &&
												!newHotel.additions.includes(
													selectedAddition
												)
											) {
												setNewHotel(prev => ({
													...prev,
													additions: [
														...prev.additions,
														selectedAddition,
													],
												}))
												setSelectedAddition('')
											}
										}}
									>
										Add Addition
									</button>
									<button
										type='button'
										className='btn btn-danger mt-2'
										onClick={() => {
											setNewHotel(prev => ({
												...prev,
												additions: [],
											}))
										}}
									>
										Clear All Additions
									</button>
								</div>
								<div className='mt-3'>
									<p>Current Additions:</p>
									<ul>
										{newHotel.additions.map(
											(addition, index) => (
												<li key={index}>{addition}</li>
											)
										)}
									</ul>
								</div>
							</div>

							<div className='border p-3 mb-3'>
								<p>Select Room People</p>

								<select
									className='form-control'
									value={selectedRoomPeople}
									onChange={e =>
										setSelectedRoomPeople(e.target.value)
									}
								>
									<option value='' disabled>
										Select a room people
									</option>
									{roomPeopleList.map(roomPeople => (
										<option
											key={roomPeople.id}
											value={roomPeople.type}
										>
											{roomPeople.type}
										</option>
									))}
								</select>

								<div className='mt-2'>
									<label
										htmlFor='roomPeoplePrice'
										className='form-label'
									>
										Room People price
									</label>
									<input
										type='number'
										className='form-control'
										id='roomPeoplePrice'
										value={roomPeoplePrice}
										onChange={e =>
											setRoomPeoplePrice(e.target.value)
										}
										placeholder='Enter price'
									/>
								</div>

								<div className='d-grid gap-2 d-md-flex mt-2'>
									<button
										type='button'
										className='btn btn-primary mt-2'
										onClick={() => {
											if (selectedRoomPeople) {
												setNewHotel(prev => ({
													...prev,
													roomPeople: [
														...prev.roomPeople,
														{
															type: selectedRoomPeople,
															price: parseFloat(
																roomPeoplePrice
															),
														},
													],
												}))
												setSelectedRoomPeople('')
												setRoomPeoplePrice('')
											}
										}}
									>
										Add RoomPeople
									</button>
									<button
										type='button'
										className='btn btn-danger mt-2'
										onClick={() => {
											setNewHotel(prev => ({
												...prev,
												roomPeople: [],
											}))
										}}
									>
										Clear All Room People
									</button>
								</div>

								<div className='mt-3'>
									<h5>Current Room People:</h5>
									<ul>
										{newHotel.roomPeople.map(
											(roomPeople, index) => (
												<li key={index}>
													Type: {roomPeople.type},
													Price:
													{roomPeople.price} руб
												</li>
											)
										)}
									</ul>
								</div>
							</div>

							<div className='border p-3 mb-3'>
								<p>Select Room View</p>

								<select
									className='form-control'
									value={selectedRoomView}
									onChange={e => {
										setSelectedRoomView(e.target.value)
									}}
								>
									<option value='' disabled>
										Select a room view
									</option>
									{roomViewsList.map(roomView => (
										<option
											key={roomView.id}
											value={roomView.type}
										>
											{roomView.type}
										</option>
									))}
								</select>

								<div className='mt-2'>
									<label
										htmlFor='roomViewPrice'
										className='form-label'
									>
										Room View price
									</label>
									<input
										type='number'
										className='form-control'
										id='roomViewPrice'
										value={roomViewPrice}
										onChange={e =>
											setRoomViewPrice(e.target.value)
										}
										placeholder='Enter price'
									/>
								</div>

								<div className='d-grid gap-2 d-md-flex mt-2'>
									<button
										type='button'
										className='btn btn-primary mt-2'
										onClick={() => {
											if (selectedRoomView) {
												setNewHotel(prev => ({
													...prev,
													roomViews: [
														...prev.roomViews,
														{
															type: selectedRoomView,
															price: parseFloat(
																roomViewPrice
															),
														},
													],
												}))
												setSelectedRoomView('')
												setRoomViewPrice('')
											}
										}}
									>
										Add RoomView
									</button>
									<button
										type='button'
										className='btn btn-danger mt-2'
										onClick={() => {
											setNewHotel(prev => ({
												...prev,
												roomViews: [],
											}))
										}}
									>
										Clear All Room Views
									</button>
								</div>

								<div className='mt-3'>
									<h5>Current Room View:</h5>
									<ul>
										{newHotel.roomViews.map(
											(roomView, index) => (
												<li key={index}>
													Type: {roomView.type},
													Price:
													{roomView.price} руб
												</li>
											)
										)}
									</ul>
								</div>
							</div>

							<div className='border p-3 mb-3'>
								<p>Select Room Type</p>

								<select
									className='form-control'
									value={selectedRoomType}
									onChange={e => {
										setSelectedRoomType(e.target.value)
									}}
								>
									<option value='' disabled>
										Select a room type
									</option>
									{roomTypesList.map(roomType => (
										<option
											key={roomType.id}
											value={roomType.type}
										>
											{roomType.type}
										</option>
									))}
								</select>

								<div className='mt-2'>
									<label
										htmlFor='roomTypePrice'
										className='form-label'
									>
										Room Type price
									</label>
									<input
										type='number'
										className='form-control'
										id='roomTypePrice'
										value={roomTypePrice}
										onChange={e =>
											setRoomTypePrice(e.target.value)
										}
										placeholder='Enter price'
									/>
								</div>

								<div className='d-grid gap-2 d-md-flex mt-2'>
									<button
										type='button'
										className='btn btn-primary mt-2'
										onClick={() => {
											if (selectedRoomType) {
												setNewHotel(prev => ({
													...prev,
													roomTypes: [
														...prev.roomTypes,
														{
															type: selectedRoomType,
															price: parseFloat(
																roomTypePrice
															),
														},
													],
												}))
												setSelectedRoomType('')
												setRoomTypePrice('')
											}
										}}
									>
										Add RoomType
									</button>
									<button
										type='button'
										className='btn btn-danger mt-2'
										onClick={() => {
											setNewHotel(prev => ({
												...prev,
												roomTypes: [],
											}))
										}}
									>
										Clear All Room Types
									</button>
								</div>

								<div className='mt-3'>
									<h5>Current Room Type:</h5>
									<ul>
										{newHotel.roomTypes.map(
											(roomType, index) => (
												<li key={index}>
													Type: {roomType.type},
													Price:
													{roomType.price} руб
												</li>
											)
										)}
									</ul>
								</div>
							</div>

							<div className='d-grid gap-2 d-md-flex mt-2'>
								<Link
									to={`/hotels/${id}`}
									className='btn btn-outline-info'
								>
									На страницу отеля
								</Link>
								<button
									type='submit'
									className='btn btn-outline-primary ml-5'
								>
									Edit Hotel
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</>
	)
}

export default EditHotel
