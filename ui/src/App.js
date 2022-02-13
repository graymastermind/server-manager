
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Component } from 'react'

// pages
import Dashboard from './pages/Dashboard';
import Test from './pages/Test';

// components
import LoadingIndicator from './components/LoadingIndicator';
import Navbar from './components/Navbar';

// stuff
import store from './store';
import './App.css';
import { init as initWebsockets} from './websocket';


window.App = {};


class App extends Component {


	componentDidMount() {
		initWebsockets();
	}

	render() {
		return (
			
			<Provider store={store}>

				<Router>

					<LoadingIndicator />
					<Navbar />

					<Routes>
						<Route exact path="/" element={<Dashboard/>} />
						<Route exact path="/test" element={<Test />} />
					</Routes>

				</Router>
			</Provider>
		);
	}
}

export default App;
