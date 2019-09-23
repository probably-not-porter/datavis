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
function select(tag){
    console.log(tag);
    var element = document.querySelector("#" + tag)
    element.classList.add("btn-select");
    element.classList.remove("btn-unselect");
}
function unselect(tag){
    console.log(tag);
    var element = document.querySelector("#" + tag)
    element.classList.remove("btn-select");
    element.classList.add("btn-unselect");
}