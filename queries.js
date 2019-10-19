/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Query functions for database
*/

// IMPORTANT: The pool.js file must be setup before running
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
    console.info("SELECT tripName, tripID from fieldday_trip;");
    pool.query("SELECT tripName, tripID from fieldday_trip;", (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSites = (request, response) => {
    console.info('SELECT siteName, siteID from fieldday_site where tripid='+ (request.query.id) + ';');
    pool.query('SELECT siteName, siteID from fieldday_site where tripid='+ (request.query.id) + ';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSectors = (request, response) => {
    console.info('SELECT sectorname, sectorid from fieldday_sector where tripid='+ (request.query.tripid) + ' and siteid=' + (request.query.siteid) + ';');
    pool.query('SELECT sectorname, sectorid from fieldday_sector where tripid='+ (request.query.tripid) + ' and siteid=' + (request.query.siteid) + ';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSpots = (request, response) => {
    console.info('SELECT spotid from fieldday_spot where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid +';');
    pool.query('SELECT spotid from fieldday_spot where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid +';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getReadings = (request, response) => {
    console.info('SELECT tripid,siteid,sectorid,spotid,platformid,sensorid,recordtime,latitude,longitude,elevation,accuracy,satellites,quality,value,value_2,value_3,value_4,value_5,value_6 from fieldday_reading where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + 'and spotid='+ request.query.spotid +';');
    pool.query('SELECT tripid,siteid,sectorid,spotid,platformid,sensorid,recordtime,latitude,longitude,elevation,accuracy,satellites,quality,value,value_2,value_3,value_4,value_5,value_6 from fieldday_reading where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + 'and spotid='+ request.query.spotid +';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getStreamings = (request, response) => {
    console.info('SELECT tripid,siteid,sectorid,hostid,platformid,sensorid,recordtime,longitude,latitude from fieldday_reading where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + ';');
    pool.query('SELECT tripid,siteid,sectorid,hostid,platformid,sensorid,recordtime,longitude,latitude,quality,elevation,accuracy,satellites,value_2,value_3,value_4,value_5,value_6 from fieldday_reading where tripid='+ (request.query.tripid) +' and siteid='+ (request.query.siteid) +' and sectorid='+ request.query.sectorid + ';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

module.exports = { // export routes to server side.
    getTrips,
    getSites,
    getSectors,
    getSpots,
    getReadings,
    getStreamings
  }