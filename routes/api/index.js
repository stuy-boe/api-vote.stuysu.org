const router = require("express").Router({mergeParams: true});

router.use("/talos", require("./talos"));
router.use("/elections", require("./elections"));
router.use("/state", require("./state"));

module.exports = router;
