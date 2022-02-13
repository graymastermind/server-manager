

import Component from './Component';
import Progress from '@mui/material/CircularProgress';

let instance;

// styles
const divStyle = {
	justifyContent: 'center',
	alignItems: 'center',
	position: 'fixed',
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,
	background: 'white', //rgba(0, 0, 0, 0.8)',
	zIndex: 2000,
};


// component definition

class LoadingIndicator extends Component {

	state = {
		display: 'none'
	}

	constructor(...args) {

		super(...args);

		// if (instance)
		// 	return instance;

		instance = this;

	}

	async hide() {
		await this._updateState({ display: 'none' });
		// alert('none');
	}

	async show() {
		await this._updateState({ display: 'flex' });
		// alert('flex');
	}

	render() {

		const display = this.state.display;

		return <div id="div-loading" style={{ ...divStyle, display }}>
			<Progress variant="indeterminate" id="div-loading-indicator" />
		</div>
	}
}

export default LoadingIndicator;

function hideLoading() {
	try {
		instance.hide();
	} catch(err) {}
}

function showLoading() {
	try {
		instance.show();
	} catch(err) {
		alert(err.toString())
	}
}

export {
	hideLoading,
	showLoading
}