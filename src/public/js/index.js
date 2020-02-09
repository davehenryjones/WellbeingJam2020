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
  var edges = 0;
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
    var [nodes, edges] = load_data();
    generate_vis(nodes, edges);

    var width = 300;
    var height = 300;
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    svg.append("line")
        .attr("x1", 100)
        .attr("y1", 100)
        .attr("x2", 200)
        .attr("y2", 200)
        .style("stroke", "rgb(255,0,0)")
        .style("stroke-width", 2);
};
