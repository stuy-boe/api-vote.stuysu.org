const router = require("express").Router({mergeParams: true});

router.use("/login", require("./login"));
router.use("/logout", require("./logout"));

module.exports = router;
