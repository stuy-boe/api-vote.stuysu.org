const router = require("express").Router();
const Students = require("./../../../../database/models/Students");

// Middleware to determine if a user can vote before processing the vote
router.use("/", async (req, res, next) => {

	const userCannotVote = reason => {
		req.election.userCanVote = false;
		req.election.userCanVoteReason = reason;
		next();
	};

	if(! req.session.signed_in )
		return userCannotVote("You need to be signed in to vote");

	if( ! req.election.isVotingPeriod() )
		return userCannotVote("It is not currently the voting period for this election.");

	const grade = Students.getGrade(req.session.email);

	if(! await req.election.isAllowedGrade(grade))
		return userCannotVote("You are not allowed to vote for this election");


	if( await req.election.hasVoted(req.session.user_id))
		return userCannotVote("You have already voted!");

	// If we've passed all of the tests and are here, we can assume that the user is able to vote
	req.election.userCanVote = true;
	next();
});

router.get("/eligible", (req, res) => {
	const response = {success: req.election.userCanVote };

	if( ! req.election.userCanVote)
		response.error = req.election.userCanVoteReason;
	
	return res.json(response);
});

router.post("/", async (req, res) => {
	if( ! req.election.userCanVote )
		return res.json({success: false, error: req.election.userCanVoteReason});

	const choices = await req.election.cleanChoices(req.body.choices);

	if( ! Boolean(choices.length) )
		return res.json({success: false, error: "You must choose at least one candidate to vote for."});

	await req.election.storeVote(req.session.user_id, grade, choices);

	await res.json({success: true});
});

module.exports = router;
