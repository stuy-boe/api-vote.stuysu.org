const router = require("express").Router();

router.use("/updateStudents", require("./updateStudents"));

module.exports = router;
