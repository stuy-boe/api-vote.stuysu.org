const chokidar = require('chokidar');
const cp = require("child_process");

let react_process = cp.spawn("npm", ["start"], {cwd: "./client/"});
let index_process = cp.fork("./index.js");

react_process.stdout.on('data', (data) => {
	console.log(`REACT: ${data}`);
});

chokidar.watch('.', {
	ignored: ['node_modules/*', '.git/*', "client/*", ".idea/*", "*.db", "*.db-journal"]
}).on("change", (filename, stat) => {
	index_process.kill();
	console.log("\n");
	console.log(`${filename} has been changed and the app is restarting`);
	console.log("\n");
	index_process = cp.fork("./index.js");
});

process.stdin.resume();

const exitHandler = () => {
	react_process.kill();
	index_process.kill();
	process.exit();
};

// Cleanup child processes when program exits;
process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);
