import Dexie from 'dexie';
import errorReporter from './errorReporter';

let hasIndexedDB = Boolean(
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
	static handleError(e, url, action) {
		if (e.name !== 'NotFoundError' && e.name !== 'OpenFailedError') {
			errorReporter.notify(e, {
				url: window.location.href,
				context: {
					apiCacheUrl: url
				},
				action
			});
		} else {
			hasIndexedDB = false;
		}
	}

	static async findOne(url) {
		if (!hasIndexedDB) {
			return null;
		}

		return new Promise(resolve => {
			apiCache.requests
				.where({ url })
				.first()
				.then(resolve)
				.catch(e => {
					this.handleError(e, url, 'retrieve item from api cache');
					resolve(null);
				});
		});
	}

	static delete(url) {
		if (!hasIndexedDB) {
			return;
		}

		return new Promise(resolve => {
			apiCache.requests
				.where({ url })
				.delete()
				.then(resolve)
				.catch(e => {
					this.handleError(e, url, 'delete from apiCache DB');
					resolve(null);
				});
		});
	}

	static create(url, data, date) {
		if (!hasIndexedDB) {
			return;
		}

		if (!date) {
			date = new Date();
		}

		return new Promise(resolve => {
			apiCache.requests
				.add({
					url,
					data,
					date
				})
				.then(resolve)
				.catch(e => {
					this.handleError(e, url, 'create in apiCache DB');
					resolve(null);
				});
		});
	}
}

export default ApiCache;
