import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as doLogin } from '../api'
import styles from './Login.module.css'

const Login = () => {
	const [error, setError] = useState('')
	const [login, setLogin] = useState({
		login: '',
		password: '',
	})

	const navigate = useNavigate()

	const handleInputChange = e => {
		setLogin({ ...login, [e.target.name]: e.target.value })
	}

	const handleSubmit = e => {
		e.preventDefault()
		doLogin(login)
			.then(response => {
				document.cookie = `token=${response.data.token}; path=/`
				navigate('/')
			})
			.catch(error => {
				setError(error.response.data.message)
				setTimeout(() => {
					setError('')
				}, 4000)
			})
	}

	return (
		<section className={styles.content}>
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

			<p className={styles.loginHeader}>Вход</p>
			<form className={styles.loginForm} onSubmit={handleSubmit}>
				<div className={styles.loginInputDiv}>
					<input
						className={styles.loginInput}
						id='login'
						name='login'
						type='text'
						placeholder='Логин'
						value={login.login}
						onChange={handleInputChange}
						autoComplete='off'
					/>

					<input
						id='password'
						name='password'
						type='password'
						className={styles.loginInput}
						value={login.password}
						onChange={handleInputChange}
						placeholder='Пароль'
						autocomplete='new-password'
					/>
				</div>

				<button type='submit' className={styles.loginButton}>
					<p className={styles.buttonText}>Войти</p>
				</button>
			</form>
			<div className={styles.footer}>
				<span className={styles.loginFooter}>Нет аккаунта?</span>

				<Link className={styles.loginFooterUrl} to={'/register'}>
					Зарегистрироваться
				</Link>
			</div>
		</section>
	)
}

export default Login
