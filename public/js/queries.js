/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Query functions for database
*/

// IMPORTANT: The pool.js file must be setup before running
const pool = require('./pool'); // get configurations from public/js/pool.js

const getTrips = (request, response) => {
    pool.query('SELECT tripName, tripID from fieldday_trip', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

module.exports = { // export routes back to server side.
    getTrips
  }