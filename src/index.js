import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom';

import App from './components/App';
import Navbar from './components/Navbar';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Checkout from './components/Checkout';
import Brews from './components/Brews';
import { getToken } from './utils';

import 'gestalt/dist/gestalt.css';
import * as serviceWorker from './serviceWorker';

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			getToken() !== null ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: '/signin',
						state: { from: props.location }
					}}
				/>
			)
		}
	/>
);

const Root = () => (
	<Router>
		<>
			<Navbar />
			<Switch>
				<Route component={App} exact path='/' />
				<Route component={Signin} path='/signin' />
				<Route component={Signup} path='/signup' />
				<PrivateRoute component={Checkout} path='/checkout' />
				<Route component={Brews} path='/:brandId' />
			</Switch>
		</>
	</Router>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
