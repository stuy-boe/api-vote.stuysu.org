const mongoose = require('mongoose');
const Candidate = mongoose.model('Candidate');
module.exports = result => Candidate.idLoader.load(result.candidate);
