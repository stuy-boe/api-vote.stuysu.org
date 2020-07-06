import { useRouteMatch, generatePath } from 'react-router-dom';

const useModifiedRoute = (newRoute, baseRoute) => {
	const routeMatch = useRouteMatch(baseRoute);

	if (!routeMatch) {
		return '';
	}

	const { params } = routeMatch;
	return generatePath(newRoute, params);
};

export default useModifiedRoute;
