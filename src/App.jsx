import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import EditUser from './components/EditUser'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import UserPage from './components/UserPage'
import Users from './components/Users'

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
			</Routes>
		</Router>
	)
}

export default App
