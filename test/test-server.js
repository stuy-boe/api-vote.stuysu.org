const app = require('./../app');

describe('app', () => {
  it('server runs without error', function(done) {
    let server;
    try {
      server = app.listen(process.env.PORT || 3001);
      done();
    } finally {
      server.close();
    }
  });
});
