var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<\/a> contributors'
});

var oslTilelayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
  '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery Â© <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.light'
});

var streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
  '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery Â© <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
});

// var map = L.map(document.getElementById('map'), {zoomControl: true}).setView([-26.21,28.03], 15);
var map = L.map(document.getElementById('map'),{
  center: [-26.21,28.03],
  zoom: 15,
  layers: [osmLayer, oslTilelayer, streets]
});

var baseMaps = {
  "Mapbox Light": oslTilelayer,
  "Mapbox Streets": streets,
  "OSM": osmLayer
};

var overlayMaps = {};

var lc = L.control.layers(baseMaps, overlayMaps, {collapsed: true}).addTo(map);

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

var drawnItems = new L.FeatureGroup()
map.addLayer(drawnItems)

var drawControl = new L.Control.Draw({
  position: 'bottomright',
  draw:{
    polygon: {
      shapeOptions: {
        color: 'purple'
      },
      allowIntersection: false,
      drawError: {
        color: 'orange',
        timeout: 1000
      },
      showArea: true,
      metric: true,
      repeatMode: true,
    },
    marker: false,
    polyline: {
      shapeOptions: {
        color: 'red'
      },
      allowIntersection: false,
      drawError: {
        color: 'orange',
        timeout: 1000
      },
      repeatMode: true,
    },
    circlemarker: false,
    rectangle: {
      shapeOptions: {
        color: 'green'
      },
      showArea: true,
      metric: true,
      repeatMode: true,
    },
    circle: {
      shapeOptions: {
        color: 'steelblue'
      },
      showArea: true,
      metric: true,
      repeatMode: true,
    },
  },
  edit: {
    featureGroup: drawnItems
  }
});

map.addControl(drawControl);
map.on(L.Draw.Event.CREATED, function (e) {
   var layer = e.layer;
    drawnItems.addLayer(layer);

    // on click, convert to geoJSON
    document.getElementById("export").onclick = function (e){
      var data = drawnItems.toGeoJSON();
      // Stringify the GeoJSON
      var convertedData = 'text/json; charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
      var str = JSON.stringify(data, undefined, 4);
      document.getElementById("geojson_data").innerHTML = str;

      document.getElementById('download').onclick = function (e){
        document.getElementById('download').setAttribute('href', 'data:' + convertedData);
        document.getElementById('download').setAttribute('download','data.geojson');  
      }
      
    }
    // // on click, export features
    // document.getElementById('export').onclick = function (e){
    //   // extract GeoJSON from drawnItems
    //   var data

      
    //   // create export
    //   document.getElementById('export').setAttribute('href', 'data:' + convertedData);
    //   document.getElementById('export').setAttribute('download','data.geojson');
    // }
});