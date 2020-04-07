const router = require("express").Router({mergeParams: true});

// Cross-Origin rules apply to all requests
router.use("*", require("./cors"));

router.use("/api", require("./api"));

router.use("/s3", require("./s3"));

router.use(require("./errorHandler"));

module.exports = router;
