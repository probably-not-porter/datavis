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
    unselect("btn_sat");
    select('btn_topo');
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
    getTrips();
    console.log('switched to data view');
}
function select(tag){ // show button as selected
    console.log(tag);
    var element = document.querySelector("#" + tag)
    element.classList.add("btn-select");
    element.classList.remove("btn-unselect");
}
function unselect(tag){ // show button as unselected
    console.log(tag);
    var element = document.querySelector("#" + tag)
    element.classList.remove("btn-select");
    element.classList.add("btn-unselect");
}

function createRadioElementTrips( name, checked, label, id ) {
    var radioHtml = '<div class="elem-div"><input class="data-radio form-radio" onchange="getSites(' + id + ')" type="radio" name="' + name + '" id="' + label + '"';
    if ( checked ) {
        radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';
    radioHtml += '<label for="' + label + '">'+ label +'</label></div>';

    return radioHtml;
}

function createRadioElementSites( name, checked, label, siteid,tripid ) {
    var radioHtml = '<div class="elem-div"><input class="data-radio form-radio" onchange="getSectors('+ siteid + ',' + tripid +')" type="radio" name="' + name + '" id="' + label + '"';
    if ( checked ) {
        radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';
    radioHtml += '<label for="' + label + '">'+ label +'</label></div>';

    return radioHtml;
}
function createRadioElementSectors( name, checked, label) {
    var radioHtml = '<div class="elem-div"><input class="data-radio form-radio" type="radio" name="' + name + '" id="' + label + '"';
    if ( checked ) {
        radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';
    radioHtml += '<label for="' + label + '">'+ label +'</label></div>';

    return radioHtml;
}