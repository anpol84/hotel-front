import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createHotel, validateAdmin } from '../api'
import styles from './AddHotel.module.css'
import Navbar from './Navbar'

const AddHotel = () => {
	const positionsList = [
		{ id: 1, name: 'CENTER' },
		{ id: 2, name: 'PARK' },
		{ id: 3, name: 'SEA' },
		{ id: 4, name: 'AIRPORT' },
		{ id: 5, name: 'RAILWAY' },
	]

	const positionDict = {
		CENTER: 'В центре',
		PARK: 'Рядом с парком',
		SEA: 'Рядом с море',
		AIRPORT: 'Рядом с аэропортом',
		RAILWAY: 'Рядом с вокзалом',
	}

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

	const roomPeopleList = [
		{ id: 1, type: 'SINGLE' },
		{ id: 2, type: 'DOUBLE' },
		{ id: 3, type: 'TWIN' },
		{ id: 4, type: 'DBL_EXB' },
		{ id: 5, type: 'TRIPLE' },
	]

	const roomPeopleDict = {
		SINGLE: 'На одного',
		DOUBLE: 'На двоих с 2 кроватями',
		TWIN: 'На двоих с 1 кроватью',
		DBL_EXB: 'На двоих с ребенком',
		TRIPLE: 'На троих',
	}

	const roomViewsList = [
		{ id: 1, type: 'SEA_VIEW' },
		{ id: 2, type: 'CITY_VIEW' },
		{ id: 3, type: 'GARDEN_VIEW' },
		{ id: 4, type: 'POOL_VIEW' },
	]

	const roomViewsDict = {
		SEA_VIEW: 'На море',
		CITY_VIEW: 'На город',
		GARDEN_VIEW: 'На природу',
		POOL_VIEW: 'На бассейн',
	}

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

	const [user, setUser] = useState({ role: [], id: null, login: 'Гость' })

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
			validateAdmin({ token: tokenValue })
				.then(response => {
					if (response.data.isValid == false) {
						navigate('/login')
					}
					const decodedToken = jwtDecode(tokenValue)
					setUser({
						login: decodedToken.username,
						role: decodedToken.role,
						id: decodedToken.user_id,
					})
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
		createHotel(newHotel, token)
			.then(response => {
				setSuccessMessage('Hotel created!')
				setErrorMessage('')
				setNewHotel({
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
			<Navbar userRole={user.role} id={user.id} />
			<section className={styles.root}>
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
				{successMessage && (
					<div className={styles.success}>
						<svg
							width='56'
							height='54'
							viewBox='0 0 56 54'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M6 29.9223L27.2461 48L50 6'
								stroke='#6BE637'
								stroke-width='12'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
						</svg>

						<p className={styles.successText}>{successMessage}</p>
					</div>
				)}

				<div>
					<p className={styles.header}>Добавление нового отеля</p>

					<form onSubmit={handleSubmit}>
						<div>
							<input
								className={styles.formInput}
								required
								type='text'
								id='name'
								name='name'
								value={newHotel.name}
								onChange={handleHotelInputChange}
								placeholder='Название отеля'
							/>
						</div>
						<div>
							<input
								required
								type='text'
								className={styles.formInput}
								id='city'
								name='city'
								value={newHotel.city}
								onChange={handleHotelInputChange}
								placeholder='Город'
							/>
						</div>
						<div>
							<input
								required
								type='text'
								className={styles.formInput}
								id='imageUrl'
								name='imageUrl'
								value={newHotel.imageUrl}
								onChange={handleHotelInputChange}
								placeholder='Url-адрес изображения'
							/>
						</div>
						<div>
							<input
								required
								type='number'
								className={styles.formInput}
								id='stars'
								name='stars'
								value={newHotel.stars}
								onChange={handleHotelInputChange}
								min='1'
								max='5'
								placeholder='Количество звезд'
							/>
						</div>
						<div className={styles.complexInput}>
							<label
								htmlFor='positionSelect'
								className={styles.label}
							>
								Выбор расположения отеля
							</label>
							<select
								className={styles.formInputComplex}
								id='positionSelect'
								value={selectedPosition}
								onChange={e =>
									setSelectedPosition(e.target.value)
								}
							>
								<option value='' disabled>
									Выбрать
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
							<div className={styles.complexButtons}>
								<button
									type='button'
									className={styles.complexAddButton}
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
									Добавить расположение
								</button>
								<button
									type='button'
									className={styles.complexRemoveButton}
									onClick={() => {
										setNewHotel(prev => ({
											...prev,
											positions: [],
										}))
									}}
								>
									Удалить все расположения
								</button>
							</div>
							<div className={styles.complexList}>
								<p className={styles.complexListHeader}>
									Выбранные расположения:
								</p>
								<ul className={styles.complexListItem}>
									{newHotel.positions.map(
										(position, index) => (
											<li key={index}>
												{positionDict[position]}
											</li>
										)
									)}
								</ul>
							</div>
						</div>
						<div className={styles.complexInput}>
							<label
								htmlFor='additionSelect'
								className={styles.label}
							>
								Выбор дополнений отеля
							</label>
							<select
								className={styles.formInputComplex}
								id='additionSelect'
								value={selectedAddition}
								onChange={e =>
									setSelectedAddition(e.target.value)
								}
							>
								<option value='' disabled>
									Выбрать
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
							<div className={styles.complexButtons}>
								<button
									type='button'
									className={styles.complexAddButton}
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
									Добавить дополнение
								</button>
								<button
									type='button'
									className={styles.complexRemoveButton}
									onClick={() => {
										setNewHotel(prev => ({
											...prev,
											additions: [],
										}))
									}}
								>
									Удалить все дополнения
								</button>
							</div>
							<div className={styles.complexList}>
								<p className={styles.complexListHeader}>
									Выбранные дополнения:
								</p>
								<ul className={styles.complexListItem}>
									{newHotel.additions.map(
										(addition, index) => (
											<li key={index}>
												{additionDict[addition]}
											</li>
										)
									)}
								</ul>
							</div>
						</div>
						<div className={styles.complexInput}>
							<label className={styles.label}>
								Выбор комнаты по количеству людей
							</label>

							<select
								className={styles.formInputComplex}
								value={selectedRoomPeople}
								onChange={e =>
									setSelectedRoomPeople(e.target.value)
								}
							>
								<option value='' disabled>
									Выбрать
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

							<div>
								<input
									type='number'
									style={{ marginTop: '1px' }}
									className={styles.formInputComplex}
									id='roomPeoplePrice'
									value={roomPeoplePrice}
									onChange={e =>
										setRoomPeoplePrice(e.target.value)
									}
									placeholder='Введите цену'
								/>
							</div>

							<div className={styles.complexButtons}>
								<button
									type='button'
									className={styles.complexAddButton}
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
									Добавить комнату
								</button>
								<button
									type='button'
									className={styles.complexRemoveButton}
									onClick={() => {
										setNewHotel(prev => ({
											...prev,
											roomPeople: [],
										}))
									}}
								>
									Удалить все комнаты
								</button>
							</div>

							<div className={styles.complexList}>
								<p className={styles.complexListHeader}>
									Выбранные комнаты по количеству людей:
								</p>
								<ul className={styles.complexListItem}>
									{newHotel.roomPeople.map(
										(roomPeople, index) => (
											<li key={index}>
												Тип:{' '}
												{
													roomPeopleDict[
														roomPeople.type
													]
												}
												, Цена: {roomPeople.price} руб.
											</li>
										)
									)}
								</ul>
							</div>
						</div>
						<div className={styles.complexInput}>
							<label className={styles.label}>
								Выбор комнаты по виду из окна
							</label>

							<select
								className={styles.formInputComplex}
								value={selectedRoomView}
								onChange={e => {
									setSelectedRoomView(e.target.value)
								}}
							>
								<option value='' disabled>
									Выбрать
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

							<div>
								<input
									style={{ marginTop: '1px' }}
									type='number'
									className={styles.formInputComplex}
									id='roomViewPrice'
									value={roomViewPrice}
									onChange={e =>
										setRoomViewPrice(e.target.value)
									}
									placeholder='Введите цену'
								/>
							</div>

							<div className={styles.complexButtons}>
								<button
									type='button'
									className={styles.complexAddButton}
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
									Добавить комнату
								</button>
								<button
									type='button'
									className={styles.complexRemoveButton}
									onClick={() => {
										setNewHotel(prev => ({
											...prev,
											roomViews: [],
										}))
									}}
								>
									Удалить все комнаты
								</button>
							</div>

							<div className={styles.complexList}>
								<p className={styles.complexListHeader}>
									Выбранные комнаты по виду из окна:
								</p>
								<ul className={styles.complexListItem}>
									{newHotel.roomViews.map(
										(roomView, index) => (
											<li key={index}>
												Тип:{' '}
												{roomViewsDict[roomView.type]},
												Цена: {roomView.price} руб.
											</li>
										)
									)}
								</ul>
							</div>
						</div>
						<div className={styles.complexInput}>
							<label className={styles.label}>
								Выбор комнаты по типу
							</label>

							<select
								className={styles.formInputComplex}
								value={selectedRoomType}
								onChange={e => {
									setSelectedRoomType(e.target.value)
								}}
							>
								<option value='' disabled>
									Выбрать
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

							<div>
								<input
									style={{ marginTop: '1px' }}
									type='number'
									className={styles.formInputComplex}
									id='roomTypePrice'
									value={roomTypePrice}
									onChange={e =>
										setRoomTypePrice(e.target.value)
									}
									placeholder='Введите цену'
								/>
							</div>

							<div className={styles.complexButtons}>
								<button
									type='button'
									className={styles.complexAddButton}
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
									Добавить комнату
								</button>
								<button
									type='button'
									className={styles.complexRemoveButton}
									onClick={() => {
										setNewHotel(prev => ({
											...prev,
											roomTypes: [],
										}))
									}}
								>
									Удалить все комнаты
								</button>
							</div>

							<div className={styles.complexList}>
								<p className={styles.complexListHeader}>
									Выбранные комнаты по типу:
								</p>
								<ul className={styles.complexListItem}>
									{newHotel.roomTypes.map(
										(roomType, index) => (
											<li key={index}>
												Тип:{' '}
												{roomTypesDict[roomType.type]},
												Цена: {roomType.price} руб.
											</li>
										)
									)}
								</ul>
							</div>
						</div>
						<div>
							<button type='submit' className={styles.addButton}>
								Сохранить
							</button>
						</div>{' '}
					</form>
				</div>
			</section>
		</>
	)
}

export default AddHotel
