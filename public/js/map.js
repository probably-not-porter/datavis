var map = null;

$( document ).ready(function() {
    map = L.map('viewDiv').setView([63.44382, -20.272245], 13);
    map.getSize();
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
});

function renderMap(){
    map.invalidateSize();
}

function createPoints(points,color){
    for(x = 0; x < points.length; x++){
        console.log(points[x]);
        p = points[x];
        L.marker([ p["latitude"], p["longitude"] ]).addTo(map)
            .bindPopup(p["recordtime"])
    }
}

/* 
    {
      "tripid": 27,
      "siteid": 12,
      "sectorid": 102,
      "hostid": "aaef7faa",
      "platformid": "ev4",
      "sensorid": "81c",
      "sensortype": "MPL3115A2-Air Temperature",
      "sensorunits": "C",
      "recordtime": "2019-06-05T12:39:53.000Z",
      "longitude": -20.272245,
      "latitude": 63.44382,
      "quality": 0,
      "elevation": 65,
      "accuracy": 6.068,
      "satellites": 17,
      "value_1": "25.144",
      "value_2": "0.0",
      "value_3": "0.0",
      "value_4": null,
      "value_5": null,
      "value_6": null
    }
    */