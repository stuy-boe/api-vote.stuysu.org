import axios from 'axios';
import React, { useCallback } from 'react';

import AppContext from '../comps/context/AppContext';
import { API_URL } from '../constants';

import apiCache from './apiCache';
import useIsOnline from './useIsOnline';

const maxAge = 1000 * 86400 * 14;

const useApi = (url, defaultVal = null) => {
	const context = React.useContext(AppContext);
	const isOnline = useIsOnline();
	const [error, setError] = React.useState(null);
	const [refreshed, setPerformedRequest] = React.useState(false);
	const [data, setData] = React.useState(defaultVal);
	const [cancelTokenSource] = React.useState(axios.CancelToken.source());

	const updateData = useCallback(() => {
		const backend = axios.create({ baseURL: API_URL });

		backend.defaults.withCredentials = true;

		backend
			.get(url, { cancelToken: cancelTokenSource.token })
			.then(async res => {
				if (res.data.success) {
					setData(res.data.payload);

					await apiCache.requests.where({ url }).delete();

					await apiCache.requests.add({
						url,
						data: res.data.payload,
						date: context.getDate()
					});
				} else {
					setError(new Error(res.data.error.message));
				}
			})
			.catch(er => {
				if (!axios.isCancel(er)) {
					setError(er);
				}
			})
			.finally(() => {
				setPerformedRequest(true);
			});
	}, [context, cancelTokenSource, url]);

	React.useEffect(() => {
		apiCache.requests
			.where({ url })
			.first(entry => {
				if (entry) {
					const difference =
						context.getDate().getTime() - entry.date.getTime();

					if (difference < maxAge) {
						setData(entry.data);
					} else {
						apiCache.requests.where({ url }).delete();
					}
				}
			})
			.catch('NotFoundError', e => {});
	}, [context, url]);

	React.useEffect(() => {
		if (!refreshed && isOnline) {
			updateData();
			return () => {
				cancelTokenSource.cancel('Component unmounted');
			};
		}
	}, [cancelTokenSource, updateData, refreshed, isOnline]);

	return { data, error, refreshed, updateData };
};

export default useApi;
