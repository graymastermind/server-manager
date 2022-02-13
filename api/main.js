

'use strict';

console.clear();

const express = require('express');
const { init: initDatabase } = require('./db');
const { init: initWebsockets } = require('./websocket');
const { init: initEmail } = require('./email');

const app = express();

app.use(express.static('static'));

app.get('*', function(req, res) {

	res.sendFile(`${__dirname}/static/index.html`);

});

initDatabase();
const email = 'N0162736C@students.nust.ac.zw';
const password = '210683504';

initEmail({
	service: 'gmail',
	credentials: {
		username: email,
		password
	},
	from: `Server Manager <${email}>`
});


const PORT = process.env.PORT || 8080;

const httpServer = app.listen(PORT, function() {
	console.log('Http server started at', PORT);
	initWebsockets(httpServer);
});