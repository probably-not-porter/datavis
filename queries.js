/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Query functions for database
# This file runs on the server side, fetching specific data from the database and handing it off to the client.
*/

// IMPORTANT: The .ENV file must be setup before running, see README for template
const dotenv = require('dotenv');
dotenv.config();

const Pool = require('pg').Pool

const pool = new Pool({
    user: `${process.env.DB_NAME}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_DATABASE}`,
    password: `${process.env.DB_PASSWORD}`,
    port: `${process.env.DB_PORT}`,
})

const getTrips = (request, response) => {
    console.info("Database: SELECT tripName, tripID from fieldday_trip;");
    pool.query("SELECT tripName, tripID from fieldday_trip;", (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSites = (request, response) => {
    console.info('Database: SELECT siteName, siteID from fieldday_site where tripid='+ (request.query.id) + ';');
    pool.query('SELECT siteName, siteID from fieldday_site where tripid='+ (request.query.id) + ';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSectors = (request, response) => {
    console.info('Database: SELECT sectorname, sectorid from fieldday_sector where tripid='+ (request.query.tripid) + ' and siteid=' + (request.query.siteid) + ';');
    pool.query('SELECT sectorname, sectorid from fieldday_sector where tripid='+ (request.query.tripid) + ' and siteid=' + (request.query.siteid) + ';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSpots = (request, response) => {
    console.info('Database: SELECT spotid from fieldday_spot where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid +';');
    pool.query('SELECT spotid from fieldday_spot where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid +';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getReadingsPlatforms = (request, response) => {
    console.info('Database: SELECT DISTINCT platformid, (SELECT DISTINCT platformname FROM fieldday_platform where platformid=fieldday_streaming.platformid) FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + ';');
    pool.query('SELECT DISTINCT platformid, (SELECT DISTINCT platformname FROM fieldday_platform where platformid=fieldday_streaming.platformid) FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + ';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getReadingsDates = (request, response) => {
    console.info('Database: SELECT DISTINCT recordtime FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + " and platformid='" + request.query.platformid + "';");
    pool.query('SELECT DISTINCT recordtime FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + " and platformid='" + request.query.platformid + "';", (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getReadings = (request, response) => {
    console.info("Database: SELECT tripid,siteid,sectorid,spotid,platformid,(SELECT sensortype FROM fieldday_sensor where sensorid=fieldday_reading.sensorid),recordtime,latitude,longitude,elevation,accuracy,satellites,quality,value,value_2,value_3,value_4,value_5,value_6 from fieldday_reading where tripid="+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + ' and spotid='+ request.query.spotid +';');
    pool.query("SELECT tripid,siteid,sectorid,spotid,platformid,(SELECT sensortype FROM fieldday_sensor where sensorid=fieldday_reading.sensorid),recordtime,latitude,longitude,elevation,accuracy,satellites,quality,value,value_2,value_3,value_4,value_5,value_6 from fieldday_reading where tripid="+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + ' and spotid='+ request.query.spotid +';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getStreamingsPlatforms = (request, response) => {
    console.info('Database: SELECT DISTINCT platformid, (SELECT DISTINCT platformname FROM fieldday_platform where platformid=fieldday_streaming.platformid) FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + ';');
    pool.query('SELECT DISTINCT platformid, (SELECT DISTINCT platformname FROM fieldday_platform where platformid=fieldday_streaming.platformid) FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + ';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getStreamingsDates = (request, response) => {
    console.info('Database: SELECT DISTINCT recordtime FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + " and platformid='" + request.query.platformid + "';");
    pool.query('SELECT DISTINCT recordtime FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + " and platformid='" + request.query.platformid + "';", (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getStreamings = (request, response) => {
    console.log('Database: SELECT tripid,siteid,sectorid,hostid,platformid,sensorid,recordtime,longitude,latitude,quality,elevation,accuracy,satellites,value_2,value_3,value_4,value_5,value_6'
    +' from fieldday_streaming where tripid=' + (request.query.tripid) 
    +' and siteid='+ (request.query.siteid) 
    +' and sectorid='+ request.query.sectorid 
    +' and platformid='+ "'"+ request.query.platformid + "'" 
    +" and substr(recordtime::text, 0, 11) like '" + request.query.date + "'" 
    + ';')
    pool.query('SELECT tripid,siteid,sectorid,hostid,platformid,sensorid,(SELECT sensortype FROM fieldday_sensor where sensorid=fieldday_streaming.sensorid),(SELECT sensorunits FROM fieldday_sensor where sensorid=fieldday_streaming.sensorid),recordtime,longitude,latitude,quality,elevation,accuracy,satellites,value_1,value_2,value_3,value_4,value_5,value_6'
    +' from fieldday_streaming where tripid=' + (request.query.tripid) 
    +' and siteid='+ (request.query.siteid) 
    +' and sectorid='+ request.query.sectorid 
    +' and platformid='+ "'"+ request.query.platformid + "'" 
    +" and substr(recordtime::text, 0, 11) like '" + request.query.date + "'" 
    + ';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

function checkConnection(){
    console.log('Database: starting connection...');
    pool.query("SELECT * FROM fieldday_trip;", (error, results) => {
        if (error) {
            console.log('Database: connection to database failed, check .ENV file.');
            console.log('Halting...');
            process.exit(1);
        }else{
            console.log('Database: connection successful!');
        }
    })
}
checkConnection();

module.exports = { // export routes to server side.
    getTrips,
    getSites,
    getSectors,
    getSpots,
    getReadingsPlatforms,
    getReadingsDates,
    getReadings,
    getStreamingsPlatforms,
    getStreamingsDates,
    getStreamings
  }
