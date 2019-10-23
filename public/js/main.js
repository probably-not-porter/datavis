/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Map and Data functions
*/

function ready(){ // placeholder for now
    switchToData()
}

// MAP //

var mapstate = 0; // keep track of which map overlay is being used
var default_center = [-13.7055,65.2941]; //default starting coords for the map view
var view = null;

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

    view = new MapView({
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
});

function createPoints(points){
    require(["esri/Map", "esri/views/SceneView", "esri/views/MapView", "esri/Graphic", "esri/widgets/BasemapToggle", "esri/widgets/CoordinateConversion", "esri/PopupTemplate" ], function(
    Map,
    SceneView,
    MapView,
    Graphic,
    BasemapToggle,
    CoordinateConversion,
    PopupTemplate
    ){
        for(x=0;x<points.length;x++){
            var point = {
                type: "point", // autocasts as new Point()
                longitude: points[x].longitude,
                latitude: points[x].latitude
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
        }
    });
}

// DATA // 

var query_type = null; // 0 = reading, 1 = streaming
var query_selection = [null,null,null,null,null]; // trip, site, sector, spot, platform
var streamings_data = [];
var readings_data = [];

function setReading(){
    query_type = 0;
    getTrips();
}
function setStreaming(){
    query_type = 1;
    getTrips();
}
// Gets
function getTrips(){
    document.getElementById('data-prompt').innerHTML = "Pick a trip, site, sector, and spot."
    document.getElementById('trips').innerHTML = "<div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";
    document.getElementById('sites').innerHTML = "";
    document.getElementById('sectors').innerHTML = "";
    document.getElementById('spots').innerHTML = "";
    document.getElementById('streaming').innerHTML = "";
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
    document.getElementById('sites').innerHTML = "<div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";
    document.getElementById('sectors').innerHTML = "";
    document.getElementById('spots').innerHTML = "";
    document.getElementById('streaming').innerHTML = "";

    togglediv('#trips-ls','trips-button');

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
    document.getElementById('data-prompt').innerHTML = "Pick a sector and a spot."
    document.getElementById('sectors').innerHTML = "<div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";
    document.getElementById('spots').innerHTML = "";
    document.getElementById('streaming').innerHTML = "";

    togglediv('#sites-ls','sites-button');

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
function getSpots(sector_id){
    document.getElementById('data-prompt').innerHTML = "Pick a spot."
    document.getElementById('spots').innerHTML = "<div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";
    document.getElementById('streaming').innerHTML = "";

    togglediv('#sectors-ls','sectors-button');

    query_selection[2] = sector_id;
    $.ajax({
        type: 'GET',
        url: '/spots',
        data: {sectorid: sector_id, siteid: query_selection[1], tripid: query_selection[0]},
        success: function(response) { 
            var spotids = [];
            for(x = 0; x < response.length; x++){
                spotids.push(response[x].spotid);
            }
            console.info('SPOTS');
            console.table(response);
            renderSpots(spotids);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}
function getReadings(spot_id){
    document.getElementById('data-prompt').innerHTML = "Pick a set of data to visualize";
    document.getElementById('streaming').innerHTML = "";

    togglediv('#spots-ls','spots-button');

    query_selection[3] = spot_id;
    $.ajax({
        type: 'GET',
        url: '/readings',
        data: {spotid: spot_id, sectorid: query_selection[2], siteid: query_selection[1], tripid: query_selection[0]},
        success: function(response) { 
            var readings = [];
            for(x = 0; x < response.length; x++){
                readings.push(response[x]);
            }
            console.info('DATA - READINGS');
            console.table(response);
            //renderReadings(spotids);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}
function getStreamings(sector_id){
    document.getElementById('data-prompt').innerHTML = "Pick a set of data to visualize";
    document.getElementById('streaming').innerHTML = "<div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";

    togglediv('#sectors-ls','sectors-button');

    $.ajax({
        type: 'GET',
        url: '/streamings',
        data: {sectorid: sector_id, siteid: query_selection[1], tripid: query_selection[0]},
        success: function(response) { 
            var streamings = [];
            for(x = 0; x < response.length; x++){
                streamings.push(response[x]);
            }
            console.info('DATA - STREAMINGS');
            //console.table(response);
            renderStreamings(streamings);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}
// Renders
function renderTrips(tripnames, tripids){
    var container = document.getElementById('trips');
    container.innerHTML = '';
    if (container.childElementCount == 0){ // dont override selections with navigation
        container.innerHTML += "<div onclick='togglediv(" + '"#trips-ls","trips-button"' + ")' class='data-header'><h1>Trips <span id='trips-button'>-</span></h1></div>";
        var trips_ls = document.createElement('div');
        trips_ls.id = 'trips-ls';

        for(x = 0; x < tripnames.length; x++){
            var elem = createRadioElementTrips((x % 2),'trips', false, tripnames[x],tripids[x]); // util function
            trips_ls.innerHTML += elem;
        }
        container.append(trips_ls);
    }
}
function renderSites(sitenames, siteids){
    var container = document.getElementById('sites');
    container.innerHTML = "";
    container.innerHTML += "<div onclick='togglediv(" + '"#sites-ls","sites-button"' + ")' class='data-header'><h1>Sites <span id='sites-button'>-</span></h1></div>";
    var sites_ls = document.createElement('div');
    sites_ls.id = 'sites-ls';
    
    for(x = 0; x < sitenames.length; x++){
        var elem = createRadioElementSites((x % 2),'sites', false, sitenames[x],siteids[x]); // util function
        sites_ls.innerHTML += elem;
    }
    container.append(sites_ls);
}
function renderSectors(sectornames, sectorids){
    var container = document.getElementById('sectors');
    container.innerHTML = "";
    container.innerHTML += "<div onclick='togglediv(" + '"#sectors-ls","sectors-button"' + ")' class='data-header'><h1>Sectors <span id='sectors-button'>-</span></h1></div>";
    var sectors_ls = document.createElement('div');
    sectors_ls.id = 'sectors-ls';

    for(x = 0; x < sectornames.length; x++){
        var elem = createRadioElementSectors((x % 2),'sectors', false, sectornames[x], sectorids[x]); // util function
        sectors_ls.innerHTML += elem;
    }
    container.append(sectors_ls);
}
function renderSpots(spotids){
    var container = document.getElementById('spots');
    container.innerHTML = "";
    if (spotids.length != 0){
        container.innerHTML += "<div onclick='togglediv(" + '"#spots-ls","spots-button"' + ")' class='data-header'><h1>Spots <span id='spots-button'>-</span></h1></div>";
        var spots_ls = document.createElement('div');
        spots_ls.id = 'spots-ls';

        for(x = 0; x < spotids.length; x++){
            var elem = createRadioElementSpots((x % 2),'spots', false, spotids[x], spotids[x]); // util function
            spots_ls.innerHTML += elem;
        }
        container.append(spots_ls);
    }else{
        document.getElementById('data-prompt').innerHTML = "No Spots found for this sector"
    }
}
function renderStreamings(streamings){
    divided_streamings = divide(streamings);
    streamings_data = streamings;

    var container = document.getElementById('streaming');
    container.innerHTML = "";
    container.innerHTML += "<div onclick='togglediv(" + '"#streamings-ls","streamings-button"' + ")' class='data-header'><h1>Streaming <span id='streamings-button'>-</span></h1></div>";
    var streamings_ls = document.createElement('div');
    streamings_ls.id = 'streamings-ls';

    for(x = 0; x < divided_streamings.length; x++){
        var elem = createRadioElementStreamings((x % 2),'streamings', false, divided_streamings[x]); // util function
        streamings_ls.innerHTML += elem;
    }
    container.append(streamings_ls);
}
// data selectors
function displayStreamings(platformid){
    display_set = [];
    for (x=0;x<streamings_data.length;x++){
        if (streamings_data[x].platformid == platformid){
            display_set.push(streamings_data[x]);
        }
    }
    createGraph(display_set,platformid);
    //createPoints(display_set); // not working yet
}

function togglediv(target_div,btn_span){
    var btn = document.getElementById(btn_span);
    if (btn.innerHTML == '-'){
        btn.innerHTML = '+';
    }else{
        btn.innerHTML = '-';
    }
    $(target_div).slideToggle();
}
function divide(data_arr){
    const unique = [...new Set(data_arr.map(item => item.platformid))];
    return unique
}

// GRAPH //
var lineChart;
$( document ).ready(function() {
    lineChart = new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
            datasets: [{ 
                label: "Elevation",
                borderColor: "#3e95cd",
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'No Data Selected'
            }
        }
    });
    console.log( "ready!" );
});

function createGraph(dataset, title){
    elevation_arr = [];
    times_arr = [];
    for (x=0;x<dataset.length;x++){
        if (!(times_arr.includes(dataset[x].recordtime.split('T')[1]))){
            elevation_arr.push(dataset[x].elevation);
            times_arr.push(dataset[x].recordtime.split('T')[1]);
        }
    }
    //elevation_arr = [...new Set(elevation_arr)];
    //times_arr = [...new Set(times_arr)];
    console.log('UNIQUE DATA')
    console.log(elevation_arr);
    console.log(times_arr);
    addData(lineChart, times_arr, elevation_arr,title);
}
function addData(chart, labels, data,title) {
    console.warn('UPDATING CHART');
    chart.data.labels = labels;
    chart.options.title.text = title;
    chart.data.datasets[0].data = data
    chart.update();
    console.log(chart);
}


  