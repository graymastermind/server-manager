
import Component from './Component';


class Uptime extends Component {

	updateInterval = 1000;

	state = {
		uptime: 0
	}

	constructor(...args) {
		super(...args);

		this.updateUptime = this.updateUptime.bind(this);
	}


	updateUptime() {

		if (this.props.status !== 'UP') {
			this.down_time += this.updateInterval;
		}

		this.total_time += this.updateInterval;

		const uptime = 100 * (1 - (this.down_time / this.total_time));
		this._updateState({ uptime });
	}


	initializeUptime() {

		if (this.timer)
			clearInterval(this.timer);


		// calculate total time and down time
		this.total_time = Date.now() - (new Date(this.props.reset)).getTime();

		let downTimeAfterStatusChange;

		if (this.props.status === 'UP') {
			downTimeAfterStatusChange = 0;
		} else {
			downTimeAfterStatusChange = Date.now() - (new Date(this.props.last_status_update)).getTime();
		}

		this.down_time = this.props.down_time + downTimeAfterStatusChange;
		this.updateUptime();

		// set timer
		this.timer = setInterval(this.updateUptime, this.updateInterval);

	}


	componentDidUpdate(prevProps) {

		const hasServerChanged = prevProps.server_name !== this.props.server_name;
		const hasBeenReset = prevProps.reset.toString() !== this.props.reset.toString();

		if (hasServerChanged || hasBeenReset) {
			this.initializeUptime();
		}

	}


	componentDidMount() {

		this.initializeUptime();

	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render() {

		// 
		return <span>
			{this.state.uptime.toFixed(3)}%
		</span>
	}
}

export default Uptime;