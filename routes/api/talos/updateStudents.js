const Talos = require("talos-js");
const {Students} = require("./../../../config/database");

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

	res.json(all_students);

}];
