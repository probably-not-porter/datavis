/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# DOM basics
*/

// NAVIGATION / UTIL //
function switchToMap(){ 
    var dataview = document.getElementById("dataView");
    var mapview = document.getElementById("mapView");
    dataview.querySelector("#nav-button-map").classList.remove("new_data_button");
    dataview.querySelector("#nav-button-graph").classList.remove("new_data_button");

    setTimeout(function(){ document.getElementById("loading").style.display = "block"; }, 10);
    document.getElementById("dataView").style.display = "none";
    document.getElementById("graphView").style.display = "none";
    document.getElementById("mapView").style.display = "block";
    console.log('switched to map view');
    setTimeout(function(){ document.getElementById("loading").style.display = "none"; }, 10);
}
function switchToGraph(){
    var dataview = document.getElementById("dataView");
    var graphview = document.getElementById("graphView");
    dataview.querySelector("#nav-button-graph").classList.remove("new_data_button"); // set graph view to no prompt
    dataview.querySelector("#nav-button-map").classList.remove("new_data_button");

    setTimeout(function(){ document.getElementById("loading").style.display = "block"; }, 10);
    document.getElementById("mapView").style.display = "none";
    document.getElementById("dataView").style.display = "none";
    document.getElementById("graphView").style.display = "block";
    console.log('switched to graph view');
    setTimeout(function(){ document.getElementById("loading").style.display = "none"; }, 10);
}
function switchToData(){
    setTimeout(function(){ document.getElementById("loading").style.display = "block"; }, 10);
    document.getElementById("mapView").style.display = "none";
    document.getElementById("graphView").style.display = "none";
    document.getElementById("dataView").style.display = "block";
    console.log('switched to data view');
    setTimeout(function(){ document.getElementById("loading").style.display = "none"; }, 10);}

// TEAMPLATES FOR DOM PIECES

// generalized formula
function createRadioElement(name, id, label, f, count=999){
    var radioHtml = '<div class="elem-div elem-0">'
    if (typeof id === 'string' || id instanceof String){
        radioHtml += '<input class="data-radio form-radio" onchange="'+ f +'(';
        radioHtml += "'" + id + "'";
        radioHtml +=')" type="radio" name="' + name + '" id="' + label + '" />';
    }else{
        radioHtml += '<input class="data-radio form-radio" onchange="'+ f +'(' + id + ')" type="radio" name="' + name + '" id="' + label + '" />';
    }
    radioHtml += '<label for="' + label + '">';
    radioHtml += '<strong>'+ label + "</strong>";
    radioHtml += '<span class="detailed_info_2"> (' + count +' values)</span>';
    radioHtml += '<span class="detailed_info"> (ID: ' + id +')</span>';
    radioHtml += '</label></div>';

    return radioHtml;
}

// take information from data.js and write it into html
function createRadioElementTrips( mode, name, count, label, id ) {
    var f = "getSites";
    return createRadioElement(name, id, label, f, count[query_type]);
}

