const Talos = require("talos-js");
const {Students} = require("./../../../config/database");

let addOrUpdateStudents = (email, grade) => new Promise(resolve => {
	Students
		.findOne({ where: {email} })
		.then(res => {
			// update existing students
			if(res && String(res.grade) !== String(grade)) {
				res.update({email, grade});
				return resolve(1);
			}

			if(res)
				return resolve(0);

			Students.create({email, grade});
			return resolve(1);
		});
});

module.exports = ["/api/talos/updateStudents", async (req, res) => {
	const username = req.body.username || "";
	const password = req.body.password || "";
	const user = new Talos( username, password);

	if(! await user.authenticate())
		return res.json({
			success: false,
			error: "The credentials provided are not valid"
		});

	let all_students = await user.getAllStudents("");

	let updatePromises = [];

	all_students.forEach(student => {

		let promise = addOrUpdateStudents(student.user.email, String(student.grade));
		updatePromises.push(promise);

	});


	let values = await Promise.all(updatePromises);
	let rows_affected = values.reduce((a, b) => a + b);
	res.json({success: true, rows_affected});
}];
