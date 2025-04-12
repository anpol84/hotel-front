import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { askGpt, getFilteredHotels, validateToken } from '../api.js'
import styles from './HotelSearch.module.css'

const HotelSearch = () => {
	const [hotel, setHotel] = useState({
		city: '',
		minPrice: '',
	})

	const [query, setQuery] = useState('')

	const navigate = useNavigate()
	const [errorMessage, setErrorMessage] = useState('')

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

	const handleGptQueryChange = e => {
		console.log(e)
		setQuery(e.target.value)
	}

	const handleSubmit = e => {
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
		}, 5000)
	}
	const handleGptQuery = e => {
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
		askGpt(query, tokenCookie.split('=')[1])
			.then(response => {
				navigate('/hotels/gpt', { state: response.data })
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
			<div className={styles.root}>
				<svg
					className={styles.earth}
					width='749'
					height='749'
					viewBox='0 0 749 749'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M747.99 375.495C747.99 581.77 580.77 748.99 374.495 748.99C168.219 748.99 1.00001 581.77 1.00001 375.495C-0.973633 162.322 163.436 -14.6993 374.495 2.00001C580.77 2.00001 747.99 169.219 747.99 375.495Z'
						fill='#66ABFF'
					/>
					<path
						d='M352.117 671.904C356.593 672.401 371.513 695.278 385.438 698.262C402.845 712.187 398.865 657.978 395.881 626.149C392.897 594.32 445.117 597.801 479.93 597.304C514.743 596.807 494.85 543.095 542.593 537.624C590.337 532.154 585.364 500.325 571.438 490.875C507.78 463.522 421.245 405.832 395.881 379.473C376.132 358.95 319.292 383.452 303.875 357.591C288.458 331.73 327.249 335.211 309.346 306.366C291.442 277.521 278.014 320.291 266.078 309.35C254.142 298.409 270.056 265.087 309.346 254.644C348.635 244.2 361.565 291.446 368.03 277.521C374.496 263.596 401.849 257.628 418.261 254.644C434.673 251.66 380.961 190.985 413.785 188.996C446.609 187.007 480.924 158.162 465.507 155.178C450.09 152.194 420.747 121.359 390.908 105.445C361.068 89.53 356.095 128.322 345.153 124.84C334.212 121.359 306.859 81.5727 319.292 82.5674C331.725 83.5621 360.073 70.6315 387.426 67.1502C414.78 63.6689 405.33 101.466 431.191 98.9793C457.053 96.4927 434.673 70.6315 405.33 43.2783C375.988 15.9252 331.228 43.2783 333.715 36.813C336.201 30.3477 340.18 5.97858 319.292 5.97858C227.286 20.8985 183.521 54.2196 160.147 69.6368C150.661 75.893 143.735 106.439 146.222 128.322C148.708 150.204 105.441 255.638 120.36 265.087C135.28 274.537 148.708 172.584 149.703 221.322C150.698 270.061 155.671 299.403 204.907 312.334C254.142 325.264 286.966 373.008 298.405 383.452C309.844 393.896 280.003 417.27 276.025 417.27C272.046 417.27 274.036 446.116 269.56 469.987C265.084 493.859 272.047 554.036 298.405 559.01C324.764 563.983 324.764 607.251 331.726 612.224C338.689 617.197 347.641 671.406 352.117 671.904Z'
						fill='#FF780A'
					/>
					<path
						d='M639.57 622.668C633.105 649.524 589.34 665.438 607.244 668.92C760.92 536.63 758.147 382.955 739.037 292.938C737.591 286.127 666.427 298.906 674.882 328.249C683.336 357.591 669.411 367.538 639.57 417.271C609.73 467.004 689.304 497.838 698.256 516.737C707.208 535.635 646.036 595.812 639.57 622.668Z'
						fill='#FF780A'
					/>
					<path
						d='M441.635 33.8291C435.667 20.8985 376.982 15.4279 376.982 2C428.705 2 518.423 19.1082 539.112 41.7864C564.973 70.1342 563.481 116.883 539.112 127.825C514.743 138.766 447.603 46.7597 441.635 33.8291Z'
						fill='#FF780A'
					/>
				</svg>
				<div className={styles.filterFormDiv}>
					<form className={styles.filterForm} onSubmit={handleSubmit}>
						<p className={styles.filterFormHeader}>
							Воспользуйтесь фильтрами для поиска
						</p>
						<div className={styles.filterFormInputs}>
							<input
								placeholder='Введите город'
								className={styles.filterFormInput}
								required
								type='text'
								id='city'
								name='city'
								value={hotel.city}
								onChange={handleHotelInputChange}
							/>

							<input
								className={styles.filterFormInput}
								placeholder='Введите цену'
								required
								type='text'
								id='minPrice'
								name='minPrice'
								value={hotel.minPrice}
								onChange={handleHotelInputChange}
							/>
						</div>
						<button
							type='submit'
							className={styles.filterFormButton}
						>
							<p className={styles.buttonText}>Подобрать отели</p>
						</button>
					</form>
				</div>
				<div className={styles.gptFormDiv}>
					<form className={styles.gptForm} onSubmit={handleGptQuery}>
						<p className={styles.gptFormHeader}>
							Введите запрос, и умный бот подберет отель по вашим
							желаниям
						</p>
						<div>
							<textarea
								className={styles.gptFormTextArea}
								required
								id='gptQuery'
								name='gptQuery'
								value={query}
								onChange={handleGptQueryChange}
								placeholder='ваш запрос'
							/>
						</div>
						<div>
							<button
								className={styles.gptFormButton}
								type='submit'
							>
								<p className={styles.gptFormButtonText}>
									Подобрать отели
								</p>
							</button>
						</div>
					</form>
					<div className={styles.examplesDiv}>
						<p className={styles.examplesHeader}>
							Примеры запросов
						</p>
						<div className={styles.example}>
							<p className={styles.exampleText}>
								Подбери отель в Калуге рядом с парком, который
								будет стоить меньше 2800 рублей в сутки на двоих
							</p>
						</div>
						<div className={styles.example}>
							<p className={styles.exampleText}>
								Подбери отель с видом на море, с бассейном и
								завтраками
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default HotelSearch
