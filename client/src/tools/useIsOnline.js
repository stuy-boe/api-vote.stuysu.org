import React, { useEffect } from 'react';

const useIsOnline = () => {
	const [isOnline, setIsOnline] = React.useState(window.navigator.onLine);

	const updateIsOnline = () => {
		setIsOnline(window.navigator.onLine);
	};

	useEffect(() => {
		window.addEventListener('online', updateIsOnline);
		window.addEventListener('offline', updateIsOnline);
	}, []);

	return isOnline;
};

export default useIsOnline;
