
import actions from './actions';
import { v4 as uuid } from 'uuid';


const protocol = window.location.protocol.replace('http', 'ws');
const host = window.location.host;
const websocketURL = `${protocol}//${host}`;

function connect () {

	if (websocket && websocket.connected)
		return;

	websocket = new window.WebSocket(websocketURL);

	websocket.onopen = onConnectedHandler;
	websocket.onclose = reconnect;
	// websocket.onerror = reconnect;
	websocket.onmessage = onMessageHandler;
}

function reconnect() {

	if (websocket && websocket.connected)
		return;

	setTimeout(connect, 3000);
}


function sendToServer(type, payload) {
	const message = JSON.stringify({ type, payload });
	websocket.send(message);
}


function onConnectedHandler() {

	// request servers
	if (!hasReceivedServers)
		sendToServer('get-servers');
}


function onMessageHandler({ data }) {

	try {
		const message = JSON.parse(data);
		const { type, payload } = message;

		switch (type) {

			case 'servers':

				actions.setServers(payload);
				hasReceivedServers = true;
				break;

			case 'changes':
			
				const { changes, name } = payload
				actions.updateServer(name, changes);
				break;


			case 'response':

				processResponse(payload);
				break;

			case 'add-server':

				const server = payload.server;
				actions.addServer(server);
				break;

			default:
				return;
		}
	} catch (err) {
		return;
	}
}


function init() {
	connect();
}


const requests = new Map();

function removeRequestObject(requestID) {
	requests.delete(requestID);
}


function processResponse(response) {

	const { requestID, success, payload } = response;

	const { resolve, reject, timer } = requests.get(requestID) || {
		resolve:() => {},
		reject: () => {}
	}

	clearTimeout(timer);
	removeRequestObject(requestID);

	if (success)
		resolve(payload);
	else
		reject(payload);

}


function request(type, payload) {

	return new Promise((resolve, reject) => {

		const requestID = uuid();
		const timer = setTimeout(() => {

		}, 30000);

		requests.set(requestID, { resolve, reject , timer });

		sendToServer('request', {
			requestID,
			payload,
			type,
		});

	});
}





let websocket, hasReceivedServers = false;


const _exports = {
	init,
	request
}

export default _exports;
export { init, request }