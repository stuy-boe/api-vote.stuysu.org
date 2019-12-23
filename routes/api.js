const router = require("express").Router();

router.get("/api/state", require("./api/state"));

module.exports = router;
