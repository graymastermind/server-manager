

const { Model, DataTypes } = require('sequelize');

class Server extends Model {

	static init(sequelize) {
		super.init({
			name: {
				unique: true,
				type: DataTypes.STRING,
			},
			status: {
				type: DataTypes.ENUM('UP', 'DOWN'),
				allowNull: false,
				defaultValue: 'UP'
			},
			reset: {
				type: DataTypes.DATE,
				defaultValue: Date.now
			},
			down_time: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			},
			last_status_update: {
				type: DataTypes.DATE,
				defaultValue: Date.now
			},
			disk_space: DataTypes.INTEGER,
			disk_usage: DataTypes.INTEGER,
			failed_login_attempts: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			}
		}, { sequelize, modelName: 'Server' });
	}
}


module.exports = Server;