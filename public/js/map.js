/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Map functions
*/

var mapstate = 0; // keep track of which map overlay is being used
var default_center = [-13.7055,65.2941]; //default starting coords for the map view
var view;
var map;
var prev_points = [];


require(["esri/Map", "esri/views/SceneView", "esri/views/MapView", "esri/Graphic", "esri/widgets/BasemapToggle", "esri/widgets/CoordinateConversion", "esri/PopupTemplate" ], function(
    Map,
    SceneView,
    MapView,
    Graphic,
    BasemapToggle,
    CoordinateConversion,
    PopupTemplate
  ) {
    map = new Map({
      basemap: "topo"
    });

    view = new MapView({
      center: [-13.68, 65.29],
      container: "viewDiv",
      map: map,
      zoom: 11
    });
    var basemapToggle = new BasemapToggle({
        viewModel: {  // autocasts as new BasemapToggleViewModel()
            view: view,  // The view that provides access to the map's "streets" basemap
            nextBasemap: "satellite"  // Allows for toggling to the "hybrid" basemap
        }
    });
    var coordinateConversionWidget = new CoordinateConversion({
        view: view
    });
    view.ui.add(basemapToggle, {
        position: "bottom-left",
        width: 200
    });
    view.ui.add(coordinateConversionWidget, "bottom-left");
});

function createPoints(points){
    require(["esri/Map", "esri/views/SceneView", "esri/views/MapView", "esri/Graphic", "esri/widgets/BasemapToggle", "esri/widgets/CoordinateConversion", "esri/PopupTemplate" ], function(
    Map,
    SceneView,
    MapView,
    Graphic,
    BasemapToggle,
    CoordinateConversion,
    PopupTemplate
    ){
        if (prev_points.length != 0){
            view.graphics.removeMany(prev_points);
            prev_points = [];
        }
        out_points = [];

        var markerSymbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: getRandomColor(),
        };
        view.center = [points[0].longitude, points[0].latitude]; // set center of view to the first point in the set

        for(x=0;x<points.length;x++){
            var point = {
                type: "point", // autocasts as new Point()
                longitude: points[x].longitude,
                latitude: points[x].latitude
            };
            
            // Create a graphic and add the geometry and symbol to it
            var pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol
            });
            
            out_points.push(pointGraphic);
        }
        prev_points = prev_points.concat(out_points);
        view.graphics.addMany(out_points);
        console.log('points added to map');
    });
}