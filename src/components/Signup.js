import React, { Component } from 'react';
import { Container, Box, Button, Heading, Text, TextField } from 'gestalt';

class Signup extends Component {
	render() {
		return (
			<Container>
				<Box
					dangerouslySetInlineStyle={{
						__style: {
							backgroundcolor: '#ebe2da'
						}
					}}
					margin={4}
					padding={4}
					shape='rounded'
					display='flex'
					justifyContent='center'
				>
					{/* Sign Up Form */}
					<form
						style={{
							display: 'inlineBlock',
							textAlign: 'center',
							maxWidth: 450
						}}
					>
						{/* Sign Up Form Heading */}
						<Box
							marginBottom={2}
							display='flex'
							direction='column'
							alignItems='center'
						>
							<Heading color='midnight'>Let's Get Started</Heading>
							<Text italic color='olive'>
								Sign up to order some brews!
							</Text>
						</Box>
					</form>
				</Box>
			</Container>
		);
	}
}

export default Signup;
