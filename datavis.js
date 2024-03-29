var pjson = require('./package.json');
console.log("===============================================================================");
console.log("|                                                                             |");
console.log("|██ ██████ ██████   ██████   █████ ██████ █████   ██    ██ ██ ██████   ██████ |");
console.log("|██ ██     ██       ██   ██ ██   ██  ██  ██   ██  ██    ██ ██ ██            ██|");
console.log("|██ █████  ██████   ██   ██ ███████  ██  ███████  ██    ██ ██ ██████    █████ |");
console.log("|██ ██         ██   ██   ██ ██   ██  ██  ██   ██   ██  ██  ██     ██   ██     |");
console.log("|██ ██     ██████   ██████  ██   ██  ██  ██   ██    ████   ██ ██████   ███████|");
console.log("|                                                                             |");
console.log("==================================================================== v" + pjson.version + " ==");
console.log("\n");

const express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
const app = express();
var rest = new require('restful-api')(app);
const q = require('./server/queries');

app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    res.render("index",{
    })
});
app.use(favicon(__dirname + '/public/img/ec-ifs.png'));
app.use(express.static(__dirname + '/public'));


// Create routes for aquiring DB information from server-side
app.get('/poolstatus', q.getPool);
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
app.get('/v', function (res, req){
    req.status(200).json(pjson.version);
});

setTimeout((function() {
    console.log("SERVER: Restarting...")
    return process.exit();
}), 86400000);

// LISTEN
app.listen(process.env.PORT || 9900, '0.0.0.0', function (err) {
    if (err) {
     console.log(err)
     return
    }
    console.log('SERVER: Listening on port ' + "9900")
})

