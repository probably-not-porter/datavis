/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Map and Data functions
*/

// MAP //
function mapReady(){
    unselect("btn_sat");
    select('btn_topo');
    switchToData()
}
var mapstate = 0;

require([
    "esri/Map",
    "esri/views/MapView"
], function(Map, MapView) {
    var map1 = new Map({ //topo map
        basemap: "topo"
    });
    var map2 = new Map({ //sat map
        basemap: "satellite"
    });
    var view = new MapView({ //init map
        container: "viewDiv",
        map: map1,
        center: [-13.7055,65.2941],
        zoom: 11
    });
    var coordsWidget = document.createElement("div"); // get coords
    coordsWidget.id = "coordsWidget";
    coordsWidget.className = "esri-widget esri-component";
    coordsWidget.style.padding = "7px 15px 5px";
    view.ui.add(coordsWidget, "bottom-left");

    function showCoordinates(pt) {
        var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) +
            " | Scale 1:" + Math.round(view.scale * 1) / 1 +
            " | Zoom " + view.zoom;
        coordsWidget.innerHTML = coords;
      }

    // LISTENERS //
    view.watch("stationary", function(isStationary) {
        showCoordinates(view.center);
    });

    view.on("pointer-move", function(evt) {
        showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
    });
    document.querySelector("#btn_topo").addEventListener("click", function(event) {
        if (mapstate != 0){
            mapstate = 0;
            unselect('btn_sat');
            select('btn_topo');
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
            select('btn_sat');
            unselect('btn_topo');
            view.map = map2;
            console.log('switch to sat');
        }
        else {
            console.log('already in state 1');
        }
    });
});

// DATA // 