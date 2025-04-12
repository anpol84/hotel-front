import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../api'

const useUser = id => {
	const [user, setUser] = useState(null)
	const [errorMessage, setErrorMessage] = useState('')
	const [token, setToken] = useState('')
	const navigate = useNavigate()

	useEffect(() => {
		const tokenCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
		console.log(tokenCookie)

		if (tokenCookie) {
			const tokenValue = tokenCookie.split('=')[1]
			setToken(tokenValue)
			getUser({ token: tokenValue, id: id })
				.then(response => {
					console.log(response.data)
					setUser(response.data)
				})
				.catch(err => {
					setErrorMessage(err.response.data.message)
					navigate('/login')
				})
		} else {
			navigate('/login')
		}
	}, [id, navigate])

	return { user, errorMessage, token }
}

export default useUser
