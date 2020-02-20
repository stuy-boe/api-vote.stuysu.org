const {Students} = require("./../index");

Students.prototype.getGrade = async function(email) {
	const student = await Students.findOne({where: {email}});

	return student ? student.grade : null;
};

module.exports = Students;
