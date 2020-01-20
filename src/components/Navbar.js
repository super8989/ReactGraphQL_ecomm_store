import React from 'react';
import { Box, Text, Heading, Image } from 'gestalt';
import { NavLink } from 'react-router-dom';

const Navbar = () => (
	<Box
		display='flex'
		alignItems='center'
		justifyContent='around'
		height={70}
		color='midnight'
		padding={1}
		shape='roundedBottom'
	>
		{/* Sign In Link */}
		<NavLink to='/signin'>
			<Text size='xl' color='white'>
				Sign In
			</Text>
		</NavLink>

		{/* Title and Logo */}
		<NavLink to='/'>
			<Image
				alt='brewery logo'
				naturalHeight={1}
				naturalWidth={1}
				src='./icons/logo.svg'
			/>
			<Heading size='xs' color='lightGray'>
				Sam's Brewery
			</Heading>
		</NavLink>

		{/* Sign Up Link */}
		<NavLink to='/signup'>
			<Text size='xl' color='white'>
				Sign Up
			</Text>
		</NavLink>
	</Box>
);

export default Navbar;
