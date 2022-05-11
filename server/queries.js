/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# Porter Libby - 2021 - improve some systems for more flexibility
# pelibby16@earlham.edu
#
# Query functions for database
# This file runs on the server side, fetching specific data from the database and handing it off to the client.
*/

// IMPORTANT: The .ENV file must be setup before running, see README for template
const dotenv = require('dotenv');
dotenv.config();

const Pool = require('pg').Pool
var pool = null;
var poolstatus = null;
if (process.env.DB_NAME != null && process.env.DB_HOST != null && process.env.DB_DATABASE != null && process.env.DB_PASSWORD != null && process.env.DB_PORT != null){
    pool = new Pool({
        user: `${process.env.DB_NAME}`,
        host: `${process.env.DB_HOST}`,
        database: `${process.env.DB_DATABASE}`,
        password: `${process.env.DB_PASSWORD}`,
        port: `${process.env.DB_PORT}`,
    })
    checkConnection();
}
else{
    console.log('DATABASE: Connection to database failed, check .ENV file.');
}


function updatePool(user, host, database, password, port){
    if (user != null && host != null && database != null && password != null && port != null){
        pool = new Pool({
            user: `${process.env.DB_NAME}`,
            host: `${process.env.DB_HOST}`,
            database: `${process.env.DB_DATABASE}`,
            password: `${process.env.DB_PASSWORD}`,
            port: `${process.env.DB_PORT}`,
        })
        console.log("DATABASE: Updating DB pool...");
    }
}