function createRadioElementSites( mode, name, count, label, id ) {
    var f = "getSectors";
    return createRadioElement(name, id, label, f, count[query_type]);
}
// this one is different since it changes for reading and streaming
function createRadioElementSectors( mode, name, count, label, id ) {
    var f = "getSpots"; // if reading
    if (query_type == 1){ // if streaming
        f = "getStreamingsHosts";
    }
    return createRadioElement(name, id, label, f, count[query_type]);
}
function createRadioElementSpots( mode, name, count, label,id ) {
    var f = "getReadings";
    //return createRadioElement(name, id, label, f);
    var radioHtml = '<div class="elem-div elem-0">'
    if (typeof id === 'string' || id instanceof String){
        radioHtml += '<input class="data-radio form-check" onchange="'+ f +'(';
        radioHtml += "'" + id + "'";
        radioHtml +=')" type="checkbox" name="' + name + '" id="' + label + '" />';
    }else{
        radioHtml += '<input class="data-radio form-check" onchange="'+ f +'(' + id + ',this.checked)" type="checkbox" name="' + name + '" id="' + label + '" />';
    }
    radioHtml += '<label for="' + label + '">';
    radioHtml += '<strong>'+ label + "</strong>";
    radioHtml += '<span class="detailed_info"> (ID: ' + id +')</span>';
    radioHtml += '<span class="detailed_info_2"> (' + count[query_type] +' values)</span>';
    radioHtml += '</label></div>';

    return radioHtml;
}
function createRadioElementStreamingsHosts( mode, name, checked, id, label ) {
    var f = "getStreamingsPlatforms";   
    return createRadioElement(name, id, label, f);
}
function createRadioElementStreamingsPlatforms( mode, name, checked, id, label ) {
    var f = "getStreamingsDates";   
    return createRadioElement(name, id, label, f);
}
// this one doesnt use the general formula.
function createRadioElementStreamingsDates( mode, name, checked, date ) {
    var radioHtml = '<div class="elem-div elem-' + mode + '"><input class="data-radio form-radio" onchange="getStreamings('+ "'" + date + "'" +')"type="radio" name="' + name + '" id="' + date + '"';
    if ( checked ) {
        radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';
    radioHtml += '<label for="' + name + '"><strong>'+ date + '</strong> </label></div>';
    
    return radioHtml;
}
function createRadioElementStreamings( mode, name, checked, label ) {
    var f = "displayStreamings";
    return createRadioElement(name, name, label, f);
}
function createRadioElementReadings( mode, name, checked, label ) {
    var f = "displayReadings";
    return createRadioElement(name, label, label, f);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function resetElements(arr){
    for(x=0;x<arr.length; x++){
        document.getElementById(arr[x]).innerHTML = "";
    }
}

/*
The following functions are for specific utilities in the data screen, 
such as the export CSV and the permalink functionalities.
*/
function togglediv(target_div,btn_span){
    if (document.getElementById(btn_span)){
        var btn = document.getElementById(btn_span);
        if (btn.innerHTML == '-'){
            btn.innerHTML = '+';
        }else{
            btn.innerHTML = '-';
        }
        $(target_div).slideToggle();
    }
}
function processReadings(readings){
    spotids = query_selection[3];
    spots_out = [];
    for (x=0;x<spotids.length;x++){
        current_data = [];
        for(y=0;y<readings.length;y++){
            if (readings[y].spotid == spotids[x]){
                current_data.push(readings[y]);
            }
        }
        if (current_data.length != 0){
            const timestamps = [...new Set(current_data.map(item => item.recordtime))]; // use earlier date to base data on;
            console.log(timestamps);
            var min = timestamps.reduce(function (a, b) { return a < b ? a : b; }); 
    
            out_node = {};
            for(j=0;j<current_data.length;j++){
                if (current_data[j].recordtime = min || !out_node.recordtime){
                    out_node.Spot = current_data[j].spotid;
                    out_node.recordtime = current_data[j].recordtime;
                    out_node.tripname = current_data[j].tripname;
                    out_node.sitename = current_data[j].sitename;
                    out_node.sectorname = current_data[j].sectorname;
                    out_node.elevation = current_data[j].elevation;
                    out_node.longitude = current_data[j].longitude;
                    out_node.latitude = current_data[j].latitude;
                    out_node.accuracy = current_data[j].accuracy; // 0 to 8

                    if (!out_node[current_data[j].sensortype]){
                        out_node[current_data[j].sensortype] = current_data[j].value_1;
                    }
                }else if (!out_node[current_data[j].sensortype]){
                    out_node[current_data[j].sensortype] = current_data[j].value_1;
                }
            }
            spots_out.push(out_node);
        }
    }
    return spots_out;
}
function loadQuery(params){
    console.info('Loading query from permalink...')
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;
    if (params.length == 8 && params[1] == 1){ // streaming query
        console.log("PARAMS");
        console.log(params);
        query_type = params[1]
        query_selection[0] = params[2]; // load trip
        query_selection[1] = params[3]; // load site
        query_selection[2] = params[4]; // load sector
        query_selection[3] = params[5]; // load hostid
        query_selection[4] = params[6]; // load platform
        query_selection[5] = params[7]; // load date

        document.getElementById('query_type').innerHTML = "<label><div style='padding-top:10px;padding-bottom:10px;'><strong>Query loaded from permalink!</br><button onclick='removeQuery()'>Return to regular selection</button></strong></div></label>";
        getStreamings(query_selection[5]);
    }else if (params.length == 6 && params[1] == 0){ //reading query
        query_type = params[1]
        query_selection[0] = params[2]; // load trip
        query_selection[1] = params[3]; // load site
        query_selection[2] = params[4]; // load sector (skip spot)
        query_selection[3] = params[5].split('$'); // load spots

        console.log(query_selection[3]);
        console.log(query_selection);
        document.getElementById('query_type').innerHTML = "<label><div style='padding-top:10px;padding-bottom:10px;'><strong>Query loaded from permalink!</br><button onclick='removeQuery()'>Return to regular selection</button></strong></div></label>";
        getReadings(query_selection[0],true);
    }
    
}
function buildQuery(){
    console.log(query_selection);
    query_string = document.location.href.split('/?')[0];
    query_string += "?" + "query" 
    query_string += "/" + query_type
    if (query_type == 1){ // streaming
        query_string += "/" + query_selection[0];
        query_string += "/" + query_selection[1];
        query_string += "/" + query_selection[2];
        query_string += "/" + query_selection[3];
        query_string += "/" + query_selection[4];
        query_string += "/" + query_selection[5];
    }else{
        query_string += "/" + query_selection[0];
        query_string += "/" + query_selection[1];
        query_string += "/" + query_selection[2];
        query_string += "/" 
        for (x in query_selection[3]){
            if (x > 0){
                query_string += "$";
            }
            query_string += query_selection[3][x];
        }
    }
    document.getElementById('data-prompt').innerHTML = "Query Permalink: " + query_string;
}
function removeQuery(){
    query_type = null;
    query_selection = [null,null,null,null,null,null];
    current = document.location.href;
    base = current.split('?')[0];
    location.replace(base);
}
function toggleDetails(){ // details_mode located in data.js
    console.log('bruh')
    console.log(details_mode)
    var all = document.getElementsByClassName('data-catagory');
    console.log(all)
    for (var i = 0; i < all.length; i++) {
        if (details_mode == 0){

            all[i].classList.remove('data-catagory-simple');
            all[i].classList.add('data-catagory-detail');
            $("#button_details").css("opacity", "1.0");
        }else if (details_mode == 1){

            
            all[i].classList.remove('data-catagory-detail');
            all[i].classList.add('data-catagory-detail-2');
            $("#button_details").css("opacity", "1.0");
        }else {
            all[i].classList.remove('data-catagory-detail-2');
            all[i].classList.add('data-catagory-simple');
            $("#button_details").css("opacity", "0.5");
        }
    }
    details_mode = (details_mode + 1) % 3;
}
function createCSV(){
    const rows = [["tripid","platformid","sensorid","hostid","recordtime","value_1","quality","latitude","longitude","elevation","accuracy","satellites","value_2","value_3","siteid","sectorid","value_4","value_5","value_6"]];
    console.log(query_data[0]);
    for (x=0; x< query_data.length; x++){
        // ROW STRUCTURE
        current_row = [ 
            query_data[x].tripid.toString(),
            query_data[x].platformid.toString(),
            query_data[x].sensorid.toString(),
            query_data[x].hostid.toString(),
            query_data[x].recordtime.toString(),
            query_data[x].value_1 || "Null",
            query_data[x].quality.toString(),
            query_data[x].latitude.toString(),
            query_data[x].longitude.toString(),
            query_data[x].elevation.toString(),
            query_data[x].accuracy.toString(),
            query_data[x].satellites.toString(),
            query_data[x].value_2 || "Null",
            query_data[x].value_3 || "Null",
            query_data[x].siteid.toString(),
            query_data[x].sectorid.toString(),
            query_data[x].value_4 || "Null",
            query_data[x].value_5 || "Null",
            query_data[x].value_6 || "Null",
        ];
        rows.push(current_row)
    }
    console.log(rows);
    
    let csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(e => e.join(",")).join("\n");
    
    name = "data_" + query_selection[4] + "_" + query_selection[5];
    
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", name + ".csv");
    document.body.appendChild(link); // Required for FF
    
    link.click(); // This will download the data file named "my_data.csv".
}