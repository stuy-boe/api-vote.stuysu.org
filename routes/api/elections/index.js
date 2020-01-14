const router = require("express").Router({mergeParams: true});

router.use("/", require("./all"));

module.exports = router;
