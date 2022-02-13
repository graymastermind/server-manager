
import Page from './Page';
import Uptime from'../components/Uptime'


class Test extends Page {


	state = {
		status: 'UP',
		// reset: Date.now(),
		// last_status_update: Date.now(),
		// down_time: 0
	}


	toggleStatus() {

		let { status } = this.state;

		if (status === 'UP')
			status = 'DOWN';
		else
			status = 'UP';

		this._updateState({ status });

	}


	_render() {

		const { status } = this.state;

		return <div>
			<Uptime
				status={status}
				reset={new Date()}
				last_status_update={new Date()}
				down_time={0}
			/>

			<div>
				<b>Status</b>: {status}
			</div>

			<button onClick={this.toggleStatus.bind(this)}>
				TOGGLE
			</button>
		</div>
	}
}

export default  Test;