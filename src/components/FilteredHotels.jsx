import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { validateAdmin, validateToken } from '../api'
import styles from './FilteredHotels.module.css'
import HotelCard from './HotelCard'
import Navbar from './Navbar'
import Paginator from './Paginator'

const FilteredHotels = () => {
	const location = useLocation()
	const [data, setData] = useState(location.state.hotels)
	const [filteredData, setFilteredData] = useState(data)
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [hotelsPerPage] = useState(20)
	const [token, setToken] = useState('')
	const [searchQuery, setSearchQuery] = useState('')
	const [isAdmin, setIsAdmin] = useState(false)
	const [user, setUser] = useState({ role: [], id: null, login: 'Гость' })
	const [selectedStars, setSelectedStars] = useState(1)
	const [selectedRate, setSelectedRate] = useState(0)
	const [selectedAdditions, setSelectedAdditions] = useState([])
	const [selectedPositions, setSelectedPositions] = useState([])
	const [selectedRoomPeople, setSelectedRoomPeople] = useState([])
	const [selectedRoomViews, setSelectedRoomViews] = useState([])
	const [selectedRoomTypes, setSelectedRoomTypes] = useState([])
	const notFoundHotels = location.state.isError

	const additionsList = [
		{ label: 'Wifi', name: 'WIFI' },
		{ label: 'Парковка', name: 'PARKING' },
		{ label: 'Ресторан', name: 'RESTAURANT' },
		{ label: 'Пляж', name: 'BEACH' },
		{ label: 'Бассейн', name: 'POOL' },
		{ label: 'Аквапарк', name: 'AQUA_PARK' },
		{ label: 'Сауна', name: 'SAUNA' },
		{ label: 'Спортивный зал', name: 'FITNESS' },
	]

	const positionsList = [
		{ label: 'В центре', name: 'CENTER' },
		{ label: 'Рядом с парком', name: 'PARK' },
		{ label: 'Рядом с морем', name: 'SEA' },
		{ label: 'Рядом с аэропортом', name: 'AIRPORT' },
		{ label: 'Рядом с вокзалом', name: 'RAILWAY' },
	]

	const roomPeopleList = [
		{ label: 'На одного', name: 'SINGLE' },
		{ label: 'На двоих с одной кроватью', name: 'DOUBLE' },
		{ label: 'На двоих с двумя кроватями', name: 'TWIN' },
		{ label: 'На двоих с ребенком', name: 'DBL_EXB' },
		{ label: 'На троих', name: 'TRIPLE' },
	]

	const roomViewsList = [
		{ label: 'На море', name: 'SEA_VIEW' },
		{ label: 'На город', name: 'CITY_VIEW' },
		{ label: 'На сад', name: 'GARDEN_VIEW' },
		{ label: 'На бассейн', name: 'POOL_VIEW' },
	]

	const roomTypesList = [
		{ label: 'Стандарт', name: 'STANDARD' },
		{ label: 'Стандарт+', name: 'SUPERIOR' },
		{ label: 'Студия', name: 'STUDIO' },
		{ label: 'Семейный', name: 'FAMILY_ROOM' },
		{ label: 'Семейная студия', name: 'FAMILY_STUDIO' },
		{ label: 'Делюкс', name: 'DELUX' },
		{ label: 'Делюкс+', name: 'SUITE' },
		{ label: 'Президентский', name: 'PRESIDENTIAL_SUITE' },
		{ label: 'Для молодоженов', name: 'HONEYMOON_SUITE' },
	]

	useEffect(() => {
		setIsLoading(true)
		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
		if (tokenCookie) {
			const tokenValue = tokenCookie.split('=')[1]
			validateToken({ token: tokenValue }).then(response => {
				if (response.data.isValid == false) {
					navigate('/login')
				}
			})
		} else {
			navigate('/login')
		}

		if (tokenCookie) {
			const tokenValue = tokenCookie.split('=')[1]

			validateAdmin({ token: tokenValue })
				.then(response => {
					setIsAdmin(response.data.isValid)
					setToken(tokenValue)
					const decodedToken = jwtDecode(tokenValue)
					setUser({
						login: decodedToken.username,
						role: decodedToken.role,
						id: decodedToken.user_id,
					})
				})
				.catch(err => {
					setIsAdmin(false)
				})
		}
		setIsLoading(false)
	}, [])

	const handleDeleteHotel = hotelId => {
		setData(prevData => prevData.filter(hotel => hotel.id !== hotelId))
	}

	const handleChangeFavourite = hotelId => {
		setData(prevData =>
			prevData.map(hotel =>
				hotel.id === hotelId
					? { ...hotel, isFavourite: !hotel.isFavourite }
					: hotel
			)
		)
	}

	const filterHotels = (
		currentSearchQuery,
		currentSelectedStars,
		currentRate,
		currentSelectedAdditions,
		currentSelectedPositions,
		currentSelectedRoomPeople,
		currentSelectedRoomViews,
		currentSelectedRoomTypes
	) => {
		const newFilteredData = data.filter(hotel => {
			const matchesQuery = hotel.name
				.toLowerCase()
				.includes(currentSearchQuery.toLowerCase())
			const matchesStars = hotel.stars >= currentSelectedStars
			const matchesAvgRate = hotel.avgRate >= currentRate
			const matchesAdditions =
				currentSelectedAdditions.length === 0 ||
				currentSelectedAdditions.every(addition =>
					hotel.additions.includes(addition)
				)
			const matchesPositions =
				currentSelectedPositions.length === 0 ||
				currentSelectedPositions.every(position =>
					hotel.positions.includes(position)
				)
			const matchesRoomPeople =
				currentSelectedRoomPeople.length === 0 ||
				currentSelectedRoomPeople.some(roomPeople =>
					hotel.roomPeople.map(item => item.type).includes(roomPeople)
				)
			const matchesRoomViews =
				currentSelectedRoomViews.length === 0 ||
				currentSelectedRoomViews.some(roomView =>
					hotel.roomViews.map(item => item.type).includes(roomView)
				)
			const matchesRoomTypes =
				currentSelectedRoomTypes.length === 0 ||
				currentSelectedRoomTypes.some(roomType =>
					hotel.roomTypes.map(item => item.type).includes(roomType)
				)

			return (
				matchesQuery &&
				matchesStars &&
				matchesAdditions &&
				matchesAvgRate &&
				matchesPositions &&
				matchesRoomPeople &&
				matchesRoomViews &&
				matchesRoomTypes
			)
		})

		console.log(newFilteredData)

		setFilteredData(newFilteredData)
	}

	const handleStarChange = e => {
		const stars = parseInt(e.target.value)
		setSelectedStars(stars)

		filterHotels(
			searchQuery,
			stars,
			selectedRate,
			selectedAdditions,
			selectedPositions,
			selectedRoomPeople,
			selectedRoomViews,
			selectedRoomTypes
		)
	}

	const handleRateChange = e => {
		const rate = parseInt(e.target.value)
		setSelectedRate(rate)

		filterHotels(
			searchQuery,
			selectedStars,
			rate,
			selectedAdditions,
			selectedPositions,
			selectedRoomPeople,
			selectedRoomViews,
			selectedRoomTypes
		)
	}

	const handleSearchChange = event => {
		const query = event.target.value
		setSearchQuery(query)

		filterHotels(
			query,
			selectedStars,
			selectedRate,
			selectedAdditions,
			selectedPositions,
			selectedRoomPeople,
			selectedRoomViews,
			selectedRoomTypes
		)
	}

	const handleAdditionChange = event => {
		const { value, checked } = event.target
		let newAdditions

		if (checked) {
			setSelectedAdditions(prev => [...prev, value])
			newAdditions = [...selectedAdditions, value]
		} else {
			setSelectedAdditions(prev =>
				prev.filter(addition => addition !== value)
			)
			newAdditions = selectedAdditions.filter(
				addition => addition !== value
			)
		}

		filterHotels(
			searchQuery,
			selectedStars,
			selectedRate,
			newAdditions,
			selectedPositions,
			selectedRoomPeople,
			selectedRoomViews,
			selectedRoomTypes
		)
	}

	const handlePositionChange = event => {
		const { value, checked } = event.target
		let newPositions

		if (checked) {
			setSelectedPositions(prev => [...prev, value])
			newPositions = [...selectedPositions, value]
		} else {
			setSelectedPositions(prev =>
				prev.filter(position => position !== value)
			)
			newPositions = selectedPositions.filter(
				position => position !== value
			)
		}

		filterHotels(
			searchQuery,
			selectedStars,
			selectedRate,
			selectedAdditions,
			newPositions,
			selectedRoomPeople,
			selectedRoomViews,
			selectedRoomTypes
		)
	}

	const handleRoomPeopleChange = event => {
		const { value, checked } = event.target
		let newRoomPeople

		if (checked) {
			setSelectedRoomPeople(prev => [...prev, value])
			newRoomPeople = [...selectedRoomPeople, value]
		} else {
			setSelectedRoomPeople(prev =>
				prev.filter(roomPeople => roomPeople !== value)
			)
			newRoomPeople = selectedRoomPeople.filter(
				roomPeople => roomPeople !== value
			)
		}

		filterHotels(
			searchQuery,
			selectedStars,
			selectedRate,
			selectedAdditions,
			selectedPositions,
			newRoomPeople,
			selectedRoomViews,
			selectedRoomTypes
		)
	}

	const handleRoomViewChange = event => {
		const { value, checked } = event.target
		let newRoomViews

		if (checked) {
			setSelectedRoomViews(prev => [...prev, value])
			newRoomViews = [...selectedRoomViews, value]
		} else {
			setSelectedRoomViews(prev =>
				prev.filter(roomView => roomView !== value)
			)
			newRoomViews = selectedRoomViews.filter(
				roomView => roomView !== value
			)
		}

		filterHotels(
			searchQuery,
			selectedStars,
			selectedRate,
			selectedAdditions,
			selectedPositions,
			selectedRoomPeople,
			newRoomViews,
			selectedRoomTypes
		)
	}

	const handleRoomTypeChange = event => {
		const { value, checked } = event.target
		let newRoomTypes

		if (checked) {
			setSelectedRoomTypes(prev => [...prev, value])
			newRoomTypes = [...selectedRoomTypes, value]
		} else {
			setSelectedRoomTypes(prev =>
				prev.filter(roomType => roomType !== value)
			)
			newRoomTypes = selectedRoomTypes.filter(
				roomType => roomType !== value
			)
		}

		filterHotels(
			searchQuery,
			selectedStars,
			selectedRate,
			selectedAdditions,
			selectedPositions,
			selectedRoomPeople,
			selectedRoomViews,
			newRoomTypes
		)
	}

	if (isLoading) {
		return <div>Загрузка........</div>
	}

	const handlePageNumber = pageNumber => {
		setCurrentPage(pageNumber)
	}

	const totalPages = Math.ceil(filteredData.length / hotelsPerPage)

	const renderHotels = () => {
		const startIndex = (currentPage - 1) * hotelsPerPage
		const endIndex = startIndex + hotelsPerPage
		return filteredData
			.slice(startIndex, endIndex)
			.map(hotel => (
				<HotelCard
					key={hotel.id}
					hotel={hotel}
					isAdmin={isAdmin}
					token={token}
					onDelete={handleDeleteHotel}
					onChangeFavourite={handleChangeFavourite}
				/>
			))
	}

	return (
		<section>
			<Navbar userRole={user.role} id={user.id} />
			{error && (
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
					<p className={styles.errorText}>{error}</p>
				</div>
			)}
			<br />
			<div className={styles.header}>
				<input
					type='text'
					placeholder='Поиск по названию'
					value={searchQuery}
					onChange={handleSearchChange}
					className={styles.searchInput}
				/>

				<div className={styles.headerFilter}>
					<select
						value={selectedStars}
						onChange={handleStarChange}
						className={styles.starsSelector}
					>
						<option value='1'>От 1 звезды</option>
						<option value='2'>От 2 звезд</option>
						<option value='3'>От 3 звезд</option>
						<option value='4'>От 4 звезд</option>
						<option value='5'>От 5 звезд</option>
					</select>

					<select
						value={selectedRate}
						onChange={handleRateChange}
						className={styles.rateSelector}
					>
						<option value='1'>Средний рейтинг 1 и выше</option>
						<option value='2'>Средний рейтинг 2 и выше</option>
						<option value='3'>Средний рейтинг 3 и выше</option>
						<option value='4'>Средний рейтинг 4 и выше</option>
						<option value='5'>Средний рейтинг 5 и выше</option>
					</select>
				</div>
			</div>
			<div className={styles.filters}>
				<div className={styles.filter}>
					<p
						style={{ width: '207px' }}
						className={styles.filterHeader}
					>
						Удобства в отеле:
					</p>
					{additionsList.map(addition => (
						<div key={addition.name}>
							<input
								type='checkbox'
								id={addition.name}
								value={addition.name}
								checked={selectedAdditions.includes(
									addition.name
								)}
								onChange={handleAdditionChange}
								className={styles.input}
							/>
							<label
								className={styles.label}
								htmlFor={addition.name}
							>
								{addition.label}
							</label>
						</div>
					))}
				</div>
				<div className={styles.filter}>
					<p
						style={{ width: '252px' }}
						className={styles.filterHeader}
					>
						Расположение отеля:
					</p>
					{positionsList.map(position => (
						<div key={position.name}>
							<input
								type='checkbox'
								id={position.name}
								value={position.name}
								checked={selectedPositions.includes(
									position.name
								)}
								onChange={handlePositionChange}
								className={styles.input}
							/>
							<label
								className={styles.label}
								htmlFor={position.name}
							>
								{position.label}
							</label>
						</div>
					))}
				</div>
				<div className={styles.filter}>
					<p
						style={{ width: '271px' }}
						className={styles.filterHeader}
					>
						Число людей в номере:
					</p>
					{roomPeopleList.map(roomPeople => (
						<div key={roomPeople.name}>
							<input
								type='checkbox'
								id={roomPeople.name}
								value={roomPeople.name}
								checked={selectedRoomPeople.includes(
									roomPeople.name
								)}
								onChange={handleRoomPeopleChange}
								className={styles.input}
							/>
							<label
								className={styles.label}
								htmlFor={roomPeople.name}
							>
								{roomPeople.label}
							</label>
						</div>
					))}
				</div>
				<div className={styles.filter}>
					<p
						style={{ width: '177px' }}
						className={styles.filterHeader}
					>
						Вид из номера:
					</p>
					{roomViewsList.map(roomView => (
						<div key={roomView.name}>
							<input
								type='checkbox'
								id={roomView.name}
								value={roomView.name}
								checked={selectedRoomViews.includes(
									roomView.name
								)}
								onChange={handleRoomViewChange}
								className={styles.input}
							/>
							<label
								className={styles.label}
								htmlFor={roomView.name}
							>
								{roomView.label}
							</label>
						</div>
					))}
				</div>
				<div className={styles.filter} style={{ borderRight: 'none' }}>
					<p
						style={{ width: '166px' }}
						className={styles.filterHeader}
					>
						Тип номера:
					</p>
					{roomTypesList.map(roomType => (
						<div key={roomType.name}>
							<input
								type='checkbox'
								id={roomType.name}
								value={roomType.name}
								checked={selectedRoomTypes.includes(
									roomType.name
								)}
								onChange={handleRoomTypeChange}
								className={styles.input}
							/>
							<label
								className={styles.label}
								htmlFor={roomType.name}
							>
								{roomType.label}
							</label>
						</div>
					))}
				</div>
			</div>
			<br />

			<div style={{ background: '#eef6ff', minHeight: '50vh' }}>
				<br />
				{notFoundHotels && (
					<p className={styles.notFoundMessage}>
						К сожалению, подходящих отелей найдено не было, но вот
						наши лучшие отели!
					</p>
				)}

				<Paginator
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageNumber}
				/>
				<div className={styles.hotels}>{renderHotels()}</div>
				<Paginator
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageNumber}
				/>
			</div>
		</section>
	)
}

export default FilteredHotels
