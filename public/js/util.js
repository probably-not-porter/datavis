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
function createRadioElement(name, id, label, f){
    console.log(name,id,label);
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
    radioHtml += '<span class="detailed_info"> (ID: ' + id +')</span>';
    radioHtml += '</label></div>';

    return radioHtml;
}

// take information from data.js and write it into html
function createRadioElementTrips( mode, name, checked, label, id ) {
    var f = "getSites";
    return createRadioElement(name, id, label, f);
}

function createRadioElementSites( mode, name, checked, label, id ) {
    var f = "getSectors";
    return createRadioElement(name, id, label, f);
}
// this one is different since it changes for reading and streaming
function createRadioElementSectors( mode, name, checked, label, id ) {
    var f = "getSpots"; // if reading
    if (query_type == 1){ // if streaming
        f = "getStreamingsPlatforms";
    }
    return createRadioElement(name, id, label, f);
}
function createRadioElementSpots( mode, name, checked, label,id ) {
    var f = "getReadings";
    //return createRadioElement(name, id, label, f);
    console.log(name,id,label);
    var radioHtml = '<div class="elem-div elem-0">'
    if (typeof id === 'string' || id instanceof String){
        radioHtml += '<input class="data-radio form-radio" onchange="'+ f +'(';
        radioHtml += "'" + id + "'";
        radioHtml +=')" type="checkbox" name="' + name + '" id="' + label + '" />';
    }else{
        radioHtml += '<input class="data-radio form-radio" onchange="'+ f +'(' + id + ',this.checked)" type="checkbox" name="' + name + '" id="' + label + '" />';
    }
    radioHtml += '<label for="' + label + '">';
    radioHtml += '<strong>'+ label + "</strong>";
    radioHtml += '<span class="detailed_info"> (ID: ' + id +')</span>';
    radioHtml += '</label></div>';

    return radioHtml;
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