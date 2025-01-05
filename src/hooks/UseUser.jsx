import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../api'

const useUser = id => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [token, setToken] = useState('')
	const navigate = useNavigate()

	useEffect(() => {
		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))

		if (tokenCookie) {
			const tokenValue = tokenCookie.split('=')[1]
			setToken(tokenValue)
			getUser({ token: tokenValue, id: id })
				.then(response => {
					setUser(response.data)
				})
				.catch(err => {
					setError(err.message)
					navigate('/login')
				})
				.finally(() => {
					setLoading(false)
				})
		} else {
			setLoading(false)
			navigate('/login')
		}
	}, [id, navigate])

	return { user, loading, error, token }
}

export default useUser
