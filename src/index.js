import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import App from './components/App';
import Navbar from './components/Navbar';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Checkout from './components/Checkout';

import 'gestalt/dist/gestalt.css';
import * as serviceWorker from './serviceWorker';

const Root = () => (
	<Router>
		<>
			<Navbar />
			<Switch>
				<Route component={App} exact path='/' />
				<Route component={Signin} path='/signin' />
				<Route component={Signup} path='/signup' />
				<Route component={Checkout} path='/checkout' />
			</Switch>
		</>
	</Router>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
