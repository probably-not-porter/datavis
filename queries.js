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
const getDates = (request, response) => {
    var id = req.params.id;
    p.pool.query('select tripid from fieldday_trip where tripid=' + id, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

module.exports = { // export routes to server side.
    getTrips,
    getDates,
  }