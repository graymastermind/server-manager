
import Component from '../components/Component';


class Page extends Component {

	constructor(props) {
		
		super(props);


		if (!window.App.history) {
			window.App.history = props.history;
			
			// creating a function to redirect SPAically 
			const redirect = (path) => {
				window.App.history.push(path);
			}

			window.App.redirect = redirect;
			Page.redirect = redirect;

		}


	}

	_componentDidMount() {

	}

	async componentDidMount() {
		await this._componentDidMount();
		window.scrollTo(0, 0);
	}

	_render() {
		return <h1>Please implement <code>_render()</code></h1>
	}

	render() {
		return <div className="page">
			{this._render()}
		</div>
	}

}

export default Page;