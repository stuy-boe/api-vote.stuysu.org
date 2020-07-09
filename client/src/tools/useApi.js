import axios from 'axios';
import React, { useCallback } from 'react';

import AppContext from '../comps/context/AppContext';
import { API_URL } from '../constants';

import ApiCache from './ApiCache';
import useIsOnline from './useIsOnline';

const maxAge = 1000 * 86400 * 14;

const useApi = (url, defaultVal = null, handleError = true) => {
	const context = React.useContext(AppContext);
	const isOnline = useIsOnline();

	const [storedInfo, setStoredInfo] = React.useState({
		data: defaultVal,
		checked: false,
		lastUpdated: context.getDate()
	});
	const [serverInfo, setServerInfo] = React.useState({
		data: null,
		checked: false,
		error: null,
		lastUpdated: context.getDate()
	});

	const [cancelTokenSource] = React.useState(axios.CancelToken.source());

	const updateData = useCallback(() => {
		const backend = axios.create({ baseURL: API_URL });

		backend.defaults.withCredentials = true;

		backend
			.get(url, { cancelToken: cancelTokenSource.token })
			.then(async res => {
				setServerInfo({
					data: res.data.payload,
					checked: true,
					error: false,
					lastUpdated: context.getDate()
				});

				await ApiCache.delete(url);

				await ApiCache.create(url, res.data.payload, context.getDate());
			})
			.catch(er => {
				if (!axios.isCancel(er)) {
					setServerInfo({
						data: null,
						checked: true,
						error: er,
						lastUpdated: context.getDate()
					});
				}
			});
	}, [context, cancelTokenSource, url]);

	React.useEffect(() => {
		if (!storedInfo.checked) {
			ApiCache.findOne(url).then(entry => {
				let data, lastUpdated;

				if (entry !== null) {
					// Check to see if the data is expired
					const isFresh =
						new Date(entry.date.getTime() + maxAge) >
						context.getTime();
					data = isFresh ? entry.data : null;
					lastUpdated = context.getDate();
				}

				setStoredInfo({
					data,
					checked: true,
					lastUpdated
				});
			});
		}

		if (!serverInfo.checked && isOnline) {
			updateData();

			// If the component unmounts during the request, cancel the request
			return () => {
				cancelTokenSource.cancel('Component unmounted');
			};
		}
	}, [context, url, isOnline]);

	let data, updated, lastUpdated;

	if (!serverInfo.data) {
		data = storedInfo.data;
		lastUpdated = storedInfo.lastUpdated;
		updated = false;
	} else {
		data = serverInfo.data;
		lastUpdated = serverInfo.lastUpdated;
		updated = true;
	}

	const error = serverInfo.error;

	return {
		data,
		updated,
		updateData,
		lastUpdated,
		error
	};
};

export default useApi;
