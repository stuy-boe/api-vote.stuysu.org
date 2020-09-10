require('dotenv').config();

const cluster = require('cluster');
const port = Number(process.env.PORT) || 3001;
const app = require('./app');

if (
	process.env.NODE_ENV === 'production' &&
	process.env.DISABLE_CLUSTER !== 'true'
) {
	if (cluster.isMaster) {
		const cpuCount = require('os').cpus().length;
		const numForks = Number(process.env.CLUSTER_NUM_FORKS) || cpuCount;

		console.log(
			`Running production server. Spawning ${numForks} worker processes...`
		);

		// Create a worker for each CPU
		for (let i = 0; i < numForks; i += 1) {
			cluster.fork();
		}

		cluster.on('exit', worker => {
			// Restart the dead process
			console.log(`Worker ${worker.id} died. Restarting...`);
			cluster.fork();
		});
	} else {
		app.listen(port, () =>
			console.log(`Worker ${cluster.worker.id} listening on port ${port}`)
		);
	}
} else {
	// Code to run if we're in development
	app.listen(port, () => console.log(`Listening on port ${port}`));
}
