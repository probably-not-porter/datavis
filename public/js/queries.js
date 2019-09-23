/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Query functions for database
*/

const pool = require('./pool');

const getTrips = (request, response) => {
    pool.query('SELECT tripName, tripID from fieldday_trip', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

module.exports = {
    getTrips
  }