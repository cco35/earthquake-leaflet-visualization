// Create map object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

// Add a title layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'


// Create function to append color based on earthquake depth
function chooseColor(depth) {
    if (depth > 90) return '#ff0800'; //candy apple red
    else if (depth > 70) return '#ed9121'; //carrot orange
    else if (depth> 50) return '#fff600'; //cadmium yellow
    else if (depth > 30) return '#fee08b'; //pale yellow 
    else if (depth > 10) return '#458b00'; //chartreuse 4
    else return '#66ff00'; //bright green
}


// Get the data with d3.
d3.json(url).then(function(data) {
// Creating a GeoJSON layer with the retrieved data
L.geoJson(data, {
  // Create circular markers for each earthquake point
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: feature.properties.mag*4,
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    });
},
    // This is called on each feature.
    onEachFeature: function(feature, layer) {
        // Giving each feature a popup with information that's relevant to it
        layer.bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h2>" + 'Magnitude: '
        + feature.properties.mag + "</h2> <hr> <h2>" + 'Depth: ' 
        + feature.geometry.coordinates[2] + "</h2>");
    }
}).addTo(myMap);
});

// Define legend content
let legendContent = '<div class="legend-box">' +
'<div class="legend-item"><span style="background-color: #66ff00"></span> -10-10</div>' +
'<div class="legend-item"><span style="background-color: #458b00"></span> 10-30</div>' +
'<div class="legend-item"><span style="background-color: #fee08b"></span> 30-50</div>' +
'<div class="legend-item"><span style="background-color: #fff600"></span> 50-70</div>' +
'<div class="legend-item"><span style="background-color: #ed9121"></span> 70-90</div>' +
'<div class="legend-item"><span style="background-color: #ff0800"></span> 90+</div>' +
'</div>';

// Create legend box
let legendStyle = document.createElement('style');
legendStyle.innerHTML = '.legend-box { background-color: white; border: 1px solid #ccc; padding: 10px; margin: 10px; }';
document.head.appendChild(legendStyle);

// Create a legend control
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
   let div = L.DomUtil.create('div', 'info legend');
   div.innerHTML = legendContent;
   return div;
};

// Add legend to the map
legend.addTo(myMap);