const router = require("express").Router({mergeParams: true});

router.use("/api", require("./api"));
router.use("/auth", require("./auth"));
router.use("/s3", require("./s3"));

module.exports = router;
