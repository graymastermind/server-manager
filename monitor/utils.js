

'use strict'


const osu = require('node-os-utils');
const diskspace = require('diskspace');
const { client: WebSocketClient } = require('websocket');
const os = require('os');

const GB = 1024 * 1024 * 1024;
const drive = process.platform === 'win32' ? __dirname.substring(0, 1) : '/';

/* =================================================== WEBSOCKETS ======================================= */

function connect() {
	client.connect(websocketURL);
}

function reconnect() {
	setTimeout(connect, reconnectDelay);
}

async function onConnectedHandler(_conn) {
	console.log('Connected')
	conn = _conn;

	conn.on('close', onDisconnectedHandler);

	const status = await getSystemStatus();
	sendToServer('server-status', status);

}

function onDisconnectedHandler() {
	console.log('Disconnected');
	reconnect();
}

function onConnectFailedHandler() {
	console.log('Connection failed.');
	reconnect();
}



function sendToServer(type, payload) {

	try {
		const message = JSON.stringify({ type, payload });
		conn.send(message);
	} catch (err) {
		console.warn('WARN:', err.toString());
	}
}

const hostname = os.hostname();
const MANAGER_URL = (process.env.MANAGER_URL || 'ws://localhost:8080').replace(/^http/, 'ws');
const websocketURL = `${MANAGER_URL}?hostname=${hostname}`;
const reconnectDelay = 3000;

const client = new WebSocketClient();
let conn;

// client.on('disconnected', onDisconnectedHandler);
client.on('connectFailed', onConnectFailedHandler);
client.on('connect', onConnectedHandler)

connect();


/* ==================================================== LOGIN ATTEMPTS ============================================ */
const fs = require('fs');
const child_process = require('child_process');
const LOG_FILE_PATH = '/var/log/auth.log';


function isLogValid(log) {
	return false;
}


async function checkLoginAttempts() {

	console.log('====================');

	child_process.exec(`tail -1 ${LOG_FILE_PATH} | grep "Failed password"`, function(err, stdout, stderr) {

		if (err) {
			console.log(err);
			return;
		}

		if (stderr) {
			console.log(stderr);
			return;
		}

		const content = stdout.trim();

		if (content) {
			sendToServer('failed-login-attempt');
		}

	});
}

fs.watch(LOG_FILE_PATH, checkLoginAttempts);



/* ==================================================== HELPERS ============================================ */

function getDiskInfo() {
	return new Promise((resolve, reject) => {
		diskspace.check(drive, function(err, result) {
			if (err)
				reject(err)
			else
				resolve(result);
		})
	})
}

function getCpuUsage() {
	return osu.cpu.usage();
}

async function getSystemStatus() {

	try {

		const disk = await getDiskInfo();
		const disk_space = disk.total / GB;
		const disk_usage = (disk.used * 100) / disk.total;
		const cpu_usage = await getCpuUsage();

		const status = {
			cpu_usage,
			disk_space,
			disk_usage,
		}

		return status;
	} catch (err) {
		return null;
	}
}





function sendChangesToServer(changes) {
	try {
		sendToServer('changes', changes);
	} catch (err) {
		console.log(err.toString());
	}
}


module.exports = {
	getSystemStatus,
	sendChangesToServer,
}