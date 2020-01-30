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
import {
	Elements,
	StripeProvider,
	CardElement,
	injectStripe
} from 'react-stripe-elements';
import { withRouter } from 'react-router-dom';

import ToastMessage from './ToastMessage';
import { getCart, calculatePrice, clearCart, calculateAmount } from '../utils';

import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(apiUrl);

const STRIPE_API_KEY = process.env.REACT_APP_STRIPE_KEY;

class _CheckoutForm extends Component {
	state = {
		cartItems: [],
		address: '',
		postalCode: '',
		city: '',
		confirmationEmailAddress: '',
		toast: false,
		toastMessage: '',
		orderProcessing: false,
		modal: false
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

		this.setState({ modal: true });
	};

	handleSubmitOrder = async () => {
		const { cartItems, city, address, postalCode } = this.state;

		const amount = calculateAmount(cartItems);

		//Process order
		this.setState({ orderProcessing: true });
		let token;

		try {
			const response = await this.props.stripe.createToken();
			token = response.token.id;

			await strapi.createEntry('orders', {
				amount,
				brews: cartItems,
				city,
				postalCode,
				address,
				token
			});
			this.setState({ orderProcessing: false, modal: false });
			clearCart();
			this.showToast('Your order has been successfully submitted!', true);
		} catch (err) {
			this.setState({ orderProcessing: false, modal: false });
			this.showToast(err.message);
		}
	};

	isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
		return !address || !postalCode || !city || !confirmationEmailAddress;
	};

	showToast = (toastMessage, redirect = false) => {
		this.setState({ toast: true, toastMessage });
		setTimeout(
			() =>
				this.setState(
					{ toast: false, toastMessage: '' },
					// if true passed to 'redirect' argument and redirected to home
					() => redirect && this.props.history.push('/')
				),
			3000
		);
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
								{/* Credit Card Element */}
								<CardElement
									id='stripe__input'
									onReady={input => input.focus()}
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
	>
		{/* Order Summary */}
		{!orderProcessing && (
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				direction='column'
				padding={2}
				color='lightWash'
			>
				{cartItems.map(item => (
					<Box key={item._id} padding={1}>
						<Text size='lg' color='red'>
							{item.name} x {item.quantity} - ${item.quantity * item.price}
						</Text>
					</Box>
				))}
				<Box paddingY={2}>
					<Text size='lg' weight='bold'>
						Total: {calculatePrice(cartItems)}
					</Text>
				</Box>
			</Box>
		)}

		{/* Order Processing Spinner */}
		<Spinner
			show={orderProcessing}
			accessibilityLabel='Order Processing Spinner'
		/>
		{orderProcessing && (
			<Box margin={4}>
				<Text align='center' italic>
					Relax and sip some coffee.. ☕️
				</Text>
			</Box>
		)}
	</Modal>
);

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
	<StripeProvider apiKey={STRIPE_API_KEY}>
		<Elements>
			<CheckoutForm />
		</Elements>
	</StripeProvider>
);

export default Checkout;
