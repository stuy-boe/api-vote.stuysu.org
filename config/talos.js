const setCookie = require("set-cookie-parser");
const axios = require("axios");
const qs = require('querystring');

class Talos {
	username = "";
	password = "";
	csrfToken = "";
	csrfMiddleware = "";
	sessionID = "";
	expires = new Date();
	validSession = false;

	constructor(username, password) {
		this.username = username;
		this.password = password;
	}

	readyCSRFToken(){
		return new Promise((resolve) => {
			axios.get("https://talos.stuy.edu/auth/login/")
				.then(res => {
					let cookies = setCookie(res.headers["set-cookie"], {map: true});
					this.csrfToken = cookies.csrftoken.value;
					this.csrfMiddleware = res.data.match(/name='csrfmiddlewaretoken' value='(.*)'/)[1];
					resolve();
				});
		});
	}

	readySessionToken(){
		return new Promise((resolve, reject) => {
			let cookieString = `csrftoken=${this.csrfToken}`;

			axios.request({
				url: "https://talos.stuy.edu/auth/login/",
				method: "POST",
				withCredentials: true,
				maxRedirects: 0,
				validateStatus: status => status >= 200 && status < 303,
				headers:{
					Cookie: cookieString,
					Referer: "https://talos.stuy.edu/auth/login/",
					'Content-Type': "application/x-www-form-urlencoded"
				},
				data: qs.stringify({
					username: this.username,
					password: this.password,
					csrfmiddlewaretoken: this.csrfMiddleware,
					next: ""
				})
			})
				.then(res => {
					let cookies = setCookie(res.headers["set-cookie"], {map: true});
					if(! Boolean(cookies.sessionid))
						throw new Error("Invalid login attempt");

					this.csrfToken = cookies.csrftoken.value;
					this.sessionID = cookies.sessionid.value;
					this.validSession = true;
					this.expires = new Date(cookies.sessionid.expires);
					resolve();
				})
				.catch(er => {
					resolve();
				});
		});
	}

	readyTokens(){
		return new Promise(async (resolve) => {
			if(this.validSession && new Date() < this.expires)
				return resolve();

			await this.readyCSRFToken();
			await this.readySessionToken();
			resolve();
		});
	}

	async searchApi(query){
		await this.readyTokens();
		let cookieString = `sessionid=${this.sessionID}`;

		let first_req = await axios.request({
			url: "https://talos.stuy.edu/api/students/",
			method: "GET",
			withCredentials: true,
			validateStatus: status => status >= 200 && status < 303,
			headers:{Cookie: cookieString},
			params: {
				limit: 1,
				search: query,
				format: "json"
			}
		});

		let result_limit = first_req.data.count + 1;

		let fetchResults = await axios.request({
			url: "https://talos.stuy.edu/api/students/",
			method: "GET",
			withCredentials: true,
			validateStatus: status => status >= 200 && status < 303,
			headers:{Cookie: cookieString},
			params: {
				limit: result_limit,
				search: query,
				format: "json"
			}
		});

		return fetchResults.data.results;
	}

}

module.exports = Talos;
