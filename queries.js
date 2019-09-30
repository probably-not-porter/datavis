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
    user: `${process.env.DBNAME}`,
    host: `${process.env.DBHOST}`,
    database: `${process.env.DATABASE}`,
    password: `${process.env.DBPASSWORD}`,
    port: `${process.env.DBPORT}`,
})



const getTrips = (request, response) => {
    pool.query("SELECT tripName, tripID from fieldday_trip", (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSites = (request, response) => {
    var id = 23;
    pool.query('select distinct fieldday_site.sitename from fieldday_reading where fieldday_site.tripid=21', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

module.exports = { // export routes to server side.
    getTrips,
    getSites,
  }