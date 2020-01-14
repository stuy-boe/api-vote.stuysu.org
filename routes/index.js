const router = require("express").Router({mergeParams: true});

router.use("/api", require("./api"));
router.use("/auth", require("./auth"));

module.exports = router;
