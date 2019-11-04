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
    setTimeout(function(){ document.getElementById("loading").style.display = "block"; }, 10);
    document.getElementById("dataView").style.display = "none";
    document.getElementById("graphView").style.display = "none";
    document.getElementById("mapView").style.display = "block";
    console.log('switched to map view');
    setTimeout(function(){ document.getElementById("loading").style.display = "none"; }, 10);
}
function switchToGraph(){
    setTimeout(function(){ document.getElementById("loading").style.display = "block"; }, 10);
    document.getElementById("mapView").style.display = "none";
    document.getElementById("dataView").style.display = "none";
    document.getElementById("graphView").style.display = "block";
    console.log('switched to graph view');
    setTimeout(function(){ document.getElementById("loading").style.display = "none"; }, 10);}
function switchToData(){
    setTimeout(function(){ document.getElementById("loading").style.display = "block"; }, 10);
    document.getElementById("mapView").style.display = "none";
    document.getElementById("graphView").style.display = "none";
    document.getElementById("dataView").style.display = "block";
    console.log('switched to data view');
    setTimeout(function(){ document.getElementById("loading").style.display = "none"; }, 10);}

// TEAMPLATES FOR DOM PIECES
function createRadioElementTrips( mode, name, checked, label, id ) {
    var radioHtml = '<div class="elem-div elem-' + mode + '"><input class="data-radio form-radio" onchange="getSites(' + id + ')" type="radio" name="' + name + '" id="' + label + '"';
    if ( checked ) {
        radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';
    radioHtml += '<label for="' + label + '"><strong>'+ label + "</strong> (ID: " + id +')</label></div>';

    return radioHtml;
}

function createRadioElementSites( mode, name, checked, label, siteid ) {
    var radioHtml = '<div class="elem-div elem-' + mode + '"><input class="data-radio form-radio" onchange="getSectors('+ siteid + ')" type="radio" name="' + name + '" id="' + label + '"';
    if ( checked ) {
        radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';
    radioHtml += '<label for="' + label + '"><strong>'+ label +"</strong> (ID: " + siteid +')</label></div>';

    return radioHtml;
}
function createRadioElementSectors( mode, name, checked, label,sectorid ) {
    var radioHtml = '<div class="elem-div elem-' + mode + '"><input class="data-radio form-radio" '
    // switch for streaming
    if (query_type == 1){
        radioHtml += 'onchange="getStreamingsPlatforms('+ sectorid + ')"';
    }else{
        radioHtml += 'onchange="getSpots('+ sectorid + ')"';
    }

    radioHtml += ' type="radio" name="' + name + '" id="' + label + '"';
    if ( checked ) {
        radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';
    radioHtml += '<label for="' + label + '"><strong>'+ label +"</strong> (ID: " + sectorid +')</label></div>';

    return radioHtml;
}
function createRadioElementSpots( mode, name, checked, label,spotid ) {
    var radioHtml = '<div class="elem-div elem-' + mode + '"><input class="data-radio form-radio" onchange="getReadings('+ spotid + ')" type="radio" name="' + name + '" id="' + label + '"';
    if ( checked ) {
        radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';
    radioHtml += '<label for="' + label + '"><strong>Spot #'+ label +'</strong></label></div>';

    return radioHtml;
}
function createRadioElementStreamingsPlatforms( mode, name, checked, id,name ) {
    console.log(id);
    var radioHtml = '<div class="elem-div elem-' + mode + '"><input class="data-radio form-radio" onchange="getStreamingsDates('+ "'" +id.toString()+ "'" +')"type="radio" name="' + 'streamingplatforms' + '" id="' + name + '"';
    if ( checked ) {
        radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';
    radioHtml += '<label for="' + name + '"><strong>'+ name + "</strong> (ID: " + id + ")" +'</label></div>';
    
    return radioHtml;
}
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
    var radioHtml = '<div class="elem-div elem-' + mode + '"><input class="data-radio form-radio" onclick="displayStreamings(' + "'" + label + "'" + ')" type="radio" name="' + name + '" id="' + label + '"';
    if ( checked ) {
        radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';
    radioHtml += '<label for="' + label + '"><strong>Set '+ label +'</strong></label></div>';
    return radioHtml;
}
function createRadioElementReadings( mode, name, checked, label ) {
    var radioHtml = '<div class="elem-div elem-' + mode + '"><input class="data-radio form-radio" onclick="displayReadings(' + "'" + label + "'" + ')" type="radio" name="' + name + '" id="' + label + '"';
    if ( checked ) {
        radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';
    radioHtml += '<label for="' + label + '"><strong>Set '+ label +'</strong></label></div>';
    return radioHtml;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}