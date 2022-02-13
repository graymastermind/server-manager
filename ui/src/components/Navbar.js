

import Component from './Component';
import AppBar from '@mui/material/AppBar';




function setNavbarHeight() {
	const elem = document.getElementById('appbar');
	const navbarHeight = elem.offsetHeight + 'px';
	document.documentElement.style.setProperty('--navbar-height', navbarHeight);
}



class Navbar extends Component {

	componentDidMount() {


		const resizeObserver = new ResizeObserver(setNavbarHeight);

		resizeObserver.observe(document.getElementById('appbar'));
		this.resizeObserver = resizeObserver;
		setNavbarHeight();

	}

	componentWillUnmount() {
		this.resizeObserver.disconnect();
	}


	render() {
		return <AppBar id="appbar">
			<h3 style={{ marginLeft: 20 }}>SERVER MANAGEMENT</h3>
		</AppBar>
	}
}


export default Navbar;