const router = require("express").Router();
const Students = require("./../../../../database/models/Students");

router.post("/", async (req, res) => {
	if(! req.session.signed_in )
		return res.json({success: false, error: "You need to be signed in to perform this action"});

	if( ! req.election.isVotingPeriod() )
		return res.json({success: false, error: "It is not currently the voting period for this election."});

	const grade = Students.getGrade(req.session.email);

	if(! await req.election.isAllowedGrade(grade))
		return res.json({success: false, error: "You are not allowed to vote for this election"});


	if( await req.election.hasVoted(req.session.user_id))
		return res.json({success: false, error: "You have already voted!"});

	const choices = await req.election.cleanChoices(req.body.choices);

	if( ! Boolean(choices.length) )
		return res.json({success: false, error: "You must choose at least one candidate to vote for."});


	await req.election.storeVote(req.session.user_id, grade, choices);

	await res.json({success: true});
});

module.exports = router;
