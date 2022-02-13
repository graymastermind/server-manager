

const { server: WebSocketServer, } = require('websocket');
const {
	onDisconnectedHandler,
	onMessageHandler,
	onConnectedHandler,
} = require('./handlers');

const { addUserConnection } = require('./utils');



function init(httpServer) {

	const websocketServer = new WebSocketServer({ httpServer });

	websocketServer.on('request', function(request) {

		const conn = request.accept();

		conn.on('message', onMessageHandler);
		conn.on('close', onDisconnectedHandler);

		const { hostname } = request.resourceURL.query;

		if (hostname) {
			conn.hostname = hostname;
			conn.on('connected', onConnectedHandler);
			conn.emit('connected', conn);
		} else {
			addUserConnection(conn);
		}



	});
}


module.exports = { init }