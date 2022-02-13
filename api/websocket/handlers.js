

const { Server } = require('../db');
const { getUserConnections, removeUserConnection } = require('./utils');
const { sendEmail } = require('../email');



async function processResetServerRequest(payload) {

	console.log(payload);
	const { name } = payload;

	const response = { success: true }

	try {

		const update = {
			reset: Date.now(),
			down_time: 0,
			failed_login_attempts: 0,
			last_status_update: Date.now()
		};

		await Server.update(update, { where: { name }});

		sendServerChangesToUsers(name, update);

	} catch (err) {
		response.success = false;
		console.log(err);
	}

	return response;
}

async function processRequest(conn, request) {

	const { type, payload, requestID } = request;
	let response;


	switch (type) {

		case 'reset-server':

			response = await processResetServerRequest(payload);
			break;

		default:
			response = { succes: true };

	}

	const { success } = response;

	sendMessageToClient(conn, 'response', { requestID, payload: response.payload, success });

}


async function processFailedLoginAttempt(conn) {


	const { hostname } = conn;

	if (!hostname)
		return;

	// notify active users
	const server = await Server.findOne({ where: { name: hostname }});
	if (!server)
		return;

	server.failed_login_attempts++;
	sendServerChangesToUsers(hostname, {
		failed_login_attempts: server.failed_login_attempts
	});

	await server.save();
}


async function processServersRequest(conn) {

	try {
		const servers = await Server.findAll();
		sendMessageToClient(conn, 'servers', servers);
		
	} catch (err) {
		console.log(err);
	}
}


async function processServerStatus(conn, status) {

	const { disk_space, disk_usage } = status;
	const { hostname } = conn;

	if (!hostname)
		return;

	try {
		const results = await Server.upsert({ name: hostname, disk_space, disk_usage }, { where: { name: hostname } });

		if (results[0].isNewRecord) {
			const connections = getUserConnections();
			sendMessageToClient(connections, 'add-server', { server:results[0] });
		}

	} catch (err) {
		console.log(err);
	}
}

async function processChanges(conn, changes) {

	const { hostname } = conn;

	if (!hostname)
		return;

	// send changes to all logged users
	try {
		sendServerChangesToUsers(hostname, changes);
	} catch (err) {
		console.log(err);
	}

	// save changes to database
	const update = {};

	if (changes.disk_space)
		update.disk_space = changes.disk_space;
	if (changes.disk_usage)
		update.disk_usage = changes.disk_usage;

	try {
		await Server.update(update, { where: { name: hostname }});
	} catch (err) {
		console.log(err);
	}

}


function sendServerChangesToUsers(name, changes) {
	const connections = getUserConnections();

	sendMessageToClient(connections, 'changes', {
		name,
		changes
	});
}


function sendMessageToClient(conn, type, payload) {

	const message = JSON.stringify({ type, payload });

	try {

		if (Array.isArray(conn)) {

			for (let i in conn) {
				conn[i].send(message);
			}

		} else {
			conn.send(message);
		}

	} catch (err) {
		console.log(err);
	}
}


async function onConnectedHandler() {

	const { hostname } = this;

	if (!hostname)
		return;

	sendServerChangesToUsers(hostname, {status: 'UP' });


	// update database
	const query = { where: { name: hostname }};
	const server = await Server.findOne(query);

	if (!server)
		return;

	const prev_last_status_update = server.last_status_update;
	server.last_status_update = Date.now();
	server.status = 'UP';
	server.downtime += (Date.now() - (new Date(prev_last_status_update)).getTime())

	await server.save();

}

function onMessageHandler({ utf8Data }) {

	let message;

	try {
		message = JSON.parse(utf8Data);
	} catch (err) {
		return;
	}

	const { payload, type } = message; 

	switch (type) {

		case 'changes':
			processChanges(this, payload);
			break;

		case 'get-servers':
			processServersRequest(this);
			break;

		case 'server-status':
			processServerStatus(this, payload);
			break;

		case 'failed-login-attempt':
			processFailedLoginAttempt(this);
			break;

		case 'request': 
			processRequest(this, payload);
			break;

		default:
			return;
	}
}


async function onDisconnectedHandler() {
 
	const { hostname } = this;

	if (hostname) {


		try {

			sendServerChangesToUsers(hostname, { status: 'DOWN' });
			await Server.update({ status: 'DOWN'}, { where: { name: hostname }});

			await sendEmail({
				to: 'xaviermukodi@gmail.com',
				subject: 'Server Down',
				text: `Server "${hostname}" just got down.`
			});

		} catch (err) {
			console.log(err);
		}



	} else {
		removeUserConnection(this);
	}
}


module.exports = {
	onDisconnectedHandler,
	onMessageHandler,
	onConnectedHandler,
}