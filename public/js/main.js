/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Map and Data functions
*/

// MAP //

var mapstate = 0; // keep track of which map overlay is being used
var default_center = [-13.7055,65.2941]; //default starting coords for the map view

function mapReady(){ // placeholder for now
    switchToData()
}
require([
    "esri/Map",
    "esri/views/MapView"
], function(Map, MapView) {
    var map1 = new Map({ //topo map
        basemap: "topo"
    });
    var map2 = new Map({ //sat map
        basemap: "satellite"
    });
    var view = new MapView({ //init map
        container: "viewDiv",
        map: map1,
        center: default_center,
        zoom: 11
    });
    var coordsWidget = document.createElement("div"); // get coords
    coordsWidget.id = "coordsWidget";
    coordsWidget.className = "esri-widget esri-component";
    coordsWidget.style.padding = "7px 15px 5px";
    view.ui.add(coordsWidget, "bottom-left");

    function showCoordinates(pt) {
        var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) +
            " | Scale 1:" + Math.round(view.scale * 1) / 1 +
            " | Zoom " + view.zoom;
        coordsWidget.innerHTML = coords;
      }

    // LISTENERS // (these ones show up over top of the map canvas)

    view.watch("stationary", function(isStationary) {
        showCoordinates(view.center);
    });

    view.on("pointer-move", function(evt) {
        showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
    });

    // listen for switch to topography button
    document.querySelector("#btn_topo").addEventListener("click", function(event) {
        if (mapstate != 0){
            mapstate = 0;
            unselect('btn_sat');
            select('btn_topo');
            view.map = map1;
            console.log('switch to topo');
        }
        else {
            console.log('already in state 0');
        }
    });
    // listen for switch to satellite button
    document.querySelector("#btn_sat").addEventListener("click", function(event) {
        if (mapstate != 1){
            mapstate = 1;
            select('btn_sat');
            unselect('btn_topo');
            view.map = map2;
            console.log('switch to sat');
        }
        else {
            console.log('already in state 1');
        }
    });
});

// DATA // 

// Arrays (hold on the the db information that gets fetched)
tripnames = [];
tripids = [];

sitenames = [];
siteids = [];

// Gets
function getTrips(){
    tripnames = [];
    tripids = [];
    $.ajax({
        type: 'GET',
        url: '/trips',
        success: function(response) { 
            for(x = 0; x < response.length; x++){
                tripids.push(response[x].tripid);
                tripnames.push(response[x].tripname);
            }
            console.log(tripnames);
            renderTrips(tripnames, tripids);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}
function getSites(site_id){
    sitenames = []
    $.ajax({
        type: 'GET',
        url: '/sites',
        data: {id: site_id},
        success: function(response) { 
            for(x = 0; x < response.length; x++){
                sitenames.push(response[x].sitename);
                siteids.push(response[x].siteid);
            }
            console.log(sitenames);
            renderSites(sitenames, siteids);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}

// Renders
function renderTrips(tripnames, tripids){
    var container = document.getElementById('trips');
    if (container.childElementCount == 0){ // dont override selections with navigation
        container.innerHTML += "<div class='data-header'><h1>Trips</h1></div>";
        for(x = 0; x < tripnames.length; x++){
            var elem = createRadioElementTrips('trips', false, tripnames[x],tripids[x]); // util function
            container.innerHTML += elem;
        }
    }
}
function renderSites(sitename, siteid){
    var container = document.getElementById('sites');
    container.innerHTML = "";
    container.innerHTML += "<div class='data-header'><h1>Sites</h1></div>";
    for(x = 0; x < sitenames.length; x++){
        var elem = createRadioElementSites('sites', false, sitenames[x],siteids[x]); // util function
        container.innerHTML += elem;
    }
}
