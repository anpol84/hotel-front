import React from 'react'
import styles from './FeedbackModal.module.css'

const FeedbackModal = ({ feedback, closeModal }) => {
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
		}

		return <div>{stars}</div>
	}

	return (
		<div className={styles.modalContent}>
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
						fill='#C0DCFF'
					/>
				</svg>
				<div className={styles.headerContent}>
					<div className={styles.userLogin}>{feedback.userLogin}</div>
					{renderStars()}
				</div>
			</div>

			<div className={styles.feedbackBody}>{feedback.body}</div>

			<span className={styles.date}>{feedback.createdAt}</span>
			<svg
				width='32'
				height='32'
				viewBox='0 0 52 52'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				style={{
					position: 'absolute',
					cursor: 'pointer',
					right: '-2%',
					top: '-3%',
				}}
				onClick={closeModal}
			>
				<circle cx='25.8408' cy='25.8408' r='25.8408' fill='#F25454' />
				<path
					d='M16.3652 16.3658L36.1765 36.1771M36.1765 16.3658L16.3652 36.1771'
					stroke='white'
					stroke-width='4'
					stroke-linecap='round'
					stroke-linejoin='round'
				/>
			</svg>
		</div>
	)
}

export default FeedbackModal
