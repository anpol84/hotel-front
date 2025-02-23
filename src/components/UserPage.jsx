import { React, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteUser } from '../api'
import useUser from '../hooks/useUser'

const UserPage = () => {
	const { id } = useParams()
	const { user, error: userError, token } = useUser(id)
	const navigate = useNavigate()
	const [errorMessage, setErrorMessage] = useState('')

	const handleDelete = e => {
		e.preventDefault()
		deleteUser({ id: id, token: token })
			.then(() => navigate('/login'))
			.catch(err => {
				setErrorMessage(
					err.response
						? err.response.data.message
						: 'Ошибка изменения данных пользователя'
				)
			})
	}

	const handleEdit = e => {
		e.preventDefault()
		navigate(`/users/${id}/edit`)
	}

	const combinedError = userError || errorMessage

	return (
		<div className='container'>
			{combinedError && <p className='text-danger'>{combinedError}</p>}
			{user ? (
				<div
					className='card p-5 mt-5'
					style={{ backgroundColor: 'whitesmoke' }}
				>
					<h4 className='card-title text-center'>User Information</h4>
					<div className='card-body'>
						<div className='col-md-10 mx-auto'>
							<div className='card mb-3 shadow'>
								<div className='row g-0'>
									<div className='col-md-10'>
										<div className='card-body'>
											<div className='form-group row'>
												<label className='col-md-2 col-form-label fw-bold'>
													Login:
												</label>
												<div className='col-md-10'>
													<p
														className='card-text'
														style={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															height: '100%',
														}}
													>
														{user.login}
													</p>
												</div>
											</div>
											<hr />
										</div>
									</div>
								</div>
							</div>

							<div className='d-flex justify-content-center'>
								<div className='mx-2'>
									<Link
										to={`/`}
										className='btn btn-outline-info btn-sm'
									>
										На главную
									</Link>
								</div>
								<div className='mx-2'>
									<button
										className='btn btn-danger btn-sm'
										onClick={handleDelete}
									>
										Close account
									</button>
								</div>
								<div className='mx-2'>
									<button
										className='btn btn-warning btn-sm'
										onClick={handleEdit}
									>
										Edit account
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<p>Loading user data...</p>
			)}
		</div>
	)
}

export default UserPage
