const router = require("express").Router();

router.get(...require("./api/state"));
router.get(...require("./api/elections/all"));
router.get(...require("./api/talos/updateStudents"));

module.exports = router;
