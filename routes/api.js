const router = require("express").Router();

router.get(...require("./api/state"));
router.get(...require("./api/elections/all"));

module.exports = router;
