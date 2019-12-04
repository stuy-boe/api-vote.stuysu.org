const chokidar = require('chokidar');
const cp = require("child_process");

let react_process = cp.spawn("npm", ["start"], {cwd: "./client/"});
let index_process = cp.fork("./index.js");

react_process.stdout.on('data', (data) => {
	console.log(`REACT: ${data}`);
});

chokidar.watch('.', {
	ignored: ['node_modules/*', '.git/*', "client/*", ".idea/*"]
}).on("change", (filename, stat) => {
	index_process.kill();
	console.log("\n");
	console.log(`${filename} has been changed and the app is restarting`);
	console.log("\n");
	index_process = cp.fork("./index.js");
});

process.stdin.resume();

function exitHandler(options, exitCode) {
	react_process.kill();
	index_process.kill();
	if (options.cleanup) console.log('clean');
	if (exitCode || exitCode === 0) console.log(exitCode);
	if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));

process.on('SIGINT', exitHandler.bind(null, {exit:true}));

process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
