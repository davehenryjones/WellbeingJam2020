"use strict";

import {load_vis_nodes} from '/js/vis_nodes.js';
import {load_data_from_default} from '/js/data_input_handler.js';

// Loads postcode to co-ordinate data
function load_grid_ref() {
  var grid_ref = {};
  d3.csv("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/postcode_ne.csv", function(data) {
    for (let i = 0; i < data.length; i++) {
      grid_ref[data[i].postcode] = [data[i].north, data[i].east];
    };
  });

  return grid_ref;
};

// Manage workflow
window.onload = function() {

    // initialize the map on the "map" div with a given center and zoom
    var mymap = L.map('mapid', {
        center: [51.455, -2.599],
        zoom: 13
    });

    // Load map of Bristol
    var earth = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoicGF2ZS1oZWFsdGgiLCJhIjoiY2s3dWQxZHUzMTZlYTNncXR1OHB2NTBkYiJ9.7mf8ut1FJpHCFzcsy7qiDA'
    });
    earth.addTo(mymap);

    // Load Data Vis from data
    var grid_ref = load_grid_ref();
    var services_nodes;
    services_nodes = load_data_from_default(grid_ref);
    console.log(services_nodes);

    setTimeout(function() {load_vis_nodes(mymap, grid_ref, services_nodes.cacaaeda);}, 3000);

    setTimeout(function() {
      mymap.eachLayer(function (layer) {
        mymap.removeLayer(layer);
      });
      earth.addTo(mymap);
      load_vis_nodes(mymap, grid_ref, services_nodes.cacaafab);
    }, 6000);

    setTimeout(function() {
      mymap.eachLayer(function (layer) {
        mymap.removeLayer(layer);
      });
      earth.addTo(mymap);
      load_vis_nodes(mymap, grid_ref, services_nodes.cacaafac);
    }, 9000);

};
