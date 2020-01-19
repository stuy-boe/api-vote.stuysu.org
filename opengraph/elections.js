const router = require("express").Router();
const url = require("url");
const {Elections} = require("./../database");

router.get("/elections", (req, res, next) => {

	req.og.title = "All Elections | Stuy BOE Voting Site";
	req.og.description = "View results of elections from the past as well as up to date information about current elections.";
	next();
});

router.get("/elections/:public_url", async (req, res, next) => {

	let election = await Elections.findOne({where: {public_url: req.params.public_url}});

	if(election){

		req.og.title = `${election.name} | Stuy BOE Voting Site`;
		req.og.description = `Overview of ${election.name}. Vote, view updates, learn about candidates and more.`;
		req.og.image = url.resolve(process.env.PUBLIC_URL || "", election.picture);
	} else {

		req.og.title = "Election not found";
		req.og.description = "There is no election at that url... yet!";
	}

	next();
});

module.exports = router;
