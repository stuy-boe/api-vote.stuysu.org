import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Elections } from '../pages/Elections';
import { Helmet } from 'react-helmet';
import { PUBLIC_URL } from '../constants';
import { sendPageView } from '../tools/GoogleAnalytics';
import Admin from '../pages/Admin';
import ErrorPage from '../pages/ErrorPage';
import SearchingVector from '../vectors/searching.svg';

const Content = () => {
	const location = useLocation();

	React.useEffect(sendPageView, [location]);

	return (
		<div>
			{/*(Mostly) Constant Open Graph Properties*/}
			<Helmet>
				<meta
					property="og:url"
					content={PUBLIC_URL + location.pathname}
				/>
				<meta
					property="og:site_name"
					content={'Stuyvesant Board of Elections Voting Site'}
				/>
				<meta property="og:type" content={'website'} />
				<meta
					property="og:description"
					content={
						'This is where voting as well as campaigning for Student Union Elections takes place'
					}
				/>
				<meta
					property="og:image"
					content={PUBLIC_URL + '/img/logo512.png'}
				/>
				<title>Stuy BOE Voting Site</title>
			</Helmet>

			<Switch>
				<Route path={'/'} component={Hello} exact />
				<Route path={'/elections'} component={Elections} />
				<Route path={'/admin'} component={Admin} />
				<Route path={'/'}>
					<ErrorPage
						image={SearchingVector}
						title={'Page Not Found'}
						subtitle={`We've looked everywhere...`}
					/>
				</Route>
			</Switch>
		</div>
	);
};

function Hello() {
	return (
		<div>
			<Helmet>
				<title>{'Home | Stuy BOE Voting Site'}</title>
				<meta
					property="og:title"
					content={'Home | Stuy BOE Voting Site'}
				/>
			</Helmet>
			<h1>Hello World!</h1>
		</div>
	);
}

export default Content;