const getTrips = (request, response) => {
    if (poolstatus == false){
        response.status(500).json("No database connection!");
        console.log("DATABASE: getTrips query attempted, but no database connection has been established.");
    }
    else{
        var query = "SELECT tripName, tripID, "
        + "(SELECT COUNT(*) FROM fieldday_streaming WHERE tripid=fieldday_trip.tripid) AS s_count, " // get s_count and r_count as the number of nodes in the subtree of each
        + "(SELECT COUNT(*) FROM fieldday_reading WHERE tripid=fieldday_trip.tripid) AS r_count" 
        + " from fieldday_trip;";
        serverOut(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }
}
const getSites = (request, response) => {
    if (poolstatus == false){
        response.status(500).json("No database connection!");
        console.log("DATABASE: getSites query attempted, but no database connection has been established.");
    }
    else{
        var query = 'SELECT siteName, siteID, '
        + "(SELECT COUNT(*) FROM fieldday_streaming WHERE tripid="+ (request.query.id) +" AND siteid=fieldday_site.siteid) AS s_count, " // get s_count and r_count as the number of nodes in the subtree of each
        + "(SELECT COUNT(*) FROM fieldday_reading WHERE tripid="+ (request.query.id) +" AND siteid=fieldday_site.siteid) AS r_count"
        +' from fieldday_site where tripid='+ (request.query.id) + ';';
        serverOut(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }
}
const getSectors = (request, response) => {
    if (poolstatus == false){
        response.status(500).json("No database connection!");
        console.log("DATABASE: getSectors query attempted, but no database connection has been established.");
    }
    else{
        var query = 'SELECT sectorname, sectorid, '
        + "(SELECT COUNT(*) FROM fieldday_streaming WHERE tripid="+ (request.query.tripid) + ' and siteid=' + (request.query.siteid) + " AND sectorid=fieldday_sector.sectorid) AS s_count, " // get s_count and r_count as the number of nodes in the subtree of each
        + "(SELECT COUNT(*) FROM fieldday_reading WHERE tripid="+ (request.query.tripid) + ' and siteid=' + (request.query.siteid) + " AND sectorid=fieldday_sector.sectorid) AS r_count"
        +' from fieldday_sector where tripid='+ (request.query.tripid) 
        + ' and siteid=' + (request.query.siteid) + ';'
        serverOut(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }
}
const getSpots = (request, response) => {
    if (poolstatus == false){
        response.status(500).json("No database connection!");
        console.log("DATABASE: getSpots query attempted, but no database connection has been established.");
    }
    else{
        var query = 'SELECT spotid, '
        + "(SELECT COUNT(*) FROM fieldday_reading WHERE tripid="+ (request.query.tripid) + ' and siteid=' + (request.query.siteid) + ' and sectorid=' + (request.query.sectorid) +  " AND spotid=fieldday_spot.spotid) AS r_count"
        +' from fieldday_spot where tripid='+ (request.query.tripid) 
        +' and siteid='+ (request.query.siteid) 
        +' and sectorid='+ request.query.sectorid +';';
        serverOut(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }
}
const getReadingsPlatforms = (request, response) => {
    if (poolstatus == false){
        response.status(500).json("No database connection!");
        console.log("DATABASE: getReadingsPlatforms query attempted, but no database connection has been established.");
    }
    else{
        var query = 'SELECT DISTINCT platformid, '
        +'(SELECT DISTINCT platformname FROM fieldday_platform where platformid=fieldday_streaming.platformid)'
        +' FROM fieldday_streaming where tripid='+ (request.query.tripid) 
        +' and siteid='+ (request.query.siteid) 
        +' and sectorid='+ request.query.sectorid + ';';
        serverOut(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }
}
const getReadingsDates = (request, response) => {
    if (poolstatus == false){
        response.status(500).json("No database connection!");
        console.log("DATABASE: getReadingsDates query attempted, but no database connection has been established.");
    }
    else{
        var query = 'SELECT DISTINCT recordtime FROM fieldday_streaming where tripid='+ (request.query.tripid) 
        +' and siteid='+ (request.query.siteid) 
        +' and sectorid='+ request.query.sectorid 
        + " and platformid='" + request.query.platformid + "';";
        serverOut(query);
    }

    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getReadings = (request, response) => {    
    if (poolstatus == false){
        response.status(500).json("No database connection!");
        console.log("DATABASE: getReadings query attempted, but no database connection has been established.");
    }
    else{
        var query = "SELECT tripid,siteid,sectorid,spotid,platformid,"
        +"(SELECT DISTINCT tripname FROM fieldday_trip where tripid=fieldday_reading.tripid), "
        +"(SELECT DISTINCT sitename FROM fieldday_site where siteid=fieldday_reading.siteid AND tripid=fieldday_reading.tripid), "
        +"(SELECT DISTINCT sectorname FROM fieldday_sector where sectorid=fieldday_reading.sectorid AND siteid=fieldday_reading.siteid AND tripid=fieldday_reading.tripid), "
        +"(SELECT DISTINCT sensortype FROM fieldday_sensor where sensorid=fieldday_reading.sensorid)"
        +",tripid,siteid,sectorid,platformid,hostid,sensorid,quality,recordtime,satellites,latitude,longitude,elevation,accuracy,satellites,quality,value_1,value_2"
        +",value_3,value_4,value_5,value_6 from fieldday_reading where tripid="+ (request.query.tripid) 
        +' and siteid='+ (request.query.siteid) 
        +' and sectorid='+ request.query.sectorid + ' and ';

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

        serverOut(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }
}
const getStreamingsHosts = (request, response) => {
    if (poolstatus == false){
        response.status(500).json("No database connection!");
        console.log("DATABASE: getStreamingsHosts query attempted, but no database connection has been established.");
    }
    else{
        var query = 'SELECT DISTINCT hostid, '
        + "(SELECT COUNT(*) FROM fieldday_streaming WHERE tripid="+ (request.query.tripid) + ' and siteid=' + (request.query.siteid) + ' AND sectorid=' + request.query.sectorid + " AND hostid=fieldday_streaming.hostid) AS s_count, "
        +'(SELECT DISTINCT hostname FROM fieldday_host_temp where hostid=fieldday_streaming.hostid)'
        +' FROM fieldday_streaming where tripid='+ (request.query.tripid) 
        +' and siteid='+ (request.query.siteid) 
        +' and sectorid='+ request.query.sectorid + ';';
        serverOut(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }
}
const getStreamingsPlatforms = (request, response) => {
    if (poolstatus == false){
        response.status(500).json("No database connection!");
        console.log("DATABASE: getStreamingsPlatforms query attempted, but no database connection has been established.");
    }
    else{
        var query = 'SELECT DISTINCT platformid, '
        +'(SELECT DISTINCT platformname FROM fieldday_platform where platformid=fieldday_streaming.platformid)'
        +' FROM fieldday_streaming where tripid='+ (request.query.tripid) 
        +' and siteid='+ (request.query.siteid) 
        +' and sectorid='+ request.query.sectorid 
        +" and hostid='"+ request.query.hostid + "';";
        serverOut(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }
}
const getStreamingsDates = (request, response) => {
    if (poolstatus == false){
        response.status(500).json("No database connection!");
        console.log("DATABASE: getStreamingsDates query attempted, but no database connection has been established.");
    }
    else{
        var query = 'SELECT DISTINCT recordtime FROM fieldday_streaming where tripid='+ (request.query.tripid) 
        +' and siteid='+ (request.query.siteid) 
        +' and sectorid='+ request.query.sectorid 
        + " and platformid='" + request.query.platformid + "'"
        +" and hostid='"+ request.query.hostid + "';";
        serverOut(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }
}
const getStreamings = (request, response) => {
    if (poolstatus == false){
        response.status(500).json("No database connection!");
        console.log("DATABASE: getStreamings query attempted, but no database connection has been established.");
    }
    else{
        var query = 'SELECT tripid,siteid,sectorid,hostid,platformid,sensorid,'
        +'(SELECT sensortype FROM fieldday_sensor where sensorid=fieldday_streaming.sensorid)'
        +',(SELECT sensorunits FROM fieldday_sensor where sensorid=fieldday_streaming.sensorid)'
        +',recordtime,longitude,latitude,quality,elevation,accuracy,satellites,value_1,value_2,value_3,value_4,value_5,value_6'
        +' from fieldday_streaming where tripid=' + (request.query.tripid) 
        +' and siteid='+ (request.query.siteid) 
        +' and sectorid='+ request.query.sectorid 
        +' and platformid='+ "'"+ request.query.platformid + "'" 
        +" and hostid='"+ request.query.hostid + "'"
        +" and substr(recordtime::text, 0, 11) like '" + request.query.date + "'" + ';';
        serverOut(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }
}
function serverOut(querytext){
    console.info("DATABASE: " + querytext);
}
function checkConnection(){
    console.log('DATABASE: Starting connection...');
    pool.query("SELECT * FROM fieldday_trip;", (error, results) => {
        if (error) {
            console.log('DATABASE: Warning, connection to database failed, check .ENV file or internet connection.');
            poolstatus = false;
        }else{
            console.log('Database: Connection successful!');
            poolstatus = true;
        }
    })
}

// Return pool status to server file.
const getPool = (res,req) => { 
    req.status(200).json(poolstatus)
}


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
    getStreamings,
    getPool
  }
