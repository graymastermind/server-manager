
'use strict'

console.clear();

const { getSystemStatus, sendChangesToServer } = require('./utils');


const CHECK_INTERVAL = 5000;


async function checkSystem() {
	const newSystemStatus = await getSystemStatus();
	const changes = {};

	for (let attr in newSystemStatus) {

		if (systemStatus[attr] !== newSystemStatus[attr]) {
			systemStatus[attr] = newSystemStatus[attr];
			changes[attr] = newSystemStatus[attr];
		}
	}

	if (Object.keys(changes).length > 0)
		sendChangesToServer(changes);
}

setInterval(checkSystem, CHECK_INTERVAL);

const systemStatus = {
	disk_space: 0,
	disk_usage: 0,
	cpu_usage: 0
}