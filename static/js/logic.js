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
    if (depth > 90) return "red";
    else if (depth > 70) return "orange";
    else if (depth> 50) return "lightorange";
    else if (depth > 30) return "yellow";
    else if (depth > 10) return "green";
    else return "lightgreen";
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
    let legendContent = '<div class="legend">' +
        '<div class="legend-item"><span style="background-color: red"></span> Depth > 90</div>' +
        '<div class="legend-item"><span style="background-color: orange"></span> Depth > 70</div>' +
        '<div class="legend-item"><span style="background-color: lightorange"></span> Depth > 50</div>' +
        '<div class="legend-item"><span style="background-color: yellow"></span> Depth > 30</div>' +
        '<div class="legend-item"><span style="background-color: green"></span> Depth > 10</div>' +
        '<div class="legend-item"><span style="background-color: lightgreen"></span> Depth <= 10</div>' +
        '</div>';

    // Create a legend control
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = legendContent;
        return div;
    };

    // Add legend to the map
    legend.addTo(myMap);

    // Add GeoJSON layer to the legend control
    legend.addOverlay(geojsonLayer, 'Earthquake Circles');;