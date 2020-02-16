const router = require("express").Router();
const url = require("url");
const {Elections} = require("../../database");

router.get("/", (req, res, next) => {

	req.og.title = "All Elections | Stuy BOE Voting Site";
	req.og.description = "View results of elections from the past as well as up to date information about current elections.";
	next();
});

router.use("/:public_url", async (req, res, next) => {

	req.election = await Elections.findOne({where: {public_url: req.params.public_url}});

	if(req.election){

		req.og.title = `${req.election.name} | Stuy BOE Voting Site`;
		req.og.description = `Overview of ${req.election.name}. Vote, view updates, learn about candidates and more.`;
		req.og.image = url.resolve(process.env.PUBLIC_URL || "", req.election.picture);
	} else {

		req.og.title = "Election not found";
		req.og.description = "There is no election at that url... yet!";
	}

	next();
});

module.exports = router;
