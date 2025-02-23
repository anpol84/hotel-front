import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const validateToken = token => {
	return axios.post(`${API_URL}/validate`, token)
}

export const validateAdmin = token => {
	return axios.post(`${API_URL}/validate/admin`, token)
}

export const login = credentials => {
	return axios.post(`${API_URL}/auth`, credentials)
}

export const register = userData => {
	return axios.post(`${API_URL}/users`, userData)
}

export const getUser = userData => {
	return axios.get(`${API_URL}/users/${userData.id}`, {
		headers: { token: userData.token },
	})
}

export const getHotel = (id, token) => {
	console.log(token)
	return axios.get(`${API_URL}/hotels/${id.id}`, {
		headers: { token: token },
	})
}

export const deleteUser = userData => {
	return axios.delete(`${API_URL}/users/${userData.id}`, {
		headers: { token: userData.token },
	})
}

export const editUser = (userData, id, token) => {
	return axios.put(`${API_URL}/users/${id}`, userData, {
		headers: { token: token },
	})
}

export const editHotel = (hotel, id, token) => {
	return axios.put(`${API_URL}/hotels/${id}`, hotel, {
		headers: { token: token },
	})
}

export const getUsers = token => {
	return axios.get(`${API_URL}/users`, {
		headers: { token: token },
	})
}

export const getHotels = token => {
	return axios.get(`${API_URL}/hotels`, {
		headers: { token: token },
	})
}

export const createHotel = (hotel, token) => {
	return axios.post(`${API_URL}/hotels`, hotel, {
		headers: { token: token },
	})
}

export const deleteHotel = (id, token) => {
	return axios.delete(`${API_URL}/hotels/${id}`, {
		headers: { token: token },
	})
}

export const addFavouriteHotel = (hotelId, userId, token) => {
	return axios.post(`${API_URL}/hotels/favourite/${userId}`, hotelId, {
		headers: { token: token },
	})
}

export const deleteFavouriteHotel = (hotelId, userId, token) => {
	return axios.delete(`${API_URL}/hotels/favourite/${userId}`, {
		headers: { token: token },
		data: hotelId,
	})
}

export const getFavouriteHotels = (userId, token) => {
	return axios.get(`${API_URL}/hotels/favourite/${userId}`, {
		headers: { token: token },
	})
}
