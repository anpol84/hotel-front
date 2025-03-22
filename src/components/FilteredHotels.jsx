import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { validateAdmin, validateToken } from '../api'
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
	const [selectedRate, setSelectedRate] = useState(1)
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
		return <div>Loading rooms........</div>
	}
	if (error) {
		return <div className='text-danger'>Error : {error}</div>
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
		<section className='container'>
			<Navbar userRole={user.role} id={user.id} />
			<br />
			<Container>
				<input
					type='text'
					placeholder='Поиск по названию'
					value={searchQuery}
					onChange={handleSearchChange}
					className='m-2'
				/>

				<select
					value={selectedStars}
					onChange={handleStarChange}
					className='m-2'
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
					className='m-2'
				>
					<option value='1'>Средний рейтинг 1 и выше</option>
					<option value='2'>Средний рейтинг 2 и выше</option>
					<option value='3'>Средний рейтинг 3 и выше</option>
					<option value='4'>Средний рейтинг 4 и выше</option>
					<option value='5'>Средний рейтинг 5 и выше</option>
				</select>

				<div className='d-flex'>
					<div className='m-2'>
						<h5>Выберите удобства в отеле:</h5>
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
								/>
								<label className='m-1' htmlFor={addition.name}>
									{addition.label}
								</label>
							</div>
						))}
					</div>

					<div className='m-2'>
						<h5>Выберите расположение отеля:</h5>
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
								/>
								<label className='m-1' htmlFor={position.name}>
									{position.label}
								</label>
							</div>
						))}
					</div>

					<div className='m-2'>
						<h5>Выберите количество людей в комнате:</h5>
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
								/>
								<label
									className='m-1'
									htmlFor={roomPeople.name}
								>
									{roomPeople.label}
								</label>
							</div>
						))}
					</div>

					<div className='m-2'>
						<h5>Выберите вид из номера:</h5>
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
								/>
								<label className='m-1' htmlFor={roomView.name}>
									{roomView.label}
								</label>
							</div>
						))}
					</div>

					<div className='m-2'>
						<h5>Выберите тип номера:</h5>
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
								/>
								<label className='m-1' htmlFor={roomType.name}>
									{roomType.label}
								</label>
							</div>
						))}
					</div>
				</div>
				{notFoundHotels && (
					<Col md={6} className='mb-3 mb-md-0'>
						<p>
							К сожалению, подходящих отелей найдено не было, но
							вот наши лучшие отели!
						</p>
					</Col>
				)}
				<Row>
					<Col
						md={6}
						className='d-flex align-items-center justify-content-end'
					>
						<Paginator
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageNumber}
						/>
					</Col>
				</Row>
				<Row>{renderHotels()}</Row>
				<Row>
					<Col
						md={6}
						className='d-flex align-items-center justify-content-end'
					>
						<Paginator
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageNumber}
						/>
					</Col>
				</Row>
			</Container>
		</section>
	)
}

export default FilteredHotels
