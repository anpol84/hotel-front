import React from 'react'
import styles from './FeedbackCard.module.css'

const FeedbackCard = ({
	feedback,
	user,
	isAdmin,
	handleDeleteFeedback,
	handleEditFeedback,
	handleModalClick,
}) => {
	const renderStars = () => {
		const stars = []

		for (let i = 0; i < feedback.mark; i++) {
			stars.push(
				<svg
					key={i}
					width='21'
					height='20'
					viewBox='0 0 21 20'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M10.2316 2.45247L12.1592 8.12703L12.2753 8.46877H12.6362H18.81L13.8348 11.9262L13.5233 12.1427L13.6453 12.502L15.5577 18.1317L10.5191 14.6301L10.2316 14.4303L9.94415 14.6301L4.90559 18.1317L6.81794 12.502L6.93996 12.1427L6.62843 11.9262L1.65331 8.46877H7.82706H8.18797L8.30405 8.12703L10.2316 2.45247Z'
						fill='#FFE53D'
						stroke='#FFE53D'
						stroke-width='1.00753'
					/>
				</svg>
			)
		}
		while (stars.length != 5) {
			stars.push(
				user && user.login === feedback.userLogin ? (
					<svg
						width='21'
						height='19'
						viewBox='0 0 21 19'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M10.6184 1.9051L12.5459 7.57967L12.662 7.9214H13.0229H19.1967L14.2216 11.3789L13.91 11.5954L14.0321 11.9546L15.9444 17.5843L10.9058 14.0827L10.6184 13.8829L10.3309 14.0827L5.29231 17.5843L7.20466 11.9546L7.32668 11.5954L7.01515 11.3789L2.04003 7.9214H8.21378H8.57469L8.69077 7.57967L10.6184 1.9051Z'
							stroke='white'
							stroke-width='1.00753'
						/>
					</svg>
				) : (
					<svg
						width='21'
						height='20'
						viewBox='0 0 21 20'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M10.6574 2.45247L12.585 8.12703L12.7011 8.46877H13.062H19.2358L14.2606 11.9262L13.9491 12.1427L14.0711 12.502L15.9835 18.1317L10.9449 14.6301L10.6574 14.4303L10.3699 14.6301L5.33137 18.1317L7.24372 12.502L7.36574 12.1427L7.05421 11.9262L2.07909 8.46877H8.25284H8.61375L8.72983 8.12703L10.6574 2.45247Z'
							stroke='#C9C9C9'
							stroke-width='1.00753'
						/>
					</svg>
				)
			)
		}

		return <div>{stars}</div>
	}

	return (
		<div
			className={styles.card}
			style={
				user && user.login === feedback.userLogin
					? { background: '#C0DCFF' }
					: {}
			}
		>
			<div className={styles.cardHeader}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='50'
					height='50'
					viewBox='0 0 45 46'
					fill='none'
				>
					<circle
						cx='22.3452'
						cy='22.8711'
						r='22.1656'
						fill={
							user && user.login === feedback.userLogin
								? '#F2F8FF'
								: '#C0DCFF'
						}
					/>
				</svg>
				<div className={styles.headerContent}>
					<div className={styles.userLogin}>{feedback.userLogin}</div>
					{renderStars()}
				</div>
			</div>

			<div
				className={styles.feedbackBody}
				onClick={() => handleModalClick(feedback)}
			>
				{feedback.body.length > 110
					? feedback.body.substring(0, 110) + '...'
					: feedback.body}
			</div>
			<div className={styles.cardFooter}>
				{(isAdmin || (user && user.login === feedback.userLogin)) && (
					<div className={styles.feedbackButtons}>
						<button
							className={styles.editFeedback}
							onClick={e => handleEditFeedback(e, feedback.id)}
						>
							Редактировать
						</button>
						<button
							className={styles.deleteFeedback}
							onClick={e => {
								e.preventDefault()
								handleDeleteFeedback(
									e,
									feedback.id,
									feedback.userLogin
								)
							}}
						>
							Удалить
						</button>
					</div>
				)}
			</div>
			<span
				className={styles.date}
				style={
					user && user.login === feedback.userLogin
						? { color: '#000000' }
						: {}
				}
			>
				{feedback.createdAt}
			</span>
		</div>
	)
}

export default FeedbackCard
