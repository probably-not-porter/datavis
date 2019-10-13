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
require(["esri/Map", "esri/views/SceneView", "esri/views/MapView", "esri/Graphic", "esri/widgets/BasemapToggle", "esri/widgets/CoordinateConversion", "esri/PopupTemplate" ], function(
    Map,
    SceneView,
    MapView,
    Graphic,
    BasemapToggle,
    CoordinateConversion,
    PopupTemplate
  ) {
    var map = new Map({
      basemap: "topo"
    });

    var view = new MapView({
      center: [-13.68, 65.29],
      container: "viewDiv",
      map: map,
      zoom: 11
    });
    var basemapToggle = new BasemapToggle({
        viewModel: {  // autocasts as new BasemapToggleViewModel()
            view: view,  // The view that provides access to the map's "streets" basemap
            nextBasemap: "satellite"  // Allows for toggling to the "hybrid" basemap
        }
    });
    var coordinateConversionWidget = new CoordinateConversion({
        view: view
    });
    view.ui.add(basemapToggle, {
        position: "bottom-left",
        width: 200
    });
    view.ui.add(coordinateConversionWidget, "bottom-left");

    

    var point = {
      type: "point", // autocasts as new Point()
      longitude: -13.25,
      latitude: 65.30
    };

    // Create a symbol for drawing the point
    var markerSymbol = {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      color: [226, 119, 40],
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 2
      }
    };

    // Create a graphic and add the geometry and symbol to it
    var pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol
    });

    view.graphics.addMany([pointGraphic]);
});

// DATA // 

// Arrays (hold on the the db information that gets fetched)
var query_selection = [null,null,null,null,null];
selected_trip = null;
selected_site = null;

// Gets
function getTrips(){
    tripnames = [];
    tripids = [];
    $.ajax({
        type: 'GET',
        url: '/trips',
        success: function(response) { 
            var tripnames = [];
            var tripids = [];
            for(x = 0; x < response.length; x++){
                tripids.push(response[x].tripid);
                tripnames.push(response[x].tripname);
            }
            console.info('TRIPS');
            console.table(response);
            renderTrips(tripnames, tripids);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}
function getSites(trip_id){
    document.getElementById('data-prompt').innerHTML = "Pick a site, sector, and spot."
    sitenames = [];
    sectorids = [];
    sectornames = [];
    var container = document.getElementById('sectors');
    container.innerHTML = "";

    query_selection[0] = trip_id;
    $.ajax({
        type: 'GET',
        url: '/sites',
        data: {id: trip_id},
        success: function(response) { 
            var sitenames = [];
            var siteids = [];
            for(x = 0; x < response.length; x++){
                sitenames.push(response[x].sitename);
                siteids.push(response[x].siteid);
            }
            console.info('SITES');
            console.table(response);
            renderSites(sitenames, siteids);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}

function getSectors(site_id){
    sectornames = [];
    sectorids = [];

    query_selection[1] = site_id;
    $.ajax({
        type: 'GET',
        url: '/sectors',
        data: {siteid: site_id, tripid: query_selection[0]},
        success: function(response) { 
            var sectornames = [];
            var sectorids = [];
            for(x = 0; x < response.length; x++){
                sectornames.push(response[x].sectorname);
                sectorids.push(response[x].sectorid);
            }
            console.info('SECTORS');
            console.table(response);
            renderSectors(sectornames, sectorids);
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
            var elem = createRadioElementTrips((x % 2),'trips', false, tripnames[x],tripids[x]); // util function
            container.innerHTML += elem;
        }
    }
}
function renderSites(sitenames, siteids){
    var container = document.getElementById('sites');
    container.innerHTML = "";
    container.innerHTML += "<div class='data-header'><h1>Sites</h1></div>";
    for(x = 0; x < sitenames.length; x++){
        var elem = createRadioElementSites((x % 2),'sites', false, sitenames[x],siteids[x], selected_trip); // util function
        container.innerHTML += elem;
    }
}
function renderSectors(sectornames, sectorids){
    var container = document.getElementById('sectors');
    container.innerHTML = "";
    container.innerHTML += "<div class='data-header'><h1>Sectors</h1></div>";
    for(x = 0; x < sectornames.length; x++){
        var elem = createRadioElementSectors((x % 2),'sectors', false, sectornames[x]); // util function
        container.innerHTML += elem;
    }
}
