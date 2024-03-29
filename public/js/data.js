/*
#
# Datavis 2.0
# pelibby16@earlham.edu
#
# Data functions
*/

// GET trips -> RENDER trips -> SELECT trip -> GET sites -> RENDER sites -> SELECT site ...

var query_type = null; // 0 = reading, 1 = streaming
var query_selection = [null,null,null,null,null,null]; // trip, site, sector, spot/host, platform, date
var query_data = null;
var details_mode = 1;


var placeholderHTML = "<div style='float: left; width: 100%; height: 100%; text-align:center; padding-top:20px;color: var(--themep)'>Organizing numbers...</div><div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";
var placeholder2HTML = "<div style='float: left; width: 100%; height: 100%; text-align:center; padding-top:20px;color: var(--themep)'>Adding points to Chart and Map...</div><div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";
var nodbHTML = "<div style='float: left; width: 100%; height: 100%; text-align:center; padding-top:20px;color: var(--themep)'>No database connection: Check .env file and internet connection.\n(You can still load data from files.)</div>";

/*
Streamings/Readings

The tables 'fieldday_reading' and 'fieldday_stream' require different sets of IDs. 
Reading takes a trip, site, sector, and spot. Streaming only takes trip site and sector.
This is the entry point so that both of these options in the descision tree can be accomodated.
*/
function setReading(){
    query_type = 0;
    resetElements(['trips','sites','sectors','spots','streaminghost','streamingplatform','streamingdates','streaming','readingplatform','readingdates','reading']);
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;
    getTrips(); // get top level of data and render to the next block on the form
}
function setStreaming(){
    query_type = 1;
    resetElements(['trips','sites','sectors','spots','streaminghost','streamingplatform','streamingdates','streaming','readingplatform','readingdates','reading']);
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
    resetElements(['sites','sectors','spots','streaminghost','streamingplatform','streamingdates','streaming','readingplatform','readingdates','reading']);
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;

    $.ajax({
        type: 'GET',
        url: '/trips',
        success: function(response) { 
            var tripnames = [];
            var tripids = [];
            var r_count = [];
            var s_count = [];
            for(x = 0; x < response.length; x++){
                tripids.push(response[x].tripid);
                tripnames.push(response[x].tripname);
                r_count.push(response[x].r_count);
                s_count.push(response[x].s_count);
            }
            console.info('DATA: Got trips.');
            renderTrips(tripnames, tripids, r_count, s_count);
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
            document.getElementById('trips').innerHTML = nodbHTML;
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
    resetElements(['sectors','spots','streaminghost','streamingplatform','streamingdates','streaming','readingplatform','readingdates','reading']);
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
            var r_count = [];
            var s_count = [];
            for(x = 0; x < response.length; x++){
                sitenames.push(response[x].sitename);
                siteids.push(response[x].siteid);
                r_count.push(response[x].r_count);
                s_count.push(response[x].s_count);
            }
            console.info('DATA: Got sites.');
            renderSites(sitenames, siteids, r_count, s_count);
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
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
    resetElements(['spots','streaminghost','streamingplatform','streamingdates','streaming','readingplatform','readingdates','reading']);
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
            var r_count = [];
            var s_count = [];
            for(x = 0; x < response.length; x++){
                sectornames.push(response[x].sectorname);
                sectorids.push(response[x].sectorid);
                r_count.push(response[x].r_count);
                s_count.push(response[x].s_count);
            }
            console.info('DATA: Got sectors.');
            renderSectors(sectornames, sectorids, r_count, s_count);
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
        }
    });
}
function getSpots(sector_id){
    query_selection[3] = [];
    document.getElementById('data-prompt').innerHTML = "Pick some spots to compare!"
    document.getElementById('spots').innerHTML = placeholderHTML;

    resetElements(['streaminghost','streamingplatform','streamingdates','streaming','readingplatform','readingdates','reading']);
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
            var r_count = [];
            var s_count = [];
            for(x = 0; x < response.length; x++){
                spotids.push(response[x].spotid);
                r_count.push(response[x].r_count);
                s_count.push(response[x].s_count);
            }
            console.info('DATA: Got spots.');
            renderSpots(spotids, r_count, s_count);
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
        }
    });
}
// Reading-specific routes
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
            console.info('DATA: Got platforms.');
            renderStreamingsPlatforms(plats);
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
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
            console.info('DATA: Got dates.');
            dates = [...new Set(dates.map(item => (item.recordtime.substring(0, 10))))];
            renderStreamingsDates(dates);
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
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
    
                console.info('DATA: Got readings.');
                console.info('DATA: Loaded ' + readings.length + " readings.");    
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
                console.error('DATA: XHR Error.');
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
            var s_count = [];
            for(x = 0; x < response.length; x++){
                hosts.push(response[x]);
                s_count.push(response[x].s_count)
            }
            console.info('DATA: Got hosts.');
            renderStreamingsHosts(hosts, s_count);
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
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
            console.info('DATA: Got platforms');
            renderStreamingsPlatforms(plats);
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
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
            console.info('DATA: Got dates.');
            dates = [...new Set(dates.map(item => (item.recordtime.substring(0, 10))))];
            renderStreamingsDates(dates);
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
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

            console.info('DATA: Loaded ' + streamings.length + " streaming points.");

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
                console.error('DATA: Error - empty set');
                document.getElementById('streaming').innerHTML = "";
                document.getElementById('data-prompt').innerHTML = "Selected set contains no valid points";
            }
            

            
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
        }
    });
}
 
