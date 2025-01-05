import axios from 'axios'

const USER_API_URL = 'http://localhost:8081/api'
const AUTH_API_URL = 'http://localhost:8080/api'

export const validateToken = token => {
	return axios.post(`${AUTH_API_URL}/validate`, token)
}

export const login = credentials => {
	return axios.post(`${AUTH_API_URL}/auth`, credentials)
}

export const register = userData => {
	return axios.post(`${USER_API_URL}/users`, userData)
}

export const getUser = userData => {
	return axios.get(`${USER_API_URL}/users/${userData.id}`, {
		headers: { token: userData.token },
	})
}

export const deleteUser = userData => {
	return axios.delete(`${USER_API_URL}/users/${userData.id}`, {
		headers: { token: userData.token },
	})
}

export const editUser = (userData, id, token) => {
	return axios.put(`${USER_API_URL}/users/${id}`, userData, {
		headers: { token: token },
	})
}

export const getUsers = token => {
	return axios.get(`${USER_API_URL}/users`, {
		headers: { token: token },
	})
}
