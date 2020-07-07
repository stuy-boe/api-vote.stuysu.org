const router = require('express').Router();
const Talos = require('talos-js');
const { students } = require('../../database');

let addOrUpdateStudents = (email, grade) =>
	new Promise(resolve => {
		students.findOne({ where: { email } }).then(res => {
			// update existing students
			if (
				res &&
				String(res.grade) !== String(grade) &&
				Number(res.grade) > grade
			) {
				res.update({ email, grade });
				return resolve(1);
			}

			if (res) {
				return resolve(0);
			}

			students.create({ email, grade });
			return resolve(1);
		});
	});

router.get('/', async (req, res) => {
	const username = req.body.username || '';
	const password = req.body.password || '';

	const user = new Talos(username, password);
	let allStudents;

	try {
		allStudents = await user.getAllStudents('');
	} catch (error) {
		return res.json({
			success: false,
			error: {
				message: error.message,
				code: error.code
			}
		});
	}

	let updatePromises = [];

	allStudents.forEach(student => {
		let promise = addOrUpdateStudents(student.user.email, student.grade);
		updatePromises.push(promise);
	});

	let values = await Promise.all(updatePromises);

	let rowsAffected = values.reduce((a, b) => a + b, 0);

	res.json({ success: true, payload: { rowsAffected } });
});

module.exports = router;
