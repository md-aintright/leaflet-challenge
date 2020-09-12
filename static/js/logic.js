// Create a map object
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
  });
  
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Store earthquake json inside jsonUrl
var jsonUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(jsonUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    var earthquakeData = data.features;

    // Loop through the earthquake array and create one circle for each feature
    for (var i = 0; i < earthquakeData.length; i++) {

        // Conditionals to determine color and perceived shaking based on magnitude
        var color = '';
        var perceivedShaking = '';

        // Perceived shaking data from https://www.usgs.gov/natural-hazards/earthquake-hazards/science/earthquake-magnitude-energy-release-and-shaking-intensity?qt-science_center_objects=0#qt-science_center_objects
        if (earthquakeData[i].properties.mag <=2 ){
            color = 'blue';
            perceivedShaking = 'Not felt';
        } else if(earthquakeData[i].properties.mag > 2 && earthquakeData[i].properties.mag <= 4){
            color = 'green';
            perceivedShaking = 'Weak';
        } else if(earthquakeData[i].properties.mag > 4 && earthquakeData[i].properties.mag <= 5 ){
            color = 'yellowgreen';
            perceivedShaking = 'Light';
        }else if(earthquakeData[i].properties.mag > 5 && earthquakeData[i].properties.mag <= 6 ){
            color = 'yellow';
            perceivedShaking = 'Moderate';
        }else if(earthquakeData[i].properties.mag > 6 && earthquakeData[i].properties.mag <= 7 ){
            color = 'orange';
            perceivedShaking = 'Strong';
        }else if(earthquakeData[i].properties.mag > 7 && earthquakeData[i].properties.mag <= 8 ){
            color = 'red';
            perceivedShaking = 'Very Strong';
        }else if(earthquakeData[i].properties.mag > 8 && earthquakeData[i].properties.mag <= 9 ){
            color = 'darkred';
            perceivedShaking = 'Severe';
        }else {
            color = 'purple';
            perceivedShaking = 'Violent';
        };

        // Create variable to hold lat/lon coordinates for each feature
        var plotCircles = [earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]];
        
        // Add circles to map
        L.circle(plotCircles, {
        fillOpacity: 0.75,
        color: "clear",
        fillColor: color,
        // Adjust radius
        radius: earthquakeData[i].properties.mag * 10000
        }).bindPopup("<h2>Magnitude: " + earthquakeData[i].properties.mag + "</h2> <br> <h2>Perceived Shaking: " + perceivedShaking + "</h2> <hr> <h3>" + earthquakeData[i].properties.place + "</h3> <br> <h3>" + new Date(earthquakeData[i].properties.time) + "</h3>").addTo(myMap);

    }

});

// function to get color for legend
function getColor(d) {
    return d > 9  ? 'purple' :
           d > 8  ? 'darkred' :
           d > 7  ? 'red' :
           d > 6  ? 'orange' :
           d > 5  ? 'yellow' :
           d > 4  ? 'yellowgreen' :
           d > 2  ? 'green' :
                    'blue';
}

// Add legend (code modified from https://leafletjs.com/examples/choropleth/)
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        mags = [0, 2, 4, 5, 6, 7, 8, 9],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mags.length; i++) {
        var from = mags[i];
        var to = mags[i + 1];

        labels.push(
        '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');

    return div;
};

legend.addTo(myMap);
