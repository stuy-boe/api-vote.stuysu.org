const router = require("express").Router({mergeParams: true});

router.use("/", require("./all"));
router.use("/:publicUrl", require("./selected"));
module.exports = router;
