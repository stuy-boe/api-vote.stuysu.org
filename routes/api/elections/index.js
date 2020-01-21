const router = require("express").Router({mergeParams: true});

router.use("/", require("./all"));
router.use("/:public_url", require("./selected"));
module.exports = router;
