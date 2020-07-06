# vote.stuysu.org

The front-end of the Stuyvesant High School Board of Elections voting site.

[![Stuyvesant Board of Elections](https://circleci.com/gh/stuy-boe/api-vote.stuysu.org.svg?style=svg)](https://github.com/stuy-boe/api.vote.stuysu.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Production

[![Netlify Status](https://api.netlify.com/api/v1/badges/10fe90c0-0522-4dc2-aa7d-701dbf20a1a2/deploy-status)](https://app.netlify.com/sites/vote-stuysu-org/deploys)

The production app is automatically re-deployed by Netlify upon new commits to the master branch.

For this reason access to the master branch will be restricted.

Pull requests to the master branch from the staging branch must:

-   [ ] Pass Circle CI Build and Test steps
-   [ ] Pass Guardrails security test
-   [ ] Successfully build on Netlify
-   [ ] Have at least one code review

## Staging

[![Netlify Status](https://api.netlify.com/api/v1/badges/d6c0fd89-b051-48b5-92c2-36244ebd3145/deploy-status)](https://app.netlify.com/sites/staging-vote-stuysu-org/deploys)

Any commits to the [staging](https://github.com/stuy-boe/vote.stuysu.org/tree/staging) branch will also re-deploy [the staging app](https://staging-vote.stuysu.org)

For this reason, any contributions must be first made to an unprotected branch.

The only requirement for merging into the staging branch is to pass the CircleCI build and test steps as well as the Guardrails security test.

## React Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
