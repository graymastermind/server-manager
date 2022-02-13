

import Component from './Component';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import Uptime from './Uptime';
import TimeAgo from 'react-timeago';
import { request } from '../websocket';
import { hideLoading, showLoading } from './LoadingIndicator';



class ServerModal extends Component {

	constructor(...args) {

		super(...args);

		this.resetServer = this.resetServer.bind(this);

	}





	async resetServer() {

		showLoading();

		try {

			await request('reset-server', { name: this.props.data.name });

		} catch (err) {
			alert('Something went wrong, try again.');
		}

		hideLoading();
	}


	render() {


		const {
			status='', 
			name='', 
			disk_usage='', 
			disk_space='', 
			cpu_usage='',
			reset=0,
			down_time=0,
			last_status_update=0,
			failed_login_attempts=0
		} = this.props.data || {};

		return <Dialog open={this.props.open}>

			<DialogTitle>Server Info</DialogTitle>

			<DialogContent>

				<Table>
					<TableBody>

						<TableRow>
							<TableCell>
								<b>Server Name</b>
							</TableCell>
							<TableCell>{name}</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<b>Status</b>
							</TableCell>
							<TableCell>
								<span
									style={{
										color: status === 'UP' ? 'green' : 'red'
									}}
								>
									{status}
								</span>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<b>CPU Usage</b>
							</TableCell>
							<TableCell>{cpu_usage}%</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<b>Disk Usage</b>
							</TableCell>
							<TableCell
								style={{
									color: disk_usage < 70 ? 'green' : 'red'
								}}
							>
								{parseFloat(disk_usage.toString()).toFixed(2)}% of {parseInt(disk_space)}GB
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<b>Uptime</b>
							</TableCell>
							<TableCell>
								<Uptime
									reset={reset}
									last_status_update={last_status_update}
									down_time={down_time}
									status={status}
									server_name={name}
								/>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<b>Failed Login Attempts</b>
							</TableCell>
							<TableCell
								style={{
									color: 'red'
								}}
							>{failed_login_attempts}</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<b>Last Reset</b>
							</TableCell>
							<TableCell>
								<TimeAgo date={reset} />
							</TableCell>
						</TableRow>

					</TableBody>
				</Table>
			</DialogContent>

			<DialogActions>

				<Button
					onClick={this.resetServer}
					style={{
						background: 'red'
					}}
					variant="contained"
					size="small"
				>
					RESET
				</Button>

				<Button onClick={this.props.close}>
					CLOSE
				</Button>
			</DialogActions>

		</Dialog>
	}
}


export default ServerModal;