/*
Renderers

The following functions get information from a get function, and use a function from 'util.js' 
to create a radiobutton.

When a get function returns its data, it sends it to a render function if it needs to be selected from.
*/
function renderTrips(tripnames, tripids, r_count, s_count){
    var container = document.getElementById('trips');
    container.innerHTML = '';
    if (container.childElementCount == 0){ // dont override selections with navigation
        container.innerHTML += "<div onclick='togglediv(" + '"#trips-ls","trips-button"' + ")' class='data-header'><h1>Trips <span id='trips-button'>-</span></h1></div>";
        var trips_ls = document.createElement('div');
        trips_ls.id = 'trips-ls';

        for(x = 0; x < tripnames.length; x++){
            var elem = createRadioElementTrips('trips', [r_count[x], s_count[x]], tripnames[x],tripids[x]); // util function
            trips_ls.innerHTML += elem;
        }
        container.append(trips_ls);
    }
}
function renderSites(sitenames, siteids, r_count, s_count){
    var container = document.getElementById('sites');
    container.innerHTML = "";
    container.innerHTML += "<div onclick='togglediv(" + '"#sites-ls","sites-button"' + ")' class='data-header'><h1>Sites <span id='sites-button'>-</span></h1></div>";
    var sites_ls = document.createElement('div');
    sites_ls.id = 'sites-ls';
    
    for(x = 0; x < sitenames.length; x++){
        var elem = createRadioElementSites((x % 2),'sites', [r_count[x], s_count[x]], sitenames[x],siteids[x]); // util function
        sites_ls.innerHTML += elem;
    }
    container.append(sites_ls);
}
function renderSectors(sectornames, sectorids, r_count, s_count){
    var container = document.getElementById('sectors');
    container.innerHTML = "";

    if (sectornames.length != 0){
        container.innerHTML += "<div onclick='togglediv(" + '"#sectors-ls","sectors-button"' + ")' class='data-header'><h1>Sectors <span id='sectors-button'>-</span></h1></div>";
        var sectors_ls = document.createElement('div');
        sectors_ls.id = 'sectors-ls';

        for(x = 0; x < sectornames.length; x++){
            var elem = createRadioElementSectors((x % 2),'sectors', [r_count[x], s_count[x]], sectornames[x], sectorids[x]); // util function
            sectors_ls.innerHTML += elem;
        }
        container.append(sectors_ls);
    }else{
        document.getElementById('data-prompt').innerHTML = "No data found in this sector"
    }
    
    
}
function renderSpots(spotids, r_count, s_count){
    var container = document.getElementById('spots');
    container.innerHTML = "";
    if (spotids.length != 0){
        container.innerHTML += "<div onclick='togglediv(" + '"#spots-ls","spots-button"' + ")' class='data-header'><h1>Spots <span id='spots-button'>-</span></h1></div>";
        var spots_ls = document.createElement('div');
        spots_ls.id = 'spots-ls';

        for(x = 0; x < spotids.length; x++){
            var elem = createRadioElementSpots((x % 2),'spots', [r_count[x], s_count[x]], spotids[x], spotids[x]); // util function
            spots_ls.innerHTML += elem;
        }
        container.append(spots_ls);
    }else{
        document.getElementById('data-prompt').innerHTML = "No Spots found for this sector"
    }
}
function renderStreamingsHosts(hosts,s_count){
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
            var elem = createRadioElementStreamingsHosts((x % 2),'hosts', s_count[x], hosts[x].hostid, hostname ); // util function
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