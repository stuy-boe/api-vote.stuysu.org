const portscanner = require('portscanner');
const args = require('minimist')(process.argv.slice(2));

const port = Number(args['port']);

portscanner.checkPortStatus(port, '127.0.0.1', function (error, status) {
	// Status is 'open' if currently in use or 'closed' if available
	process.exit(status === 'open' ? 0 : 1);
});
