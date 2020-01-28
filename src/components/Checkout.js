import React, { Component } from 'react';
import {
	Container,
	Box,
	Button,
	Heading,
	Text,
	TextField,
	Modal,
	Spinner
} from 'gestalt';

import ToastMessage from './ToastMessage';
import { getCart, calculatePrice } from '../utils';

class Checkout extends Component {
	state = {
		cartItems: [],
		address: '',
		postalCode: '',
		city: '',
		confirmationEmailAddress: '',
		toast: false,
		toastMessage: '',
		orderProcessing: false,
		modal: true
	};

	componentDidMount() {
		this.setState({ cartItems: getCart() });
	}

	handleChange = ({ event, value }) => {
		// console.log({ event, value });
		event.persist();
		this.setState({ [event.target.name]: value });
	};

	handleConfirmOrder = async event => {
		event.preventDefault();

		if (this.isFormEmpty(this.state)) {
			this.showToast('Fill in all fields');
			return;
		}
	};

	handleSubmitOrder = () => {};

	isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
		return !address || !postalCode || !city || !confirmationEmailAddress;
	};

	showToast = toastMessage => {
		this.setState({ toast: true, toastMessage });
		setTimeout(() => this.setState({ toast: false, toastMessage: '' }), 3000);
	};

	closeModal = () => this.setState({ modal: false });

	render() {
		const {
			toast,
			toastMessage,
			cartItems,
			orderProcessing,
			modal
		} = this.state;

		return (
			<Container>
				<Box
					color='darkWash'
					margin={4}
					padding={4}
					shape='rounded'
					display='flex'
					justifyContent='center'
					alignItems='center'
					direction='column'
				>
					{/* Checkout Form Heading */}
					<Heading color='midnight'>Checkout</Heading>
					{cartItems.length > 0 ? (
						<>
							{/* User Cart */}
							<Box
								display='flex'
								justifyContent='center'
								alignItems='center'
								direction='column'
								marginTop={2}
								marginBottom={6}
								color='lightWash'
								shape='rounded'
								padding={4}
							>
								<Text color='darkGray' italic>
									{cartItems.length} items for Checkout
								</Text>
								<Box padding={2}>
									{cartItems.map(item => (
										<Box key={item._id} padding={1}>
											<Text color='midnight'>
												{item.name} x {item.quantity} - $
												{item.quantity * item.price}
											</Text>
										</Box>
									))}
								</Box>
								<Text weight='bold' color='red'>
									Total Amount: {calculatePrice(cartItems)}
								</Text>
							</Box>
							{/* Checkout Form */}
							<form
								style={{
									display: 'inlineBlock',
									textAlign: 'center',
									maxWidth: 450
								}}
								onSubmit={this.handleConfirmOrder}
							>
								{/* Shipping Address Input */}
								<TextField
									id='address'
									type='text'
									name='address'
									placeholder='Shipping Address'
									onChange={this.handleChange}
								/>
								{/* Postal Code Input */}
								<TextField
									id='postalCode'
									type='text'
									name='postalCode'
									placeholder='Postal Code'
									onChange={this.handleChange}
								/>
								{/* City Input */}
								<TextField
									id='city'
									type='text'
									name='city'
									placeholder='City of Residence'
									onChange={this.handleChange}
								/>
								{/* Confirmation Email Address Input */}
								<TextField
									id='confirmationEmailAddress'
									type='email'
									name='confirmationEmailAddress'
									placeholder='Confirmation Email Address'
									onChange={this.handleChange}
								/>
								<button id='stripe__button' type='submit'>
									Submit
								</button>
							</form>
						</>
					) : (
						// Default text if no items in cart
						<Box color='lightWash' shape='rounded' padding={4} margin={4}>
							<Heading align='center' color='watermelon' size='xs'>
								Your Cart is Empty
							</Heading>
							<Text align='center' italic color='red'>
								Add some brews!
							</Text>
						</Box>
					)}
				</Box>
				{/* Confirmation Modal */}
				{modal && (
					<ConfirmationModal
						orderProcessing={orderProcessing}
						cartItems={cartItems}
						closeModal={this.closeModal}
						handleSubmitOrder={this.handleSubmitOrder}
					/>
				)}
				<ToastMessage show={toast} message={toastMessage} />
			</Container>
		);
	}
}

const ConfirmationModal = ({
	orderProcessing,
	cartItems,
	closeModal,
	handleSubmitOrder
}) => (
	<Modal
		accessibilityCloseLabel='close'
		accessibilityModalLabel='Confirm Your Order'
		heading='Confirm Your Order'
		onDismiss={closeModal}
		footer={
			<Box
				display='flex'
				marginRight={-1}
				marginLeft={-1}
				justifyContent='center'
			>
				<Box padding={1}>
					<Button
						size='lg'
						color='blue'
						text='Submit'
						disabled={orderProcessing}
						onClick={handleSubmitOrder}
					/>
				</Box>
				<Box padding={1}>
					<Button
						size='lg'
						color='red'
						text='Cancel'
						disabled={orderProcessing}
						onClick={closeModal}
					/>
				</Box>
			</Box>
		}
		role='alertdialog'
		size='sm'
	></Modal>
);

export default Checkout;
