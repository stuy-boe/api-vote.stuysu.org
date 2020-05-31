'use strict';
module.exports = (sequelize, DataTypes) => {
	const students = sequelize.define(
		'students',
		{
			email: DataTypes.STRING,
			grade: DataTypes.INTEGER
		},
		{}
	);
	students.associate = function (models) {
		// associations can be defined here
	};

	students.getGrade = async function (email) {
		const student = await students.findOne({
			where: { email }
		});

		return student ? student.grade : null;
	};

	return students;
};
