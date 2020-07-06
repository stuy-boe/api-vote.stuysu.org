import ReactGA from 'react-ga';
import { GTAG_ID } from '../constants';

export const useGoogleAnalytics = Boolean(GTAG_ID);

if (useGoogleAnalytics) {
	ReactGA.initialize(GTAG_ID);
}

// ReactGA renamed for easier auto-imports
const GoogleAnalytics = ReactGA;

export const sendPageView = () => {
	if (useGoogleAnalytics) {
		ReactGA.pageview(window.location.pathname + window.location.search);
	}
};

export default GoogleAnalytics;
