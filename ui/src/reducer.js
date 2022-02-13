

function serverUpdateReducer(state, payload) {

	const { name, changes } = payload;

	const servers = state.servers.map(server => {

		if (server.name === name) {
			return { ...server, ...changes };
		} else {
			return server;
		}

	});

	return { ...state, servers };
	
}


function reducer(state, action={}) {

	const { type, payload } = action;

	switch (type) {

		case 'set-servers':
			return { ...state, servers: payload }

		case 'add-server':

			return {
				...state,
				servers: [
					...state.servers,
					payload
				]
			}


		case 'update-server':

			return serverUpdateReducer(state, payload);

		default:
			return state;
	}
}

export default reducer;