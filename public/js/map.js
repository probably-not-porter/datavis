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

// Set map types
maptype1 = "topo";
maptype2 = "satellite";


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
      basemap: maptype1
    });

    view = new MapView({
      center: [-13.68, 65.29],
      container: "viewDiv",
      map: map,
      zoom: 15
    });
    var basemapToggle = new BasemapToggle({
        viewModel: {  // autocasts as new BasemapToggleViewModel()
            view: view,  // The view that provides access to the map's "streets" basemap
            nextBasemap: maptype2  // Allows for toggling to the "hybrid" basemap
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

function createPoints(points,color){
    new_points = [points[0]];
    prunes = 0;
    for(x=1;x<points.length;x++){
        if ((points[x].latitude == points[x-1].latitude) && (points[x].longitude == points[x-1].longitude) && (points[x].recordtime == points[x-1].recordtime)){
            prunes++;
        }else{
            new_points.push(points[x]);
        } 
    }
    points = new_points
    console.log(points);
    console.info("Pruned " + prunes + " duplicate map points.");
    console.warn('UPDATING MAP: this might take a minute!');
    require(["esri/Map", "esri/views/SceneView", "esri/views/MapView", "esri/Graphic", "esri/widgets/BasemapToggle", "esri/widgets/CoordinateConversion", "esri/PopupTemplate", "esri/layers/FeatureLayer" ], function(
    Map,
    SceneView,
    MapView,
    Graphic,
    BasemapToggle,
    CoordinateConversion,
    PopupTemplate,
    FeatureLayer
    ){
        if (prev_points.length != 0){
            view.graphics.removeMany(prev_points);
            prev_points = [];
        }
        out_points = [];

        var markerSymbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: color,
        };
        if (points.length > 0){
            view.center = [points[0].longitude, points[0].latitude]; // set center of view to the first point in the set
        }

        for(x=0;x<points.length;x++){
            var point = {
                type: "point", // autocasts as new Point()
                longitude: points[x].longitude,
                latitude: points[x].latitude
            };

            let timedate = new Date(points[x].recordtime).toString().split(" ")
            let date = timedate[0] + " " + timedate[1] + " " + timedate[2] + ", " + timedate[3];
            let time = timedate[4] + " " + timedate[6] + " " + timedate[7] + " " + timedate[8];

            var pointAttr = {
                Longitude: points[x].longitude,
                Latitude: points[x].latitude,
                Elevation: points[x].elevation,
                Accuracy: points[x].accuracy,
                Time: time,
                Date: date,
                Platform: points[x].platformid,
                SensorType: points[x].sensortype,
                SensorValue: points[x].value_1 + " " + points[x].sensorunits,
            }
            
            // Create a graphic and add the geometry and symbol to it
            var pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes: pointAttr,
                popupTemplate: { // NEW
                    // autocasts as new PopupTemplate()
                    title: "{Platform} - {Time}",
                    content: [
                      {
                        type: "fields",
                        fieldInfos: [
                          {
                            fieldName: "Longitude"
                          },
                          {
                            fieldName: "Latitude"
                          },
                          {
                            fieldName: "Elevation"
                          },
                          {
                            fieldName: "Accuracy"
                          },
                          {
                            fieldName: "Time"
                          },
                          {
                            fieldName: "Date"
                          },
                          {
                            fieldName: "Platform"
                          },
                          {
                            fieldName: "SensorType"
                          },
                          {
                            fieldName: "SensorValue"
                          }
                        ]
                      }
                    ]
                  }
            });
            
            out_points.push(pointGraphic);
        }
        prev_points = prev_points.concat(out_points);
        view.graphics.addMany(out_points);
    });
}