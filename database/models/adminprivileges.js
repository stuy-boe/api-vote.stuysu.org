'use strict';
module.exports = (sequelize, DataTypes) => {
	const adminPrivileges = sequelize.define(
		'adminPrivileges',
		{
			email: DataTypes.STRING,
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
	return adminPrivileges;
};
