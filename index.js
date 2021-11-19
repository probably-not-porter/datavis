console.log("\n==================================");
console.log("|         IFS DATAVIS 2          |");
console.log("==================================\n");

const express = require('express');
const app = express();
const q = require('./queries');
var path = require('path');
var rest = new require('restful-api')(app);
var favicon = require('serve-favicon');

app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    res.render("index",{
    })
});
app.use(favicon(__dirname + '/public/img/ec-ifs.png'));
app.use(express.static(__dirname + '/public'));


// Create routes for aquiring DB information from server-side
app.get('/trips', q.getTrips);
app.get('/sites', q.getSites);
app.get('/sectors', q.getSectors);
app.get('/spots', q.getSpots);
app.get('/readingsplatforms', q.getReadingsPlatforms);
app.get('/readingsdates', q.getReadingsDates);
app.get('/readings', q.getReadings);
app.get('/streamingshosts', q.getStreamingsHosts);
app.get('/streamingsplatforms', q.getStreamingsPlatforms);
app.get('/streamingsdates', q.getStreamingsDates);
app.get('/streamings', q.getStreamings);


// LISTEN
app.listen(9900, '0.0.0.0', function (err) {
    if (err) {
     console.log(err)
     return
    }
    console.log('Listening at http://localhost:' + "9900" + '\n')
   })

