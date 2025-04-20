import axios from 'axios'

const API_URL = window.env.VITE_API_PATH || import.meta.env.VITE_API_PATH

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

export const getHotelFeedbacks = hotelId => {
	return axios.get(`${API_URL}/feedback?hotelId=${hotelId}`)
}
export const getFeedback = (feedbackId, token) => {
	return axios.get(`${API_URL}/feedback/${feedbackId}`, {
		headers: { token: token },
	})
}

export const deleteHotelFeedback = (feedbackId, token) => {
	return axios.delete(`${API_URL}/feedback/${feedbackId}`, {
		headers: { token: token },
	})
}

export const editHotelFeedback = (feedbackId, body, token) => {
	return axios.put(`${API_URL}/feedback/${feedbackId}`, body, {
		headers: { token: token },
	})
}

export const createFeedback = (body, token) => {
	return axios.post(`${API_URL}/feedback`, body, {
		headers: { token: token },
	})
}

export const getFilteredHotels = (body, token) => {
	return axios.get(
		`${API_URL}/hotels/filter?minPrice=${body.minPrice}&city=${body.city}`,
		{
			headers: { token: token },
		}
	)
}

export const askGpt = (query, token) => {
	return axios.post(
		`${API_URL}/gpt`,
		{ query: query },
		{
			headers: { token: token },
		}
	)
}
