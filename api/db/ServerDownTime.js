


const { Model, DataTypes } = require('sequelize');

class ServerDownTime extends Model {

	static init(sequelize) {
		super.init({
			uptime: DataTypes.DATE,
		}, { sequelize, modelName: 'ServerDownTime' });
	}
}


module.exports = ServerDownTime;