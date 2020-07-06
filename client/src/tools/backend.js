import axios from 'axios';
import MessageQueue from '../comps/queues/MessageQueue';
import { API_URL } from '../constants';

const backend = axios.create({
	baseURL: API_URL
});

backend.defaults.withCredentials = true;

backend.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (!error.response) {
			MessageQueue.notify({
				body:
					'There was an error performing that action. Check your internet status.',
				actions: [{ icon: 'close' }]
			});
		}

		return Promise.reject(error);
	}
);

export default backend;
