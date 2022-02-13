

const userConnections = new Set();


function addUserConnection(conn) {
	userConnections.add(conn);
}

function removeUserConnection(conn) {
	userConnections.delete(conn);
}

function getUserConnections() {
	return [ ...userConnections ];
}


module.exports = {
	addUserConnection,
	getUserConnections,
	removeUserConnection
}