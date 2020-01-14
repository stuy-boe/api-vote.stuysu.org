const router = require("express").Router();
const Talos = require("talos-js");
const {Students} = require("./../../../config/database");

let addOrUpdateStudents = (email, grade) => new Promise(resolve => {
	Students
		.findOne({ where: {email} })
		.then(res => {
			// update existing students
			if(res && String(res.grade) !== String(grade) && Number(res.grade) > grade) {
				res.update({email, grade});
				return resolve(1);
			}

			if(res)
				return resolve(0);

			Students.create({email, grade});
			return resolve(1);
		});
});

router.get("/", async (req, res) => {
	const username = req.body.username || "";
	const password = req.body.password || "";

	const user = new Talos( username, password);
	let all_students;
	try {
		all_students = await user.getAllStudents("");
	} catch (error) {
		return res.json({
			success: false,
			error: error.message
		});
	}

	let updatePromises = [];

	all_students.forEach(student => {
		let promise = addOrUpdateStudents(student.user.email, student.grade);
		updatePromises.push(promise);
	});

	let values = await Promise.all(updatePromises);
	let rows_affected = values.reduce((a, b) => a + b, 0);
	res.json({success: true, rows_affected});
});

module.exports = router;
