import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFilteredHotels, validateToken } from '../api.js'

const HotelSearch = () => {
	const [hotel, setHotel] = useState({
		city: '',
		minPrice: '',
	})

	const navigate = useNavigate()

	const handleHotelInputChange = e => {
		const name = e.target.name
		let value = e.target.value
		if (name === 'minPrice') {
			if (!isNaN(value)) {
				value = parseInt(value)
			} else {
				value = ''
			}
		}
		setHotel({ ...hotel, [name]: value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
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
		getFilteredHotels(hotel, tokenCookie.split('=')[1])
			.then(response => {
				navigate('/hotels/filtered', { state: response.data })
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
				<div className='row'>
					<div className='col-md-8 col-lg-6'>
						<form
							onSubmit={handleSubmit}
							className='d-flex flex-column'
						>
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
									value={hotel.city}
									onChange={handleHotelInputChange}
								/>
							</div>
							<div className='mb-3'>
								<label
									htmlFor='minPrice'
									className='form-label'
								>
									Price
								</label>
								<input
									required
									type='text'
									className='form-control'
									id='minPrice'
									name='minPrice'
									value={hotel.minPrice}
									onChange={handleHotelInputChange}
								/>
							</div>

							<div className='d-grid gap-2 mt-2'>
								<button
									type='submit'
									className='btn btn-outline-primary'
								>
									Search hotel
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</>
	)
}

export default HotelSearch
