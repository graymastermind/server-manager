
const { Sequelize } = require('sequelize');
const Server = require('./Server');
const ServerDownTime = require('./ServerDownTime');


let initialized = false;

async function init() {

	if (initialized)
		return;

	initialized = true;

	const dialect = `sqlite::${__dirname}/db.sqlite`;
	const sequelize = new Sequelize(dialect, { logging: false, dialect: 'sqlite' });

	await Server.init(sequelize);
	await ServerDownTime.init(sequelize);

	await ServerDownTime.belongsTo(Server);

	await sequelize.sync({ /*force: true*/ });
}


module.exports = {
	init,
	Server,
	ServerDownTime
}