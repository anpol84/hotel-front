import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api'
import styles from './Register.module.css'

const Register = () => {
	const [registration, setRegistration] = useState({
		login: '',
		password: '',
	})
	const navigate = useNavigate()

	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	const handleInputChange = e => {
		setRegistration({ ...registration, [e.target.name]: e.target.value })
	}

	const handleRegistration = e => {
		e.preventDefault()
		register(registration)
			.then(response => {
				document.cookie = `token=${response.data.token}; path=/`
				setSuccessMessage('Registration success!')
				setErrorMessage('')
				setRegistration({
					login: '',
					password: '',
				})
				setTimeout(() => {
					navigate('/')
				}, 3000)
			})
			.catch(error => {
				setErrorMessage(error.response.data.message)
			})
		setTimeout(() => {
			setErrorMessage('')
			setSuccessMessage('')
		}, 5000)
	}

	if (successMessage) {
		return (
			<div className={styles.successRegister}>
				<p className={styles.successRegisterMessage}>
					Вы зарегистрированы!
				</p>
				<svg
					className={styles.successRegisterImg}
					width='280'
					height='280'
					viewBox='0 0 348 349'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M347.909 174.459C347.909 270.529 270.028 348.409 173.958 348.409C77.8884 348.409 0.00818926 270.529 0.00818926 174.459C-0.911007 75.1766 75.6605 -7.2686 173.958 0.508866C270.028 0.508866 347.909 78.389 347.909 174.459Z'
						fill='#66ABFF'
					/>
					<path
						d='M163.535 312.507C165.62 312.739 172.569 323.394 179.054 324.783C187.162 331.269 185.308 306.022 183.918 291.198C182.528 276.374 206.849 277.995 223.063 277.764C239.276 277.532 230.011 252.517 252.247 249.969C274.483 247.421 272.167 232.597 265.682 228.196C236.034 215.457 195.731 188.588 183.918 176.312C174.72 166.753 148.248 178.165 141.067 166.121C133.887 154.076 151.954 155.697 143.615 142.263C135.277 128.829 129.023 148.749 123.464 143.653C117.905 138.557 125.317 123.038 143.615 118.174C161.914 113.31 167.936 135.314 170.947 128.829C173.958 122.343 186.698 119.564 194.341 118.174C201.985 116.784 176.969 88.5262 192.257 87.5997C207.544 86.6732 223.526 73.2389 216.346 71.8492C209.165 70.4594 195.499 56.0987 181.602 48.6867C167.704 41.2747 165.388 59.3414 160.292 57.7201C155.197 56.0987 142.457 37.5687 148.248 38.032C154.038 38.4952 167.241 32.473 179.98 30.8516C192.72 29.2302 188.319 46.8337 200.363 45.6756C212.408 44.5175 201.985 32.473 188.319 19.7336C174.653 6.99425 153.807 19.7336 154.965 16.7225C156.123 13.7114 153.728 1 144 1C102.5 5.5 82.129 21.5 70 29.5C65.5824 32.4137 66.4845 49.15 67.6426 59.3414C68.8007 69.5329 48.6494 118.637 55.5981 123.038C62.5468 127.439 68.8007 79.956 69.264 102.655C69.7272 125.354 72.0435 139.02 94.9743 145.043C117.905 151.065 133.192 173.301 138.52 178.165C143.848 183.029 129.95 193.915 128.097 193.915C126.244 193.915 127.17 207.35 125.086 218.468C123.001 229.586 126.244 264.184 138.52 266.5C150.796 268.816 153.257 286.184 156.5 288.5C159.743 290.816 161.451 312.276 163.535 312.507Z'
						fill='#FF780A'
					/>
					<path
						d='M297.414 289.577C294.403 302.084 273.02 309.496 281.358 311.118C351 257 353.5 177.5 343.739 136.009C342.997 132.853 309.922 138.789 313.86 152.455C317.797 166.121 311.312 170.753 297.414 193.916C283.516 217.078 320.577 231.439 324.746 240.24C328.915 249.042 300.425 277.069 297.414 289.577Z'
						fill='#FF780A'
					/>
					<path
						d='M205.228 15.3328C202.449 9.31053 175.117 6.76266 175.117 0.508789C202 0.508789 240.991 9.43791 250.627 20C262.671 33.2026 261.976 54.0141 250.627 59.1099C239.277 64.2056 208.008 21.355 205.228 15.3328Z'
						fill='#FF780A'
					/>
					<g filter='url(#filter0_d_617_337)'>
						<g style={{ mixBlendMode: 'color' }}>
							<path
								d='M94 185L171.5 251.5L254.5 97'
								stroke='#2185FF'
								stroke-width='50'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
						</g>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M224.318 206.009L276.524 108.831C283.058 96.6681 278.495 81.511 266.332 74.9768C254.169 68.4426 239.011 73.0057 232.477 85.1687L183.655 176.048C183.744 176.135 183.832 176.222 183.919 176.312C190.612 183.268 206.452 194.909 224.318 206.009ZM127.639 246.806C124.47 237.261 123.867 224.971 125.086 218.468C126.07 213.22 126.383 207.456 126.634 202.833C126.915 197.661 127.119 193.915 128.097 193.915C129.011 193.915 132.859 191.265 135.882 187.995L110.28 166.027C99.8019 157.036 84.0188 158.242 75.0277 168.72C66.0366 179.198 67.2422 194.982 77.7206 203.973L127.639 246.806Z'
							fill='#FF7401'
						/>
						<path
							d='M94 185L171.5 251.5L254.5 97'
							stroke='white'
							stroke-opacity='0.39'
							stroke-width='50'
							stroke-linecap='round'
							stroke-linejoin='round'
						/>
					</g>
					<defs>
						<filter
							id='filter0_d_617_337'
							x='64.5'
							y='67.4951'
							width='223.506'
							height='217.505'
							filterUnits='userSpaceOnUse'
							color-interpolation-filters='sRGB'
						>
							<feFlood
								flood-opacity='0'
								result='BackgroundImageFix'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='2' dy='2' />
							<feGaussianBlur stdDeviation='3.25' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_617_337'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect1_dropShadow_617_337'
								result='shape'
							/>
						</filter>
					</defs>
				</svg>
			</div>
		)
	}

	return (
		<section className={styles.content}>
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

			<p className={styles.loginHeader}>Регистрация</p>
			<form className={styles.loginForm} onSubmit={handleRegistration}>
				<div className={styles.loginInputDiv}>
					<input
						className={styles.loginInput}
						id='login'
						name='login'
						type='text'
						placeholder='Логин'
						value={registration.login}
						onChange={handleInputChange}
						autoComplete='off'
					/>

					<input
						id='password'
						name='password'
						type='password'
						className={styles.loginInput}
						value={registration.password}
						onChange={handleInputChange}
						placeholder='Пароль'
						autocomplete='new-password'
					/>
				</div>

				<button type='submit' className={styles.loginButton}>
					<p className={styles.buttonText}>Зарегистрироваться</p>
				</button>
			</form>
			<div className={styles.footer}>
				<span className={styles.loginFooter}>Уже есть аккаунт?</span>

				<Link className={styles.loginFooterUrl} to={'/login'}>
					Войти
				</Link>
			</div>
		</section>
	)
}

export default Register
