# vote.stuysu.org
The latest version of the Stuyvesant High School Board of Elections Voting Site.

## Getting Started
1. Clone the Repository
    ```shell script
    git clone https://github.com/stuy-boe/vote.stuysu.org.git   
    ```
2. Change into the repository directory and install dependencies
    ```shell script
   cd vote.stuysu.org && npm run setup
    ```

If you want to actively develop with hot reloading, run the following command to start both the front-end and back-end side by side. Make sure you [Set your environment variables](#setting-environment-variables) first
```shell script
npm run dev
```

## Environment Variables
A lot of the functionality in the app depends on secret credentials and so it's critical to pass these secrets as environment variables otherwise the app won't function properly. One method for going about this is adding a `.env` file to the root of the project directory.
 
The contents of the `.env` file should be as below with actual values filled in after the equal signs.

#### Example .env FILE
```dotenv
# Optional - Number of active connections to the database
SEQUELIZE_CONN_LIMIT=2

# Required
# The type of database being used
# Can be either mysql|postgres|sqlite|mariadb
# Defaults to sqlite for easier local development
SEQUELIZE_DIALECT=sqlite

# Required if dialect IS SQLite
# Path to database file
# If path is not provided, ./app.db will be used
# Database file will be created if it doesn't exist
SEQUELIZE_STORAGE=./app.db

# Required if dialect IS NOT SQLite
# The host used to connect to the database
SEQUELIZE_HOST=

# Required if dialect IS NOT SQLite 
# The username for connecting to the database
SEQUELIZE_USER=

# Required if dialect IS NOT SQLite
# The password to the database
SEQUELIZE_PASS=

# Required if dialect IS NOT SQLite
# The name of the database to use
SEQUELIZE_DB=

# Optional - Whether to use ssl for database connections.
# Default is true, can be: true|false 
SEQUELIZE_SSL=true

# Optional
# Depends on the database dialect
# If your database communicates on a different port than the default
# Defaults are 3306-mysql 3306-mariadb 5432-postgres
SEQUELIZE_PORT=

# Optional
# Whether to log database queries to the console
# Not recommeneded for production
# Default is false, can be: true|false 
SEQUELIZE_LOGGING=false

# Required
# Used by express session to sign sessions
# Can be a random, hard to guess, long string
# All processes of app must have the same secret
SESSION_SECRET=

# Required - Client ID of Google Cloud Project, used for OAuth
# Must be accesible to both:
# * The backend during runtime
# * The frontend during build time / development
# Learn more here: https://bit.ly/GoogleIdentity
REACT_APP_GOOGLE_CLIENT_ID=
```
There are many ways you can go about setting environment variables and you can do so in any way you'd like. You just need to make sure you define all of the required environment variables.

### Setting environment variables manually
This process for setting variables locally may also be used as is when running the app on a server manually.

Always be sure to define the environment variables with real values if they are not optional. This is important for things like the [Google Client ID](#get-a-google-client-id) and the [Database Information](#getting-a-database)

#### Exporting Variables
In the same bash terminal that you run the app, you may also define environment variables using the `export` command.

For example: 
``export PORT=1999``
This will set the environment variable named `PORT` to `1999`.

#### Using a .env file
You may also use a .env file and it will automatically be parsed when the app is run. 

1. At the root of the project, make a file called `.env`
2. Make sure the file contains all of the required environment variables mentioned in [this template](#example-env-file) (You may copy the template into your `.env` file as-is)
3. Inside of the `client/` folder make a file called `.env.local` that contains all of the environment variables required by the react app. (You may copy the contents of the root `.env` file into this file without issue)

### Setting Environment Variables on Heroku
1. Sign into [heroku.com](https://heroku.com) and visit the page for your app.
2. On the app page, click `Settings` on the tab bar.
3. Click `Reveal Config Vars` next to where it says "Config Vars"
4. Add all of the necessary variables one by one. 
    * Order does not matter but all of the required ones mentioned [here](#environment-variables) must be included.
    * The `key` is the name of the variable (the part preceding the equal sign in the `.env` file)

<!-- TODO ADD GOOGLE APP ENGINE ENV SETTINGS -->

## Deploying on Heroku
1. Sign into [heroku.com](https://heroku.com) and visit the page for your app.
2. On the app page, click `Deploy` on the tab bar.
3. Follow the steps for deploying using the Heroku-CLI or set up automatic deployment using GitHub.

The steps for deploying with the Heroku-CLI are also available [here](https://devcenter.heroku.com/articles/heroku-cli)     

## Getting a Database
This app requires a database to function, but due to the schema being defined with sequelize, you have 4 different options to choose from. 

By default the app will use SQLite and so if the dialect is not changed and no SQLite path is provided, the app will just use/create the database file at the root of the project with the name `app.db`. If you are just testing locally, you don't need to worry about setting the database information and the app will create the database file on its own if necessary. 

It is recommended you use a hosted database solution for production however. You may obtain a managed database from a provider such as Digital Ocean or AWS, or you may want to set up your own database. 

Here are some helpful links for learning how to set up a database.

* [SQLite (Digital Ocean)](https://www.digitalocean.com/community/tutorials/how-and-when-to-use-sqlite)
* [MySQL (Digital Ocean)](https://www.digitalocean.com/community/tutorial_collections/6)
* [Postgre SQL (Digital Ocean)](https://www.digitalocean.com/community/tutorial_collections/91)
* [MariaDB (Linuxize)](https://linuxize.com/post/how-to-install-mariadb-on-ubuntu-18-04/)

## Get a Google Client ID
This site uses OAuth with Google and for that to work, you first need to obtain a Client ID for your project from Google.

1. Visit [https://bit.ly/GoogleIdentity](https://bit.ly/GoogleIdentity)
2. Click the blue button near the top page that says `Configure a project`
3. Select or create a project 
4. Give your project a name
5. When it asks "Where are you calling from", select `Web Browser`
6. It will ask you for an "Authorized Javascript Origin". 
    * This should be the url or your app, with the protocol (http|https) i.e. "https://vote.stuysu.org"
    * Or "http://localhost:3000" (The default port for react is 3000 but this can be changed) if you're just testing locally.
7. Now you should have your Client ID and you should store it as an environmental variable.

If you ever need to edit the Authorized Javascript Origin for your project, you may do so by going [here](https://console.developers.google.com/apis/credentials) and clicking on the credential that says `OAuth client` (Make sure to select the right project!)

## Deployment
The app is ready for instant deployment with Heroku or Google App engine with minimal setup. Make sure you first obtain the proper credentials for services used by the app.

1. If you're manually deploying on a server make sure you complete the [getting started](#getting-started)  steps first.
2. [Choose database](#getting-a-database)
3. [Get Google Client ID](#get-a-google-client-id)
4. Set your environment variables
    * [Manual Deployment](#setting-environment-variables-manually)
    * [Heroku Deployment](#setting-environment-variables-on-heroku)
    * Google app engine steps coming soon
5. Deploy the app!
    * If you're deploying manually, run
        ```shell script
        npm start 
        ```
    * [Deploying on Heroku](#deploying-on-heroku)
    * Deployment on App Engine steps coming soon

Congrats, you're done!
