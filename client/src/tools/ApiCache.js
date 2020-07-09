import Dexie from 'dexie';
import errorReporter from './errorReporter';

const hasIndexedDB = Boolean(
	window.indexedDB ||
		window.mozIndexedDB ||
		window.webkitIndexedDB ||
		window.msIndexedDB
);

const apiCache = new Dexie('apiCache');

apiCache.version(1).stores({
	requests: '++id, url, data, date'
});

// Wrapper so that we don't run into issues on browsers without indexedDB
class ApiCache {
	static hasIndexedDB = Boolean(
		window.indexedDB ||
			window.mozIndexedDB ||
			window.webkitIndexedDB ||
			window.msIndexedDB
	);

	static async findOne(url) {
		if (!hasIndexedDB) {
			return null;
		}

		try {
			return await apiCache.requests.where({ url }).first();
		} catch (e) {
			if (e.name !== 'NotFoundError') {
				errorReporter.notify(e, {
					url: window.location.href,
					context: {
						apiCacheUrl: url
					},
					action: 'retrieve item from api cache'
				});
			}
		}
		return null;
	}

	static async delete(url) {
		if (!hasIndexedDB) {
			return;
		}

		try {
			await apiCache.requests.where({ url }).delete();
		} catch (e) {
			errorReporter.notify(e, {
				url: window.location.href,
				context: {
					apiCacheUrl: url
				},
				action: 'delete item from api cache'
			});
		}
	}

	static async create(url, data, date) {
		if (!hasIndexedDB) {
			return;
		}

		if (!date) {
			date = new Date();
		}

		return await apiCache.requests.add({
			url,
			data,
			date
		});
	}
}

export default ApiCache;
