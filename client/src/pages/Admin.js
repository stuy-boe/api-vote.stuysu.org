import React from 'react';
import AppContext from '../comps/context/AppContext';
import { Switch, Route, Redirect } from 'react-router-dom';
import AdminElectionsRouter from '../comps/admin/AdminElectionsRouter';
import AccessDeniedVector from '../vectors/x-on-laptop.svg';
import SignInVector from '../vectors/carrying-key.svg';
import ErrorPage from './ErrorPage';
import AuthButton from '../comps/utils/AuthButton';
import FlexCenter from '../comps/utils/FlexCenter';

const Admin = ({ match }) => {
	const context = React.useContext(AppContext);
	if (!context.signedIn) {
		return (
			<ErrorPage
				title={'Sign In Required'}
				image={SignInVector}
				subtitle={
					<span>
						You need to be signed in to access that page. <br />
					</span>
				}
			>
				<FlexCenter>
					<AuthButton />
				</FlexCenter>
			</ErrorPage>
		);
	}

	// TODO: make this route pretty for non-admins
	if (!context.admin.status) {
		return (
			<ErrorPage
				title={'Access Denied'}
				image={AccessDeniedVector}
				subtitle={'Let us know if this is a mistake!'}
			/>
		);
	}

	return (
		<div>
			<Switch>
				<Route path={match.path} exact>
					<Redirect
						to={`${match.path}/${context.admin.privileges[0]}`}
					/>
				</Route>
				<Route
					path={`${match.path}/elections`}
					component={AdminElectionsRouter}
				/>
			</Switch>
		</div>
	);
};

export default Admin;
