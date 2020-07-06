import Dexie from 'dexie';

const apiCache = new Dexie('apiCache');

apiCache.version(1).stores({
	requests: '++id, url, data, date'
});

export default apiCache;
