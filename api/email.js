
'use strict'

const nodemailer = require('nodemailer');

let transporter;

async function sendEmail( {to, subject, text, html }) {

	if (transporter === undefined)
		throw new Error('Not Initialized.');

	const mailOptions = { from, to, subject, text, html };
	await transporter.sendMail(mailOptions);
	
}


let initialized = false;
let from;


function init({ host, credentials, service, port, from: _from }) {

	if (initialized)
		return;

	initialized = true;
	from = _from;


	transporter = nodemailer.createTransport({
		host,
		service,
		auth: {
			user: credentials.username,
			pass: credentials.password
		},
		tls: {
			rejectUnauthorized: false
		},
		port,
	});
}

module.exports = { 
	init,
	sendEmail,
};