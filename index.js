
const express = require('express');
const app = express();
const q = require('./queries');
var path = require('path');
var rest = new require('restful-api')(app);

app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    res.render("index",{
    })
});


app.use(express.static(__dirname + '/public'));

//////////
app.get('/trips', q.getTrips);
app.get('/dates', q.getDates);
//////////


// LISTEN
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

