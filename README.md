# DATAVIS TOOL 2.0
A visualization tool for the IFS database using Node.js and the ArcGIS api. Uses queries to fetch data from the Earlham Field Science database and show that data in a graph format, as well as a map format. Designed in order to be both 

## Running Locally
This app is set up to be usable on both mobile and desktop platforms.
### Desktop Usage
1. clone repository and enter parent directory
2. Follow the format below to create a pool.js file.
3. use `npm install` to add dependencies to node_modules folder
4. use `node index.js` to start a local development server
5. open `localhost:3000` in your favorite browser!

### Mobile Usage
1. Install a UNIX terminal emulator like [Termux (Android)](https://play.google.com/store/apps/details?id=com.termux&hl=en_US).
2. Install some basic tools in the emulator:
a. ```pkg install git```
b. ```pkg install nodejs```
c. ```pkg install nano```
4. clone the repository.
3. Follow the format below to create a pool.js file inside the `datavis` directory.
4. Use `npm install` inside the directory to install dependencies.
5. Use `node index.js` to run the server.
6. open `localhost:3000` in your browser.

## Pool.js file (public/js/pool.js) should look like:
```
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'user',
    host: 'host',
    database: 'db',
    password: 'pw',
    port: 5432,
})
module.exports = {pool}
```

## Dependencies
 - "ejs": "^2.7.1",
 - "express": "^4.17.1",
 - "restful-api": "^0.1.8"

