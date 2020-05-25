const router = require('express').Router();
const RequestRefusalError = require('../../../utils/RequestRefusalError');

// Only authenticated users can use the /admin endpoint
router.use((req, res, next) => {
  if (!req.session.signedIn) {
    throw new RequestRefusalError(
        'You need to be authenticated to use this endpoint.', 'AUTH_REQUIRED');
  }
  next();
});

router.use('/elections', require('./elections'));

module.exports = router;
