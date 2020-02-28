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
    pool.query("SELECT tripName, tripID from fieldday_trip;", (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSites = (request, response) => {
    pool.query('SELECT siteName, siteID from fieldday_site where tripid='+ (request.query.id) + ';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSectors = (request, response) => {
    pool.query('SELECT sectorname, sectorid from fieldday_sector where tripid='+ (request.query.tripid) + ' and siteid=' + (request.query.siteid) + ';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSpots = (request, response) => {
    pool.query('SELECT spotid from fieldday_spot where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid +';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getReadingsPlatforms = (request, response) => {
    pool.query('SELECT DISTINCT platformid, (SELECT DISTINCT platformname FROM fieldday_platform where platformid=fieldday_streaming.platformid) FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + ';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getReadingsDates = (request, response) => {
    pool.query('SELECT DISTINCT recordtime FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + " and platformid='" + request.query.platformid + "';", (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getReadings = (request, response) => {    
    var query = "SELECT tripid,siteid,sectorid,spotid,platformid,(SELECT sensortype FROM fieldday_sensor where sensorid=fieldday_reading.sensorid),recordtime,latitude,longitude,elevation,accuracy,satellites,quality,value,value_2,value_3,value_4,value_5,value_6 from fieldday_reading where tripid="+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + ' and ';
    if (request.query.spotids.length > 1){
        query += "(";
    }
    for(x=0;x<request.query.spotids.length;x++){
        if (x > 0){
            query += " OR ";
        }
        query += 'spotid='+ request.query.spotids[x];
    }
    if (request.query.spotids.length > 1){
        query += ")";
    }
    query += ';';

    console.info("Database:" + query);

    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getStreamingsHosts = (request, response) => {
    pool.query('SELECT DISTINCT hostid, (SELECT DISTINCT hostname FROM fieldday_host_temp where hostid=fieldday_streaming.hostid) FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + ';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getStreamingsPlatforms = (request, response) => {
    console.log('SELECT DISTINCT platformid, (SELECT DISTINCT platformname FROM fieldday_platform where platformid=fieldday_streaming.platformid) FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid +' and hostid='+ request.query.hostid + ';');

    pool.query('SELECT DISTINCT platformid, (SELECT DISTINCT platformname FROM fieldday_platform where platformid=fieldday_streaming.platformid) FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid +" and hostid='"+ request.query.hostid + "';", (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getStreamingsDates = (request, response) => {
    pool.query('SELECT DISTINCT recordtime FROM fieldday_streaming where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + " and platformid='" + request.query.platformid + "';", (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getStreamings = (request, response) => {
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
    getStreamingsHosts,
    getStreamingsPlatforms,
    getStreamingsDates,
    getStreamings
  }
