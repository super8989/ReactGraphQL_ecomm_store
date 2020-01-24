import React, { Component } from 'react';

class Brews extends Component {
	componentDidMount() {
		console.log(this.props.match.params.brandId);
	}

	render() {
		return <div>Brews</div>;
	}
}

export default Brews;
