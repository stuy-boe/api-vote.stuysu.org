const app = require("./../app");

it('Server runs without error', function (done) {
	let server;
	try {
		server = app.listen(process.env.PORT || 3001);
		done();
	} finally {
		server.close();
	}
});
