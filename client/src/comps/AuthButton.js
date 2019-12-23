import React from "react";
import { GoogleLogin } from 'react-google-login';



export const AuthButton = (props) => {


	return (
		<GoogleLogin
			clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
			buttonText="Login with Google"
			onSuccess={data => console.log(data)}
			onFailure={(data) => {console.log(data)}}
		/>
	)
};
