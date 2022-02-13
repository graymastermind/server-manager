
import store from './store';


function addServer(server) {

	if (server && (typeof server === 'string'))
		return;

	const action = {
		type: 'add-server',
		payload: server
	}

	store.dispatch(action);
	
}

function setServers(servers) {

	if (!Array.isArray(servers))
		return;

	const action = {
		type: 'set-servers',
		payload: servers
	}

	store.dispatch(action);

}


function updateServer(name, changes) {

	const action = {
		type: 'update-server',
		payload: {
			name,
			changes
		}
	}

	store.dispatch(action);
}

const actions = {
	addServer,
	setServers,
	updateServer
}


export default actions;