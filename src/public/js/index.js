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
      x1s.push(grid_ref[data.source][0]);
      y1s.push(grid_ref[data.source][1]);
      x2s.push(grid_ref[data.dest][0]);
      y2s.push(grid_ref[data.dest][1]);
      ts.push(data.referrals / 100);
      resolve();
    });
  });

  promise
    .then(function() {
        generate_edges(svg, x1s.length);

        d3.selectAll("line")
          .data(x1s)
          .attr("x1", function(d) {return d;})
          .data(y1s)
          .attr("y1", function(d) {return d;})
          .data(x2s)
          .attr("x2", function(d) {return d;})
          .data(y2s)
          .attr("y2", function(d) {return d;})
          .data(ts)
          .style("stroke-width", function(d) {return d;});
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
      services_location.push(data.location);
      services_x.push(grid_ref[data.location][0]);
      services_y.push(grid_ref[data.location][1]);
      services_name.push(data.name);
      services_appointments.push(data.appointments / 500);
      resolve();
    });
  });

  promise
    .then(function() {
      generate_nodes(svg, services_x.length);

      d3.selectAll("circle")
        .data(services_x)
        .attr("cx", function(d) {return d;})
        .data(services_y)
        .attr("cy", function(d) {return d;})
        .data(services_appointments)
        .attr("r", function(d) {return d;})
        .data(services_name)
        .attr('id', function(d) {return d;});

      d3.selectAll("#GP").attr("fill", "rgb(244,89,91)");
    })
    .catch(function() {
      console.log("Error Loading Nodes");
    });

  return [services_location, services_x, services_y, services_name, services_appointments];
};

// Loads postcode to co-ordinate data
function load_grid_ref() {
  var grid_ref = {};
  d3.csv("/js/postcode_xy.csv", function(data) {
    grid_ref[data.postcode] = [data.x, data.y];
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

    var svg = create_canvas(750, 750);

    var grid_ref = load_grid_ref();
    var referrals_edges = load_vis_edges(svg, grid_ref);
    var services_nodes = load_vis_nodes(svg, grid_ref);



};
