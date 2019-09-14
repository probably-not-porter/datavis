var mapstate = 0;
require([
    "esri/Map",
    "esri/views/MapView"
], function(Map, MapView) {
    var map1 = new Map({
        basemap: "topo"
    });
    var map2 = new Map({
        basemap: "satellite"
    });
    var view = new MapView({
        container: "viewDiv",
        map: map1,
        center: [-118.71511,34.09042],
        zoom: 11
    });
    document.querySelector("#btn_topo").addEventListener("click", function(event) {
        if (mapstate != 0){
            mapstate = 0;
            view.map = map1;
            console.log('switch to topo');
        }
        else {
            console.log('already in state 0');
        }
    });
    document.querySelector("#btn_sat").addEventListener("click", function(event) {
        if (mapstate != 1){
            mapstate = 1;
            view.map = map2;
            console.log('switch to sat');
        }
        else {
            console.log('already in state 1');
        }
    });
});

function toggleControls(){
    console.log('test');
    $('#controls').slideToggle();
}