import React from 'react';
import { ThemeProvider as Provider } from '@rmwc/theme';

const ThemeProvider = ({ children }) => {
	return (
		<Provider
			options={{
				onPrimary: 'black'
			}}
		>
			{children}
		</Provider>
	);
};

export default ThemeProvider;
