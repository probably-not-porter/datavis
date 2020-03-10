/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Data functions
*/

// GET trips -> RENDER trips -> SELECT trip -> GET sites -> RENDER sites -> SELECT site ...

var query_type = null; // 0 = reading, 1 = streaming
var query_selection = [null,null,null,null,null,null]; // trip, site, sector, spot/host, platform, date
var query_data = null;


var placeholderHTML = "<div style='float: left; width: 100%; height: 100%; text-align:center; padding-top:20px;color: var(--themep)'>Organizing numbers...</div><div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";
var placeholder2HTML = "<div style='float: left; width: 100%; height: 100%; text-align:center; padding-top:20px;color: var(--themep)'>Adding points to Chart and Map...</div><div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";

/*
Streamings/Readings

The tables 'fieldday_reading' and 'fieldday_stream' require different sets of IDs. 
Reading takes a trip, site, sector, and spot. Streaming only takes trip site and sector.
This is the entry point so that both of these options in the descision tree can be accomodated.
*/
function setReading(){
    query_type = 0;
    resetElements(['trips','sites','sectors','spots','streamingplatform','streamingdates','streaming','readingplatform','readingdates','reading']);
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;
    getTrips(); // get top level of data and render to the next block on the form
}
function setStreaming(){
    query_type = 1;
    resetElements(['trips','sites','sectors','spots','streamingplatform','streamingdates','streaming','readingplatform','readingdates','reading']);
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;
    getTrips(); // get top level of data and render to the next block on the form
}
/* 
Getting data

The following functions are the entry point for getting a certain level of data and rendering 
it to the screen, or displaying it. Each makes a call to a server-side function in the 
'queries.js' file, which gets the data from the database and returns it to the client-side,
which then passes the data to a renderer.
*/
// General routes
function getTrips(){
    if (query_type == 0){
        document.getElementById('data-prompt').innerHTML = "Pick a trip, site, sector, and spot to see data."
    }else{
        document.getElementById('data-prompt').innerHTML = "Pick a trip, site, and sector to see data."
    }
    document.getElementById('trips').innerHTML = placeholderHTML;
    resetElements(['sites','sectors','spots','streamingplatform','streamingdates','streaming','readingplatform','readingdates','reading']);
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;

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
    if (query_type == 0){
        document.getElementById('data-prompt').innerHTML = "Pick a site, sector, and spot to see data."
    }else{
        document.getElementById('data-prompt').innerHTML = "Pick a site and sector to see data."
    }
    document.getElementById('sites').innerHTML = placeholderHTML;
    resetElements(['sectors','spots','streamingplatform','streamingdates','streaming','readingplatform','readingdates','reading']);
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;

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
    if (query_type == 0){
        document.getElementById('data-prompt').innerHTML = "Pick a sector and spot to see data."
    }else{
        document.getElementById('data-prompt').innerHTML = "Pick a sector to see data."
    }
    document.getElementById('sectors').innerHTML = placeholderHTML;
    resetElements(['spots','streamingplatform','streamingdates','streaming','readingplatform','readingdates','reading']);
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;

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
    query_selection[3] = [];
    document.getElementById('data-prompt').innerHTML = "Pick some spots to compare!"
    document.getElementById('spots').innerHTML = placeholderHTML;

    resetElements(['streamingplatform','streamingdates','streaming','readingplatform','readingdates','reading']);
    document.getElementById('streamingplatform').innerHTML = "";
    document.getElementById('streaming').innerHTML = "";
    document.getElementById('reading').innerHTML = "";
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;

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
// Reading-specific routes
// NOT SET UP YET
function getReadingsPlatforms(spot_id){
    document.getElementById('data-prompt').innerHTML = "Select a platform to see recorded data.";
    document.getElementById('readingplatform').innerHTML = placeholderHTML;
    resetElements(['streamingdates','streaming','readingdates','reading']);
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;
    

    togglediv('#spots-ls','spots-button');
    //query_selection[3] = spot_id;

    $.ajax({
        type: 'GET',
        url: '/readingsplatforms',
        data: {sectorid: sector_id, siteid: query_selection[1], tripid: query_selection[0]},
        success: function(response) { 
            var plats = [];
            for(x = 0; x < response.length; x++){
                plats.push(response[x]);
            }
            console.info('DATA - PLATFORMS');
            console.table(response);
            renderStreamingsPlatforms(plats);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}
// NOT SET UP YET
function getReadingsDates(platformid){
    document.getElementById('data-prompt').innerHTML = "Pick a set of data to visualize";
    document.getElementById('readingdates').innerHTML = placeholderHTML;
    resetElements(['streaming','reading']);
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;

    togglediv('#readingsplatforms-ls','readingsplatforms-button');
    query_selection[4] = platformid;

    $.ajax({
        type: 'GET',
        url: '/readingsdates',
        data: {platformid: platformid, sectorid: query_selection[2], siteid: query_selection[1], tripid: query_selection[0]},
        success: function(response) { 
            var dates = [];
            for(x = 0; x < response.length; x++){
                dates.push(response[x]);
            }
            console.info('DATA - DATES');
            dates = [...new Set(dates.map(item => (item.recordtime.substring(0, 10))))];
            console.table(dates);
            renderStreamingsDates(dates);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}
function getReadings(spot_id,value){
    if (value == true){ // add spot to list
        if (!query_selection[3].includes(spot_id)){
            query_selection[3].push(spot_id);
        }
    }else{
        if (query_selection[3].includes(spot_id)){
            var index = query_selection[3].indexOf(spot_id);
            if (index !== -1) query_selection[3].splice(index, 1);
        }
    }
    
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;

    //togglediv('#spots-ls','spots-button');
    if (query_selection[3].length > 0){
        $.ajax({
            type: 'GET',
            url: '/readings',
            data: {spotids: query_selection[3], sectorid: query_selection[2], siteid: query_selection[1], tripid: query_selection[0]},
            success: function(response) { 
                var readings = [];
    
                for(x = 0; x < response.length; x++){
                    readings.push(response[x]);
                }
    
                console.info('DATA - readings');
                console.info('Loaded ' + readings.length + " data points.");
                console.table(readings);
    
                var color = getRandomColor();
                query_data = processReadings(readings);
    
                createPoints(query_data, color);
                createGraphReading(query_data, query_selection,  color);
    
                var dataview = document.getElementById("dataView")
                dataview.querySelector("#nav-button-graph").classList.add("new_data_button");
                dataview.querySelector("#nav-button-map").classList.add("new_data_button");
    
                document.getElementById('reading').innerHTML = "";
                document.getElementById('data-prompt').innerHTML = "Loaded "+query_selection[3].length+" spots to the graph and map! <br> Pick some more?";
    
                document.getElementById("button_permalink").disabled = false;
                document.getElementById("button_csv").disabled = false;
            },
            error: function(xhr, status, err) {
                console.log(xhr.responseText);
            }
        });
    }else{
        createGraphReading(null, null,  null);
    }
}
// Streaming-specific routes
function getStreamingsHosts(sector_id){
    document.getElementById('data-prompt').innerHTML = "Select a platform to see recorded data.";
    document.getElementById('streaminghost').innerHTML = placeholderHTML;
    resetElements(['streamingdates','streaming','reading']);
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;
    

    togglediv('#sectors-ls','sectors-button');
    query_selection[2] = sector_id;

    $.ajax({
        type: 'GET',
        url: '/streamingshosts',
        data: {sectorid: sector_id, siteid: query_selection[1], tripid: query_selection[0]},
        success: function(response) { 
            var hosts = [];
            for(x = 0; x < response.length; x++){
                hosts.push(response[x]);
            }
            console.info('DATA - HOSTS');
            console.table(response);
            renderStreamingsHosts(hosts);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}
function getStreamingsPlatforms(host_id){
    document.getElementById('data-prompt').innerHTML = "Select a platform to see recorded data.";
    document.getElementById('streamingplatform').innerHTML = placeholderHTML;
    resetElements(['streamingdates','streaming','reading']);
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;
    

    togglediv('#streamingshosts-ls','streamingshosts-button');
    query_selection[3] = host_id;

    $.ajax({
        type: 'GET',
        url: '/streamingsplatforms',
        data: {hostid: host_id, sectorid: query_selection[2], siteid: query_selection[1], tripid: query_selection[0]},
        success: function(response) { 
            var plats = [];
            for(x = 0; x < response.length; x++){
                plats.push(response[x]);
            }
            console.info('DATA - PLATFORMS');
            console.table(response);
            renderStreamingsPlatforms(plats);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}
function getStreamingsDates(platformid){
    document.getElementById('data-prompt').innerHTML = "Pick a set of data to visualize";
    document.getElementById('streamingdates').innerHTML = placeholderHTML;
    resetElements(['streaming','reading']);
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;

    togglediv('#streamingsplatforms-ls','streamingsplatforms-button');
    query_selection[4] = platformid;

    $.ajax({
        type: 'GET',
        url: '/streamingsdates',
        data: {platformid: platformid, hostid:query_selection[3] ,sectorid: query_selection[2], siteid: query_selection[1], tripid: query_selection[0]},
        success: function(response) { 
            var dates = [];
            for(x = 0; x < response.length; x++){
                dates.push(response[x]);
            }
            console.info('DATA - DATES');
            dates = [...new Set(dates.map(item => (item.recordtime.substring(0, 10))))];
            console.table(dates);
            renderStreamingsDates(dates);
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText);
        }
    });
}
function getStreamings(date){
    document.getElementById('data-prompt').innerHTML = "Loading your data selection...";
    document.getElementById('streaming').innerHTML = placeholder2HTML;
    resetElements(['reading']);

    togglediv('#streamingsdates-ls','streamingsdates-button');
    query_selection[5] = date;

    $.ajax({
        type: 'GET',
        url: '/streamings',
        data: {date: date, platformid: query_selection[4],hostid:query_selection[3], sectorid: query_selection[2], siteid: query_selection[1], tripid: query_selection[0]},
        success: function(response) { 
            var streamings = [];

            for(x = 0; x < response.length; x++){
                streamings.push(response[x]);
            }

            console.info('DATA - STREAMINGS');
            console.info('Loaded ' + streamings.length + " points.");

            var color = getRandomColor();
            query_data = streamings;

            if (streamings.length != 0){
                createGraphStreaming(streamings,date,color);
                createPoints(streamings,color);

                var dataview = document.getElementById("dataView")
                dataview.querySelector("#nav-button-graph").classList.add("new_data_button");
                dataview.querySelector("#nav-button-map").classList.add("new_data_button");

                document.getElementById('streaming').innerHTML = "";
                document.getElementById('data-prompt').innerHTML = "Loaded "+streamings.length+" points to the graph and map!";

                document.getElementById("button_permalink").disabled = false;
                document.getElementById("button_csv").disabled = false;
            }
            else{
                console.error('ERR: empty set');
                document.getElementById('streaming').innerHTML = "";
                document.getElementById('data-prompt').innerHTML = "Selected set contains no valid points";
            }
            

            
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

When a get function returns its data, it sends it to a render function if it needs to be selected from.
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

    if (sectornames.length != 0){
        container.innerHTML += "<div onclick='togglediv(" + '"#sectors-ls","sectors-button"' + ")' class='data-header'><h1>Sectors <span id='sectors-button'>-</span></h1></div>";
        var sectors_ls = document.createElement('div');
        sectors_ls.id = 'sectors-ls';

        for(x = 0; x < sectornames.length; x++){
            var elem = createRadioElementSectors((x % 2),'sectors', false, sectornames[x], sectorids[x]); // util function
            sectors_ls.innerHTML += elem;
        }
        container.append(sectors_ls);
    }else{
        document.getElementById('data-prompt').innerHTML = "No data found in this sector"
    }
    
    
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
function renderStreamingsHosts(hosts){
    if (streamings.length != 0){
        var container = document.getElementById('streaminghost');
        container.innerHTML = "";
        container.innerHTML += "<div onclick='togglediv(" + '"#streamingshosts-ls","streamingshosts-button"' + ")' class='data-header'><h1>Streaming Hosts<span id='streamingshosts-button'>-</span></h1></div>";
        var streamingshosts_ls = document.createElement('div');
        streamingshosts_ls.id = 'streamingshosts-ls';
        for(x = 0; x < hosts.length; x++){
            var hostname = "Unknown Host";
            if (hosts[x].hostname){
                hostname = hosts[x].hostname.toString()
            }
            var elem = createRadioElementStreamingsHosts((x % 2),'hosts', false, hosts[x].hostid, hostname ); // util function
            streamingshosts_ls.innerHTML += elem;
        }
        container.append(streamingshosts_ls);
    }else{
        document.getElementById('data-prompt').innerHTML = "No Platforms found for this host" // if there are no streamings, default back to sector
        document.getElementById('streaminghosts').innerHTML = '';
        togglediv('#sectors-ls','sectors-button');
    }
}
function renderStreamingsPlatforms(platforms){
    if (streamings.length != 0){
        var container = document.getElementById('streamingplatform');
        container.innerHTML = "";
        container.innerHTML += "<div onclick='togglediv(" + '"#streamingsplatforms-ls","streamingsplatforms-button"' + ")' class='data-header'><h1>Streaming Platforms<span id='streamingsplatforms-button'>-</span></h1></div>";
        var streamingsplatforms_ls = document.createElement('div');
        streamingsplatforms_ls.id = 'streamingsplatforms-ls';
        for(x = 0; x < platforms.length; x++){
            var elem = createRadioElementStreamingsPlatforms((x % 2),'platforms', false, platforms[x].platformid, platforms[x].platformname.toString()); // util function
            streamingsplatforms_ls.innerHTML += elem;
        }
        container.append(streamingsplatforms_ls);
    }else{
        document.getElementById('data-prompt').innerHTML = "No Streaming data found for this platform" // if there are no streamings, default back to sector
        document.getElementById('streamingplatform').innerHTML = '';
        togglediv('#streamingshosts-ls','streaminshosts-button');
    }
}
function renderStreamingsDates(dates){
    if (dates.length != 0){
        var container = document.getElementById('streamingdates');
        container.innerHTML = "";
        container.innerHTML += "<div onclick='togglediv(" + '"#streamingsdates-ls","streamingsdates-button"' + ")' class='data-header'><h1>Streaming Dates<span id='streamingsdates-button'>-</span></h1></div>";
        var streamingsdates_ls = document.createElement('div');
        streamingsdates_ls.id = 'streamingsdates-ls';
        for(x = 0; x < dates.length; x++){
            var elem = createRadioElementStreamingsDates((x % 2),'dates', false, dates[x]); // util function
            streamingsdates_ls.innerHTML += elem;
        }
        container.append(streamingsdates_ls);
    }else{
        document.getElementById('data-prompt').innerHTML = "No Streaming data found for this sector" // if there are no streamings, default back to sector
        document.getElementById('streamingdates').innerHTML = '';
        togglediv('#streamingsplatforms-ls','streamingsplatforms-button');
    }
}