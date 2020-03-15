//background-imgae: 'https://www.4umaps.com/topomaps/preview/959199214_Bristol_L_Large.jpg'}
// from: https://www.4umaps.com/bristol/svg-scalable-vector-city-map.aspx?id=959199214
"use strict";

// TODO: Parse referrals to edges
function referrals_to_edges(rows) {
  console.log(rows)
  return rows;
}

// TODO: Load data from csv & json to collections of nodes & edges
function load_data() {
  //var edges = $.csv.toObjects("../../server_side/db/referrals_list_non_zero.csv");
  //var edges = d3.csv('file:///home/ben/Documents/third_year/datajam/WellbeingJam2020/src/server_side/db/referrals_list_non_zero.csv', function(rows) {
  //return referrals_to_edges(rows);
  //});
  var edges = 0
  console.log(edges);

  var nodes = 0;

  return [nodes, edges];
};

// TODO: Use data join to load nodes & edges
function generate_vis(nodes, edges) {
  return;
};

// TODO: Manage workflow
window.onload = function() {
    // var [nodes, edges] = load_data();
    // generate_vis(nodes, edges);

    // Set Up Canvas
    var width = 750;
    var height = 750;
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Draw 72 lines
    for (var i = 0; i < 72; i++) {
      svg.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 200)
          .attr("y2", 300)
          .style("stroke", "rgb(243,176,66)")
          .style("stroke-width", 2);
    }

    // Draw 78 circles
    for (var i = 0; i < 78; i++) {
      svg.append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", 0)
          .attr("fill", "rgb(0,0,255)");
    }

    // Load data for correct position [78]
    var grid_ref = {};
    d3.csv("/js/postcode_xy.csv", function(data) {
      grid_ref[data.postcode] = [data.x, data.y];
    });

    // Load data into circles [78]
    var services_location = [];
    var services_x = [];
    var services_y = [];
    var services_name = [];
    var services_appointments = [];
    var promise1 = new Promise (function (resolve, reject) {
      return d3.csv("/js/services_list.csv", function(data) {
        services_location.push(data.location);
        services_x.push(grid_ref[data.location][0]);
        services_y.push(grid_ref[data.location][1]);
        services_name.push(data.name);
        services_appointments.push(data.appointments / 500);
        resolve();
      });
    });

    promise1
      .then(function() {
        // Edit circles
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
        console.log("Error");
      });

    // Load data into lines [72 not 6205]
    var x1s = [];
    var y1s = [];
    var x2s = [];
    var y2s = [];
    var ts = [];
    var promise2 = new Promise (function (resolve, reject) {
      return d3.csv("/js/referrals_list_combined.csv", function(data) {
        x1s.push(grid_ref[data.source][0]);
        y1s.push(grid_ref[data.source][1]);
        x2s.push(grid_ref[data.dest][0]);
        y2s.push(grid_ref[data.dest][1]);
        ts.push(data.referrals / 100);
        resolve();
      });
    });

    promise2
      .then(function() {
          // EDIT LINES
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
        console.log("Error");
      });
    // promise2
    //   .then(function() {
    //     // EDIT LINES
    //     console.log(x1s);
    //     d3.selectAll("line")
    //       .data(x1s)
    //       .attr("x1", function(d) {return d;})
    //       .data(y1s)
    //       .attr("y1", function(d) {return d;})
    //       .data(x2s)
    //       .attr("x2", function(d) {return d;})
    //       .data(y2s)
    //       .attr("y2", function(d) {return d;})
    //     });
    //   .catch(function() {
    //     console.log("Error");
    //   });

    // Edit lines
    // var x1s = [200,200,300,350,450,450,450,550,600,650];
    // var y1s = [300,300,400,650,250,250,250,600,500,450];
    // var x2s = [450,400,350,200,650,500,400,400,250,250];
    // var y2s = [250,350,650,300,450,200,350,350,550,550];
    // var t = [1,1.5,2,2.5,3,3.5,4,4.5,5,5.5];
    // d3.selectAll("line")
    // .data(x1s)
    // .attr("x1", function(d) {return d;})
    // .data(y1s)
    // .attr("y1", function(d) {return d;})
    // .data(x2s)
    // .attr("x2", function(d) {return d;})
    // .data(y2s)
    // .attr("y2", function(d) {return d;})
    // .data(t)
    // .style("stroke-width", function(d) {return d;});

    // // Edit circles
    // var cxs = [200,250,300,350,400,450,500,550,600,650];
    // var cys = [300,550,400,650,350,250,200,600,500,450];
    // var rs = [10,15,20,25,30,35,40,45,50,55];
    // d3.selectAll("circle")
    //   .data(cxs)
    //   .attr("cx", function(d) {return d;})
    //   .data(cys)
    //   .attr("cy", function(d) {return d;})
    //   .data(rs)
    //   .attr("r", function(d) {return d;});

};
