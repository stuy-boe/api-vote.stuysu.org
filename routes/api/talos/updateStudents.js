const Talos = require("talos-js");
const {Students} = require("./../../../config/database");

let addOrUpdateStudents = (email, grade) => new Promise(resolve => {
	Students
		.findOne({ where: {email} })
		.then(res => {
			// update existing students
			if(res){
				if(String(res.grade) !== String(grade)) {
					res.update({email, grade});
					return resolve(1);
				}

				return resolve(0);
			}

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

	for(let x = 0; x < all_students.length ; x++){
		try {
			let student = all_students[x];
			let promise = addOrUpdateStudents(student.user.email, student.grade);
			updatePromises.push(promise);
		} catch(er) {
			console.log(er);
		}
	}

	Promise.all(updatePromises).then(values => {
		let rows_affected = values.reduce((a, b) => {
			if(typeof b === "number")
				return a + b;
			return a;
		});
		res.json({success: true, rows_affected});
	})
		.catch(() => res.json({success: false}));
}];
