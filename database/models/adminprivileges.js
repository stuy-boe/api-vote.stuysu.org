'use strict';
module.exports = (sequelize, DataTypes) => {
	const adminPrivileges = sequelize.define(
		'adminPrivileges',
		{
			userId: DataTypes.INTEGER,
			privilege: DataTypes.STRING
		},
		{}
	);
	adminPrivileges.associate = function (models) {
		// associations can be defined here
	};

	adminPrivileges.exists = async function (email, privilege) {
		const exists = await adminPrivileges.count({
			where: {
				email,
				privilege
			}
		});

		return Boolean(exists);
	};

	adminPrivileges.list = async function (email) {
		const rows = await adminPrivileges.findAll({
			where: { email }
		});

		return rows.map(row => row.privilege);
	};

	return adminPrivileges;
};
