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
    document.getElementById("dataView").style.display = "none";
    document.getElementById("graphView").style.display = "none";
    document.getElementById("mapView").style.display = "block";
    console.log('switched to map view');
}
function switchToGraph(){
    document.getElementById("mapView").style.display = "none";
    document.getElementById("dataView").style.display = "none";
    document.getElementById("graphView").style.display = "block";
    console.log('switched to graph view');
}
function switchToData(){
    document.getElementById("mapView").style.display = "none";
    document.getElementById("graphView").style.display = "none";
    document.getElementById("dataView").style.display = "block";
    console.log('switched to data view');
}

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
        radioHtml += 'onchange="getStreamings('+ sectorid + ')"';
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
function createRadioElementStreamings( mode, name, checked, label ) {
    var radioHtml = '<div class="elem-div elem-' + mode + '"><input class="data-radio form-radio" onclick="displayStreamings(' + "'" + label + "'" + ')" type="radio" name="' + name + '" id="' + label + '"';
    if ( checked ) {
        radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';
    radioHtml += '<label for="' + label + '"><strong>Set '+ label +'</strong></label></div>';
    return radioHtml;
}