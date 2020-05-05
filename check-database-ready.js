const portscanner = require('portscanner');

const checkMysqlReady = iteration => {
	if (iteration > 10) {
		throw new Error("MySQL didn't get ready in time.");
	}

	// Checks the status of a single port
	portscanner.checkPortStatus(3306, '127.0.0.1', function (error, status) {
		// Status is 'open' if currently in use or 'closed' if available
		if (status === 'open') {
			setTimeout(checkMysqlReady, 2000, iteration + 1);
			console.log('MySQL not ready, trying again in 2 seconds');
		} else {
			console.log('MySQL is ready.');
			process.exit(0);
		}
	});
};

checkMysqlReady(0);
