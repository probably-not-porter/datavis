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

var placeholderHTML = "<div style='float: left; width: 100%; height: 100%; text-align:center; padding-top:20px;color: #bbb'>Lots of numbers...</div><div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";
 
/*
Streamings/Readings

The tables 'fieldday_reading' and 'fieldday_stream' require different sets of IDs. 
Reading takes a trip, site, sector, and spot. Streaming only takes trip site and sector.
This is the entry point so that both of these options in the descision tree can be accomodated.
*/
function setReading(){
    query_type = 0;
    getTrips(); // get top level of data and render to the next block on the form
}
function setStreaming(){
    query_type = 1;
    getTrips(); // get top level of data and render to the next block on the form
}
/* 
Getting data

The following functions are the entry point for getting a certain level of data and rendering 
it to the screen, or displaying it. Each makes a call to a server-side function in the 
'queries.js' file, which gets the data from the database and returns it to the client-side,
which then passes the data to a renderer.
*/
function getTrips(){
    document.getElementById('data-prompt').innerHTML = "Pick a trip, site, sector, and spot."
    document.getElementById('trips').innerHTML = placeholderHTML;
    document.getElementById('sites').innerHTML = "";
    document.getElementById('sectors').innerHTML = "";
    document.getElementById('spots').innerHTML = "";
    document.getElementById('streaming').innerHTML = "";
    document.getElementById('reading').innerHTML = "";
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
    document.getElementById('sites').innerHTML = placeholderHTML;
    document.getElementById('sectors').innerHTML = "";
    document.getElementById('spots').innerHTML = "";
    document.getElementById('streaming').innerHTML = "";
    document.getElementById('reading').innerHTML = "";

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
    document.getElementById('sectors').innerHTML = placeholderHTML;
    document.getElementById('spots').innerHTML = "";
    document.getElementById('streaming').innerHTML = "";
    document.getElementById('reading').innerHTML = "";

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
    document.getElementById('spots').innerHTML = placeholderHTML;
    document.getElementById('streaming').innerHTML = "";
    document.getElementById('reading').innerHTML = "";

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
    document.getElementById('reading').innerHTML = placeholderHTML;

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
            renderReadings(readings);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}
function getStreamings(sector_id){
    document.getElementById('data-prompt').innerHTML = "Pick a set of data to visualize";
    document.getElementById('streaming').innerHTML = placeholderHTML;

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
 
/*
Renderers

The following functions get information from a get function, and use a function from 'util.js' 
to create a radiobutton.
*/
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
    console.log('renderStreamings');
    if (streamings.length != 0){
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
    }else{
        document.getElementById('data-prompt').innerHTML = "No Streaming data found for this sector" // if there are no streamings, default back to sector
        document.getElementById('streaming').innerHTML = '';
        togglediv('#sectors-ls','sectors-button');
    }
}
function renderReadings(readings){
    divided_readings = divide(readings);
    readings_data = readings;

    var container = document.getElementById('reading');
    container.innerHTML = "";
    container.innerHTML += "<div onclick='togglediv(" + '"#readings-ls","readings-button"' + ")' class='data-header'><h1>Readings <span id='readings-button'>-</span></h1></div>";
    var readings_ls = document.createElement('div');
    readings_ls.id = 'readings-ls';

    for(x = 0; x < divided_readings.length; x++){
        var elem = createRadioElementReadings((x % 2),'readings', false, divided_readings[x]); // util function
        readings_ls.innerHTML += elem;
    }
    container.append(readings_ls);
}
// data selectors
function displayStreamings(timestamp){
    console.log('displayStreamings');
    display_set = [];
    for (x=0;x<streamings_data.length;x++){
        if (streamings_data[x].recordtime.substring(0,10) == timestamp){
            display_set.push(streamings_data[x]);
        }
    }
    createGraph(display_set,timestamp);
    //createPoints(display_set); // not working yet
}
function displayReadings(timestamp){
    display_set = []
    for (x=0;x<readings_data.length;x++){
        if (readings_data[x].recordtime.substring(0,10) == timestamp){
            display_set.push(readings_data[x]);
        }
    }
    console.log(display_set)
    // create graph
    // create points
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
    console.log('DIVIDE');
    console.log('starting with:');
    console.log(data_arr);
    const unique = [...new Set(data_arr.map(item => (item.recordtime.substring(0, 10))))];
    console.log('ending with:');
    console.log(unique);
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
            times_arr.push( dataset[x].recordtime.split('T')[1].substring(0,8) );
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


  