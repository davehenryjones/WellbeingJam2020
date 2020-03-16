//background-imgae: 'https://www.4umaps.com/topomaps/preview/959199214_Bristol_L_Large.jpg'}
// from: https://www.4umaps.com/bristol/svg-scalable-vector-city-map.aspx?id=959199214
"use strict";

// Load data from csv to create edges
function load_vis_edges(svg, grid_ref) {
  var x1s = [];
  var y1s = [];
  var x2s = [];
  var y2s = [];
  var ts = [];

  var promise = new Promise (function (resolve, reject) {
    return d3.csv("/js/referrals_list_combined.csv", function(data) {
      for (let i = 0; i < data.length; i++) {
        x1s.push(grid_ref[data[i].source][0]);
        y1s.push(grid_ref[data[i].source][1]);
        x2s.push(grid_ref[data[i].dest][0]);
        y2s.push(grid_ref[data[i].dest][1]);
        ts.push(data[i].referrals / 100);
      };
      resolve();
    });
  });

  promise
    .then(function() {
        // generate_edges(svg, x1s.length);
        //
        // d3.selectAll("line")
        //   .data(x1s)
        //   .attr("x1", function(d) {return d;})
        //   .data(y1s)
        //   .attr("y1", function(d) {return d;})
        //   .data(x2s)
        //   .attr("x2", function(d) {return d;})
        //   .data(y2s)
        //   .attr("y2", function(d) {return d;})
        //   .data(ts)
        //   .style("stroke-width", function(d) {return d;});

        for (let i = 0; i < x1s.length; i++) {
          var polyline = L.polyline([[x1s[i], y1s[i]],[x2s[i], y2s[i]]], {
            color: 'red',
            weight: ts[i] / 5
          }).addTo(svg);
        };
      })
    .catch(function() {
      console.log("Error Loading Edges");
    });

    return [x1s, y1s, x2s, y2s, ts];
};

// Load data from csv to create nodes
function load_vis_nodes(svg, grid_ref) {
  var services_location = [];
  var services_x = [];
  var services_y = [];
  var services_name = [];
  var services_appointments = [];

  var promise = new Promise (function (resolve, reject) {
    return d3.csv("/js/services_list.csv", function(data) {
      for (let i = 0; i < data.length; i++) {
        services_location.push(data[i].location);
        services_x.push(grid_ref[data[i].location][0]);
        services_y.push(grid_ref[data[i].location][1]);
        services_name.push(data[i].name);
        services_appointments.push(data[i].appointments / 500);
      }
      resolve();
    });
  });

  promise
    .then(function() {
      // generate_nodes(svg, services_x.length);
      //
      // d3.selectAll("circle")
      //   .data(services_x)
      //   .attr("cx", function(d) {return d;})
      //   .data(services_y)
      //   .attr("cy", function(d) {return d;})
      //   .data(services_appointments)
      //   .attr("r", function(d) {return d;})
      //   .data(services_name)
      //   .attr('id', function(d) {return d;});
      for (let i = 0;i<services_x.length;i++) {
        var circle = L.circle([services_x[i], services_y[i]], {
            color: 'none',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: services_appointments[i] * 25
          }).addTo(svg);
      };

      //d3.selectAll("#GP").attr("fill", "rgb(244,89,91)");
    })
    .catch(function() {
      console.log("Error Loading Nodes");
    });

  return [services_location, services_x, services_y, services_name, services_appointments];
};

// Loads postcode to co-ordinate data
function load_grid_ref() {
  var grid_ref = {};
  d3.csv("/js/postcode_ne.csv", function(data) {
    for (let i = 0; i < data.length; i++) {
      grid_ref[data[i].postcode] = [data[i].north, data[i].east];
    };
  });

  return grid_ref;
};

// Create the correct number of nodes
function generate_nodes(svg, node_num) {
  for (var i = 0; i < node_num; i++) {
    svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 0)
        .attr("fill", "rgb(0,0,255)");
  };

  return svg;
};

// Create the correct number of edges
function generate_edges(svg, edge_num) {
  for (var i = 0; i < edge_num; i++) {
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", 0)
        .style("stroke", "rgb(243,176,66)")
        .style("stroke-width", 0);
  };

  return svg;
};

// Generates a canvas of specified size
function create_canvas(width, height) {
  var svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  return svg;
};

// Manage workflow
window.onload = function() {

    // initialize the map on the "map" div with a given center and zoom
    var mymap = L.map('mapid', {
        center: [51.455, -2.599],
        zoom: 13
    });

    // Load map of Bristol
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoicGF2ZS1oZWFsdGgiLCJhIjoiY2s3dWQxZHUzMTZlYTNncXR1OHB2NTBkYiJ9.7mf8ut1FJpHCFzcsy7qiDA'
    }).addTo(mymap);

    // var circle = L.circle([51.455, -2.599], {
    //   color: 'none',
    //   fillColor: '#f03',
    //   fillOpacity: 0.5,
    //   radius: 500
    // }).addTo(mymap);

    //var polyline = L.polyline([[51.455, -2.599],[51,-2]], {color: 'red'}).addTo(mymap);

    // Load Data Vis from data
    //var svg = create_canvas(750, 750);
    var grid_ref = load_grid_ref();
    var referrals_edges = load_vis_edges(mymap, grid_ref);
    var services_nodes = load_vis_nodes(mymap, grid_ref);
};
