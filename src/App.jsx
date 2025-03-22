import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import AddHotel from './components/AddHotel'
import CreateFeedback from './components/CreateFeedback'
import EditFeedback from './components/EditFeedback'
import EditHotel from './components/EditHotel'
import EditUser from './components/EditUser'
import FavouriteHotels from './components/FavouriteHotels'
import FilteredHotels from './components/FilteredHotels'
import GptResponse from './components/GptResponse'
import Home from './components/Home'
import Hotel from './components/Hotel'
import Hotels from './components/Hotels'
import Login from './components/Login'
import Register from './components/Register'
import UserPage from './components/UserPage'
import Users from './components/Users'
import '/node_modules/bootstrap/dist/js/bootstrap.min.js'

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='/users/:id' element={<UserPage />} />
				<Route path='/users/:id/edit' element={<EditUser />} />
				<Route path='/users' element={<Users />} />
				<Route path='/hotels' element={<Hotels />} />
				<Route path='/hotels/:id' element={<Hotel />} />
				<Route path='/hotels/create' element={<AddHotel />} />
				<Route path='/hotels/:id/edit' element={<EditHotel />} />
				<Route
					path='/users/:id/favourite'
					element={<FavouriteHotels />}
				/>
				<Route
					path='/hotels/:id/feedback'
					element={<CreateFeedback />}
				/>
				<Route path='/feedback/:id' element={<EditFeedback />} />
				<Route path='/hotels/filtered' element={<FilteredHotels />} />
				<Route path='/hotels/gpt' element={<GptResponse />} />
			</Routes>
		</Router>
	)
}

export default App
