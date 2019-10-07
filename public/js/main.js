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
require(["esri/Map", "esri/views/SceneView", "esri/views/MapView", "esri/Graphic", "esri/widgets/BasemapToggle", "esri/widgets/CoordinateConversion" ], function(
    Map,
    SceneView,
    MapView,
    Graphic,
    BasemapToggle,
    CoordinateConversion
  ) {
    var map = new Map({
      basemap: "topo"
    });

    var view = new MapView({
      center: [-13, 65],
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
        position: "bottom-left"
    });
    view.ui.add(coordinateConversionWidget, "bottom-left");

    

    /*************************
     * Create a point graphic
     *************************/

    // First create a point geometry (this is the location of the Titanic)
    var point = {
      type: "point", // autocasts as new Point()
      longitude: -49.97,
      latitude: 41.73
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
tripnames = [];
tripids = [];

sitenames = [];
siteids = [];

sectornames = [];
sectorids = [];

selected_trip = null;

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
            console.info(tripnames,tripids);
            renderTrips(tripnames, tripids);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}
function getSites(trip_id){
    sitenames = []
    selected_trip = trip_id;
    $.ajax({
        type: 'GET',
        url: '/sites',
        data: {id: trip_id},
        success: function(response) { 
            for(x = 0; x < response.length; x++){
                sitenames.push(response[x].sitename);
                siteids.push(response[x].siteid);
            }
            console.info(sitenames,siteids);
            renderSites(sitenames, siteids);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}

function getSectors(site_id, trip_id){
    sectornames = [];
    $.ajax({
        type: 'GET',
        url: '/sectors',
        data: {siteid: site_id, tripid: trip_id},
        success: function(response) { 
            for(x = 0; x < response.length; x++){
                sectornames.push(response[x].sectorname);
                sectorids.push(response[x].sectorid);
            }
            console.info(sectornames,sectorids);
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
            var elem = createRadioElementTrips('trips', false, tripnames[x],tripids[x]); // util function
            container.innerHTML += elem;
        }
    }
}
function renderSites(sitenames, siteids){
    var container = document.getElementById('sites');
    container.innerHTML = "";
    container.innerHTML += "<div class='data-header'><h1>Sites</h1></div>";
    for(x = 0; x < sitenames.length; x++){
        var elem = createRadioElementSites('sites', false, sitenames[x],siteids[x], selected_trip); // util function
        container.innerHTML += elem;
    }
}
function renderSectors(sectornames, sectorids){
    var container = document.getElementById('sectors');
    container.innerHTML = "";
    container.innerHTML += "<div class='data-header'><h1>Sectors</h1></div>";
    for(x = 0; x < sectornames.length; x++){
        var elem = createRadioElementSectors('sectors', false, sectornames[x]); // util function
        container.innerHTML += elem;
    }
}
