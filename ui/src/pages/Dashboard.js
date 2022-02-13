
import Page from './Page';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import ServerModal from '../components/ServerModal';
// import actions from '../actions';


class Dashboard extends Page {


	constructor(...args) {

		super(...args);

		this.openServerModal = this.openServerModal.bind(this);
		this.closeServerModal = this.closeServerModal.bind(this);

	}


	openServerModal(event) {

		let serverIndex = event.currentTarget.getAttribute('data-server-index');
		serverIndex = parseInt(serverIndex);

		this._updateState({ serverIndex, serverModalOpen: true });

	}


	closeServerModal() {
		this._updateState({ serverModalOpen: false });
	}


	state = {
		serverIndex: 0,
		serverModalOpen: false
	}


	_render() {

		return <div style={{ padding: 10 }}>
			
			<h1
				style={{
					color: 'grey'
				}}
			>SERVERS</h1>

			<Table>

				<TableHead>
					<TableRow>
						<TableCell><b>NAME</b></TableCell>
						<TableCell><b>STATUS</b></TableCell>
						<TableCell><b>DISK USAGE</b></TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{
						this.props.servers.map((server, index) => {

							const { name, disk_usage, disk_space, status } = server;

							return <TableRow>
								<TableCell>{name}</TableCell>
								<TableCell
								
									style={{
										color: status === 'UP' ? 'green' : 'red'
									}}

								>{status}</TableCell>
								<TableCell
									style={{
										color: disk_usage < 70 ? 'green' : 'red'
									}}
								>
									{parseFloat(disk_usage.toString()).toFixed(1)}% of {parseInt(disk_space)}GB
								</TableCell>
								<TableCell>
									<Button onClick={this.openServerModal} data-server-index={index}>
										more...
									</Button>
								</TableCell>
							</TableRow>
						})
					}
				</TableBody>
			</Table>

			<ServerModal
				open={this.state.serverModalOpen}
				data={this.props.servers[this.state.serverIndex]}
				close={this.closeServerModal}
			/>

		</div>
	}
}

function mapStateToProps(state) {


	return {
		servers: state.servers || []
	}
}

export default connect(mapStateToProps)(Dashboard);