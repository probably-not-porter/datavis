/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Query functions for database
*/

// IMPORTANT: The pool.js file must be setup before running

p = require('./pool'); // get configurations from public/js/pool.js

const getTrips = (request, response) => {
    p.pool.query("SELECT tripName, tripID from fieldday_trip", (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSites = (request, response) => {
    var id = 23;
    p.pool.query('select distinct fieldday_site.sitename from fieldday_reading where fieldday_site.tripid=21', (error, results) => {
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