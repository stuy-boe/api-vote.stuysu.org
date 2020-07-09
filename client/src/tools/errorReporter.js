import Honeybadger from 'honeybadger-js';
import { HONEYBADGER_KEY } from '../constants';

let errorReporter;

if (HONEYBADGER_KEY) {
	Honeybadger.configure({
		apiKey: HONEYBADGER_KEY,
		environment: process.env.NODE_ENV,
		logger: console
	});
	errorReporter = Honeybadger;
} else {
	errorReporter = {
		notify: console.error
	};
}

export default errorReporter;
