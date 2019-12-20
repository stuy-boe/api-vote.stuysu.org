# vote.stuysu.org
The latest version of the Stuyvesant High School Board of Elections Voting Site.

## Development Steps

1. Clone the Repository
    ```shell script
    git clone https://github.com/stuy-boe/vote.stuysu.org.git   
    ```
2. Change into the repository directory and install dependencies
    ```shell script
   cd vote.stuysu.org && npm install && cd client && npm install
    ```
3. [Set your environment variables](#setting-environment-variables)
4. Run the following command to start both the front-end and back-end side by side.
    ```shell script
   npm run dev
    ```

## Setting environment variables
A lot of the functionality in the app depends on secret credentials and so it's critical to pass these secrets as environment variables otherwise the app won't function properly. One method for going about this is adding a `.env` file to the root of the project directory.
 
The contents of the `.env` file should be as below with actual values filled in after the equal signs.
```dotenv
# Optional - Number of active connections to the database
SEQUELIZE_CONN_LIMIT=5

# Required - The host used to connect to the database
SEQUELIZE_HOST=

# Required - The username for connecting to the database
SEQUELIZE_USER=

# Required - The password for connecting to the database
SEQUELIZE_PASS=

# Required - The name of the database to use
SEQUELIZE_DB=

# Optional - Whether or not to log database queries to the console
SEQUELIZE_LOGGING=false

# Required - Used by express session to sign sessions
# All processes of app must have the same secret
SESSION_SECRET=
```
There are many ways you can go about setting environment variables and you can do so in any way you'd like. You just need to make sure you define all of the required environment variables.


