# DATAVIS TOOL 2.

[![GitHub issues](https://img.shields.io/github/issues/probably-not-porter/datavis)](https://github.com/probably-not-porter/datavis/issues)
[![GitHub license](https://img.shields.io/github/license/probably-not-porter/datavis)](https://github.com/probably-not-porter/datavis/blob/master/LICENSE)
![GitHub repo size](https://img.shields.io/github/repo-size/probably-not-porter/datavis)

A visualization tool for the IFS database using Node.js and the ArcGIS api. Uses queries to fetch data from the Earlham Field Science database and show that data in a graph format, as well as a map format. The goal of this application is to be useful for both information purposes, as well as for field work purposes. This requires that the app be usable on an android device, so that field data can be visualized in real time, but the tool must also be user-friendly enough that someone unfamiliar with the work could use it to look at data from a particular IFS trip.

## Running Locally
This app is set up to be usable on both mobile and desktop platforms. Keep in mind that whatever machine is hosting the Node server might need to be connected to the same network that your Database is set up on. 

It is possible to have the database and this tool running on the same machine, which would allow users to access the front-end of the tool from either the device running both programs, or any device connected to the same LAN as the host device.
### Desktop Usage
1. clone repository and enter parent directory
2. Follow the format below to create a `.env` file.
3. use `npm install` to add dependencies to node_modules folder
4. use `node index.js` to start a local development server
5. open `localhost:3000` in your favorite browser!

### Mobile Usage
1. Install a UNIX terminal emulator like [Termux (Android)](https://play.google.com/store/apps/details?id=com.termux&hl=en_US).
2. Install some basic tools in the emulator:
    1. ```pkg install git```
    2. ```pkg install nodejs```
    3. ```pkg install nano```
4. clone the repository.
3. Follow the format below to create a `.env` file.
4. Use `npm install` inside the directory to install dependencies.
5. Use `node index.js` to run the server.
6. open `localhost:3000` in your browser.

## Format template for .ENV file

```
DB_NAME=[database user name]
DB_HOST=[database host name]
DB_DATABASE=[database name]
DB_PASSWORD=[databse password]
DB_PORT=[database port]
```

## Dependencies
- dotenv@^8.1.0
- ejs@ ^2.7.1
- express@^4.17.1
- pg@^7.12.1
- restful-api@^0.1.8

