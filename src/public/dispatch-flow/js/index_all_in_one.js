"use strict";

let design, nodes = [], edges = [], map;
let node_layer, edge_layer;
let animate_edges;

// Set date to first date (01/10/2020 00:00)
let anim_date = new Date(2020, 10, 1);
let anim_hour = 0;

/*  CONTROL FUNCTIONS
// These functions run when the page loads and control the flow of
// information to create the vis.
*/

// On page laod
window.onload = async function() {
  document.getElementById("page_loaded").style.display = "none";
  document.getElementById("metrics_pane").style.display = "none";
  create_triggers();
  map = L.map('mapid', {   // initialize the map on the "mapid" div
      center: [51.455, -2.599],
      zoom: 12
  });
  design = new Design();

  // Load nodes, edges and URL parameters
  await load_default_nodes().then(async () => {
    document.getElementById("loading_state").innerHTML = "2/3: Creating referral edges";
    await load_default_edges();
  }).then(async () => {
    document.getElementById("loading_state").innerHTML = "3/3: Adding data to map...";
    await load_vis(design, nodes, edges, map);
  }).then( async () => {
    const params = new URLSearchParams(window.location.search);
    parse_params(params);
    console.log(nodes.length);
    console.log(edges.length);
    document.getElementById("loader").style.webkitAnimationPlayState = 'paused';
    document.getElementById("page_loading").remove();
    document.getElementById("page_loaded").style.display = "block";
  });

  // Load map skin
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicGF2ZS1oZWFsdGgiLCJhIjoiY2s3dWQxZHUzMTZlYTNncXR1OHB2NTBkYiJ9.7mf8ut1FJpHCFzcsy7qiDA'
  }).addTo(map);
}

// Parse web url parameters
function parse_params(params) {
  if (params.has('usage_scaling')) {
    let event = document.createEvent("HTMLEvents");
    event.initEvent('change', document.getElementById("usage_scaling").value, params.get('usage_scaling'));
    document.getElementById("usage_scaling").value = params.get('usage_scaling');
    document.getElementById("usage_scaling").dispatchEvent(event);
  }
  if (params.has('edge_scaling')) {
    let event = document.createEvent("HTMLEvents");
    event.initEvent('change', document.getElementById("edge_scaling").value, params.get('edge_scaling'));
    document.getElementById("edge_scaling").value = params.get('edge_scaling');
    document.getElementById("edge_scaling").dispatchEvent(event);
  }
  if (params.has('edge_colour')) {
    let event = document.createEvent("HTMLEvents");
    event.initEvent('change', document.getElementById("edge_colour").value, params.get('edge_colour'));
    document.getElementById("edge_colour").value = params.get('edge_colour');
    document.getElementById("edge_colour").dispatchEvent(event);
  }
  if (params.has('node_colour')) {
    let event = document.createEvent("HTMLEvents");
    event.initEvent('change', document.getElementById("node_colour").value, params.get('node_colour'));
    document.getElementById("node_colour").value = params.get('node_colour');
    document.getElementById("node_colour").dispatchEvent(event);
  }
}


/*  EDGE Functions
// These functions control edges in the vis
*/

// Edge object
// Inputs: Node start_node, Node end_node, Dict(diagnosis : weight) weights
class Edge {
  constructor(start_node=null, end_node=null, weights=null, info=null) {
    this.start_node =  start_node;
    this.end_node = end_node;
    this.weights = weights;
    this.info = info;
    this.layer = null;
    this.filtered = 0;
  }
}

// Load Default Edges
const load_default_edges = async ()=> {
  return new Promise ((resolve, reject) => {
    d3.csv("/dispatch-flow/resources/referrals.csv", function(data) {
      for (let i = 0; i < data.length; i++) {
        let start_node = nodes.filter(node => node.name == "111")[0];
        let end_node = nodes.filter(node => node.name == data[i].org_Name)[0];
        if (end_node == null) {
          continue;
        }

        nodes.filter(node => node.name == data[i].org_Name)[0].weights.all += Number(1);
        let weights_dict = {
            "all" : 1,
            "date" : data[i].Call_Time.substring(0,10),
            "hour" : data[i].HOD
        }

        let info = {
          "service_type": data[i].Service_Type,
          "dispo_broad": data[i].Dispo_Broad_Group,
          "dispo": data[i].Dispo_Group,
          "sd": data[i].SD_Description,
          "sg": data[i].SG_Description
        };

        let edge = new Edge (start_node, end_node, weights_dict, info);
        edges.push(edge);
      };
      resolve();
    });
  });
}

/*  NODES Functions
// These functions control nodes in the vis
*/

// Node object
// Inputs: Float x, Float y, String location, String name, Dict(diagnosis : weight) weights
class Node {
  constructor(x=null, y=null, location=null, name=null, weights=null) {
    this.x =  x;
    this.y = y;
    this.location = location;
    this.name = name;
    this.weights = weights;
    this.layer = null;
    this.overlay = null;
  }
}

// API Call
async function get_coords(api_address) {
  let response = await fetch (api_address);
  let data = await response.json();
  return data;
};

// Load Default Nodes
const load_default_nodes = async ()=> {
  return new Promise ((resolve, reject) => {
    let node_origin = new Node(51.520774, -2.727367, "No location", "111", {"all": 2000});
    nodes.push(node_origin);

    d3.csv("/dispatch-flow/resources/services_postcodes_3.csv", async function(data) {
      for (let i = 0; i < data.length; i++) {
        // Get map co-ordinates from postcode
        let api_address = ("https://api.postcodes.io/postcodes/").concat(data[i].location.replace(/\s/g, ''));
        let api_data = await get_coords(api_address);
        let x = api_data.result.latitude;
        let y = api_data.result.longitude;
        let node = new Node(x, y, data[i].location, data[i].name, {"all" : 0});
        nodes.push(node);
      };
      resolve();
    });
  });
}


/*  MODIFY Functions
// These functions control the vis filters and design
*/

// Design object
class Design {
  constructor(min_weight = 0, max_weight = -1, colours = {"nodes" : '#ff7e7e',
    "edges" : '#000000'}, node_scaling = 150, edge_scaling = 0.1) {
      this.min_weight = min_weight;
      this.max_weight = max_weight;
      this.colours = colours;
      this.node_scaling = node_scaling;
      this.edge_scaling = edge_scaling;
  }
}

// Load 111 nodes
function load_111_node(nodes, design, map) {
  // Recalculate total weight
  nodes[0].weights.all = edges.length;
  nodes[0].weights['visible'] = edges.length;

  // Create 111 design
  let c = L.rectangle([[nodes[0].x+0.02, nodes[0].y-0.03], [nodes[0].x, nodes[0].y]], {
    color: 'none',
    fillColor: '#AAAAAA',
    fillOpacity: 0
  });
  node_layer.addLayer(c);
  let d = L.imageOverlay('https://northumberlandccg.nhs.uk/wp-content/uploads/sites/7/2019/12/NHS-111-640x480px.jpg',
    [[nodes[0].x+0.02, nodes[0].y-0.035], [nodes[0].x, nodes[0].y]]) //.addTo(map);
  node_layer.addLayer(d);

  // Add extra information popup
  c.on('mouseover', function (event) {
    L.popup()
     .setLatLng(event.latlng)
     .setContent('<br></br><b>Name:</b> ' + nodes[0].name
        + '<br></br><b>Location:</b> ' + nodes[0].location
        + '<br></br><b>Referrals</b>'
        + '<br></br> total: ' + nodes[0].weights.all
        + '<br></br> visible: ' + nodes[0].weights.visible)
     .openOn(map);
  });

  nodes[0].layer = c;
  nodes[0].overlay = d;
}

// Load vis nodes
function load_vis_nodes(nodes, design, map) {
  node_layer = L.layerGroup()
  load_111_node(nodes, design, map);

  for (let i = 1; i < nodes.length; i++) {
    // Copy all weights to visible
    nodes[i].weights['visible'] = nodes[i].weights.all;

    // Draw node
    let c = L.circle([nodes[i].x, nodes[i].y], {
      color: 'none',
      fillColor: design.colours.nodes,
      fillOpacity: 0.8,
      radius: Math.sqrt(nodes[i].weights.all * design.node_scaling)
    });
    node_layer.addLayer(c);

    // Add extra information popup
    c.on('mouseover', function (event) {
      L.popup()
       .setLatLng(event.latlng)
       .setContent('<br></br><b>Name:</b> ' + nodes[i].name
          + '<br></br><b>Location:</b> ' + nodes[i].location
          + '<br></br><b>Referrals</b>'
          + '<br></br> total: ' + nodes[i].weights.all
          + '<br></br> visible: ' + nodes[i].weights.visible)
       .openOn(map);
    });

    nodes[i].layer = c;
  };

  node_layer.addTo(map);
}

// Load vis edges
function load_vis_edges(edges, design, map) {
  edge_layer = L.layerGroup();

  for (let i = 0; i < edges.length; i++) {
    // Draw edge
    let e = L.polyline([ [edges[i].start_node.x, edges[i].start_node.y], [edges[i].end_node.x, edges[i].end_node.y] ], {
      color: design.colours.edges,
      opacity: 0.8,
      weight: edges[i].weights.all * design.edge_scaling
    });
    edge_layer.addLayer(e);
    edges[i].layer = e;
  };

  edge_layer.addTo(map);
}

// Dropdown postcodes
function dropdown_postcodes_init() {
  let select = document.getElementById("hide_postcode_dropdown");
  let postcodes_found = [];
  select.options[0] = new Option("HIDE ALL");
  document.getElementById("show_postcode_dropdown").options[0] = new Option("SHOW ALL");
  document.getElementById("show_postcode_dropdown").value = "";

  for (let i = 1; i < nodes.length; i++) {
    let p = nodes[i].location.split(" ")[0];
    if (!postcodes_found.includes(p)) {
      postcodes_found.push(p);
    }
  }

  postcodes_found.sort();
  for (let i = 0; i < postcodes_found.length; i++) {
    select.options[select.options.length] = new Option(postcodes_found[i]);
  }
  select.value = "";
}

// Dropdown generic filters
function dropdown_init(dropdown_id, show_id, info_id) {
  let select = document.getElementById(dropdown_id);
  let found = [];
  select.options[0] = new Option("HIDE ALL");
  document.getElementById(show_id).options[0] = new Option("SHOW ALL");
  document.getElementById(show_id).value = "";

  for (let i = 1; i < edges.length; i++) {
    let p = edges[i].info[info_id];
    if (!found.includes(p)) {
      found.push(p);
    }
  }

  found.sort();
  for (let i = 0; i < found.length; i++) {
    select.options[select.options.length] = new Option(found[i]);
  }
  select.value = "";
}

// Load bounds for node weight filter
function node_weight_filter_init() {
  let slider = document.getElementById("node_weight_filter");
  slider.setAttribute('min', 0);

  let max_weight = 0;
  for (let i = 1; i < nodes.length; i++) {
    if (nodes[i].weights.visible > max_weight) {
      max_weight = nodes[i].weights.visible;
    }
  }

  slider.setAttribute('step', 1);
  slider.setAttribute('max', max_weight);
  slider.setAttribute('value', 0);
  return;
}

// Load bounds for node scaling
function node_scaling_init() {
  let slider = document.getElementById("node_scaling");
  slider.setAttribute('min', 100);
  slider.setAttribute('step', 5);
  slider.setAttribute('max', 300);
  slider.setAttribute('value', design.node_scaling);
  return;
}

// Load bounds for edge scaling
function edge_scaling_init() {
  let slider = document.getElementById("edge_scaling");
  slider.setAttribute('min', 0.05);
  slider.setAttribute('step', 0.02);
  slider.setAttribute('max', 0.45);
  slider.setAttribute('value', design.edge_scaling);
  return;
}

// Load timeline
function timeline_init() {
  let slider = document.getElementById("time_slider");
  slider.setAttribute('min', 0);
  slider.setAttribute('step', 1);
  slider.setAttribute('max', 743);
  slider.setAttribute('value', 0);
  return;
}

// Load Vis
async function load_vis(design, nodes, edges, map) {
  await load_vis_edges(edges, design, map);
  await load_vis_nodes(nodes, design, map);
  dropdown_postcodes_init();
  // node_weight_filter_init(); // HIDDEN FOR DEMO
  node_scaling_init();
  edge_scaling_init();
  timeline_init();
  dropdown_init("hide_service_dropdown", "show_service_dropdown", "service_type");
  dropdown_init("hide_dispo_broad_dropdown", "show_dispo_broad_dropdown", "dispo_broad");
  dropdown_init("hide_dispo_dropdown", "show_dispo_dropdown", "dispo");
  dropdown_init("hide_sd_dropdown", "show_sd_dropdown", "sd");
  dropdown_init("hide_sg_dropdown", "show_sg_dropdown", "sg");
  nodes[0].overlay.bringToFront();
  return;
}

/* MODIFY THE VIS
// Functions for modifying the visualisation
*/

// Add event listeners for modify menu
function create_triggers() {
  document.getElementById("controls_metrics").addEventListener("click", toggle_control_metrics);
  document.getElementById("show_postcode_dropdown").addEventListener("change", show_postcode);
  document.getElementById("hide_postcode_dropdown").addEventListener("change", hide_postcode);
  document.getElementById("show_service_dropdown").addEventListener("change", show_service);
  document.getElementById("hide_service_dropdown").addEventListener("change", hide_service);
  document.getElementById("show_dispo_broad_dropdown").addEventListener("change", show_dispo_broad);
  document.getElementById("hide_dispo_broad_dropdown").addEventListener("change", hide_dispo_broad);
  document.getElementById("show_dispo_dropdown").addEventListener("change", show_dispo);
  document.getElementById("hide_dispo_dropdown").addEventListener("change", hide_dispo);
  document.getElementById("show_sd_dropdown").addEventListener("change", show_sd);
  document.getElementById("hide_sd_dropdown").addEventListener("change", hide_sd);
  document.getElementById("show_sg_dropdown").addEventListener("change", show_sg);
  document.getElementById("hide_sg_dropdown").addEventListener("change", hide_sg);
  // document.getElementById("node_weight_filter").addEventListener("change", node_weight_filter);// HIDDEN FOR DEMO
  document.getElementById("node_scaling").addEventListener("change", node_scaling);
  document.getElementById("edge_scaling").addEventListener("change", edge_scaling);
  document.getElementById("node_colour").addEventListener("change", node_colour);
  document.getElementById("edge_colour").addEventListener("change", edge_colour);
  document.getElementById("all_time_checkbox").addEventListener("change", toggle_all_time_data);
  document.getElementById("all_time_checkbox").checked = true;
  document.getElementById("time_slider").addEventListener("change", time_filter);
  document.getElementById("play_checkbox").addEventListener("change", toggle_play_animation);
  document.getElementById("chart_data_dropdown").addEventListener("change", load_metrics);
}

// Add true url encoding
function true_url_encoding(param_key, param_val) {
  if (!window.location.href.includes(param_key)) {
    if (window.location.href.includes("?")) {window.history.pushState({id : "100"}, "Update" + param_val, window.location.href + param_key + "=" + param_val + "&");}
    else {window.history.pushState({id : "100"}, "Update" + param_val, window.location.href + "?" +  param_key + "=" + param_val + "&");}
  } else {
    const param_old_val = new URLSearchParams(window.location.search).get(param_key);
    const old_p = param_key + "=" + param_old_val + "\&";
    const new_p = param_key + "=" + param_val + "&";
    window.history.pushState({id : "100"}, "Update" + param_val, window.location.href.replace(old_p, new_p));
  }
  return;
}

// Remove false url encoding
function false_url_encoding(param_key) {
  window.history.pushState({id : "100"}, "Remove " + param_key, window.location.href.replace(param_key + "=true&",""));
  return;
}

// Toggle control and metrics panes
function toggle_control_metrics() {
  if (this.innerHTML == "Show metrics") {
    this.innerHTML = "Show controls";
    document.getElementById("controls_pane").style.display = "none";
    document.getElementById("metrics_pane").style.display = "block";
    load_metrics();
  } else {
    this.innerHTML = "Show metrics";
    document.getElementById("controls_pane").style.display = "block";
    document.getElementById("metrics_pane").style.display = "none";
  }
}

// Show a single postcode
function show_single_postcode(postcode, index) {
  // Show edges
  for (let i = 0; i < edges.length; i++) {
    if (postcode == edges[i].end_node.location.split(" ")[0]) {
      edges[i].filtered -= Number(1);
      if ((!map.hasLayer(edges[i].layer)) && (!edges[i].filtered)) {
        edges[i].layer.addTo(map);
        edges[i].end_node.weights.visible += Number(1);
        nodes[0].weights.visible += Number(1);
      }
    }
  }

  // Show nodes
  for (let i = 0; i < nodes.length; i++) {
    if ((nodes[i].weights.visible) && (!map.hasLayer(nodes[i].layer))) {
      nodes[i].layer.addTo(map);
    }
  }

  // Update dropdowns
  document.getElementById("show_postcode_dropdown").remove(index);
  document.getElementById("hide_postcode_dropdown").options[document.getElementById("hide_postcode_dropdown").options.length] = new Option(postcode);
  document.getElementById("hide_postcode_dropdown").value = "";
  document.getElementById("show_postcode_dropdown").value = "";
}

// Show nodes and edges from postcodes
function show_postcode() {
  // Check for show all
  if (this.value == "SHOW ALL") {
    while (this.options.length > 1) {
      show_single_postcode(this.options[1].value, 1)
    }
    return;
  }
  show_single_postcode(this.value, this.selectedIndex);
}

// Hide single postcode
function hide_single_postcode(postcode, index) {
  // Hide edges
  for (let i = 0; i < edges.length; i++) {
    if (postcode == edges[i].end_node.location.split(" ")[0]) {
      edges[i].filtered += Number(1);
      if (map.hasLayer(edges[i].layer)) {
        edges[i].layer.removeFrom(map);
        edges[i].end_node.weights.visible -= Number(1);
        nodes[0].weights.visible -= Number(1);
      }
    }
  }

  // Hide nodes
  for (let i = 0; i < nodes.length; i++) {
    if ((!nodes[i].weights.visible) && (map.hasLayer(nodes[i].layer))) {
      nodes[i].layer.removeFrom(map);
    }
  }

  // Update dropdowns
  document.getElementById("show_postcode_dropdown").options[document.getElementById("show_postcode_dropdown").options.length] = new Option(postcode);
  document.getElementById("hide_postcode_dropdown").remove(index);
  document.getElementById("show_postcode_dropdown").value = "";
  document.getElementById("hide_postcode_dropdown").value = "";
}

// Hide nodes and edges from postcodes
function hide_postcode() {
  // Check for hide all
  if (this.value == "HIDE ALL") {
    while (this.options.length > 1) {
      hide_single_postcode(this.options[1].value, 1)
    }
    return;
  }
  hide_single_postcode(this.value, this.selectedIndex);
}

// REMOVED FOR DEMO
// Handle node weight filter
function node_weight_filter() {
  const min_val = Number (this.value);
  document.getElementById("min_ref").innerHTML = "↓ " + min_val.toString() + " ↓";

  for (let i = 1; i < nodes.length; i++) {
    if (min_val > Number(nodes[i].weights.visible)) {
      if (!map.hasLayer(nodes[i].layer)) {continue;}
      nodes[i].layer.removeFrom(map);
      nodes[0].weights.visible -= Number(nodes[i].weights.visible);

      // Remove edges on node
      for (let j = 0; j < edges.length; j++) {
        if (nodes[i] == edges[j].end_node) {
          edges[j].filtered += Number(1);
          if (map.hasLayer(edges[j].layer)) {edges[j].layer.removeFrom(map);}
        }
      }

    } else if (min_val <= Number(nodes[i].weights.visible)) {
      // if (nodes[i].filtered) {continue;}
      if (map.hasLayer(nodes[i].layer)) {continue;}
      nodes[i].layer.addTo(map);
      nodes[0].weights.visible += Number(nodes[i].weights.visible);

      // Add edges on node
      for (let j = 0; j < edges.length; j++) {
        if (nodes[i] == edges[j].end_node) {
          edges[j].filtered -= Number(1);
          // if ((!edges[j].filtered) && (!map.hasLayer(edges[j].layer))) {edges[j].layer.addTo(map);}
          if (!map.hasLayer(edges[j].layer)) {edges[j].layer.addTo(map);}
        }
      }
    }
  }
  true_url_encoding("min_usage", this.value);

  // CHECKERS
  edges.forEach((e) => {
    if (e.filtered < 0) {console.log(e);}
    if (e.filtered > 2) {console.log(e);}
  });
  return;
}

// Handle node scaling
function node_scaling() {
  let adjust_scale = Number(this.value) / Number(design.node_scaling);
  for (let i = 1; i < nodes.length; i++) {
    nodes[i].layer.setRadius(nodes[i].layer.getRadius() * adjust_scale);
  }
  design.node_scaling = this.value;
  true_url_encoding("node_scaling", this.value);
  return;
}

// Handle edge scaling
function edge_scaling() {
  let adjust_scale = Number(this.value) / Number(design.edge_scaling);
  for (let i = 0; i < edges.length; i++) {
    edges[i].layer.setStyle({'weight': edges[i].layer.options.weight * adjust_scale});
  }
  design.edge_scaling = this.value;
  true_url_encoding("edge_scaling", this.value);
  return;
}

// Handle node colour picker
function node_colour() {
  if (this.value.match('[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]')) {
    for (let i = 1; i < nodes.length; i++) {
      nodes[i].layer.setStyle({'fillColor': '#' + this.value});
    }
    design.colours.nodes = this.value;
    true_url_encoding("node_colour", this.value);
  }
  return;
}

// Handle edge colour picker
function edge_colour() {
  if (this.value.match('[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]')) {
    for (let i = 0; i < edges.length; i++) {
      edges[i].layer.setStyle({'color': '#' + this.value});
    }
    design.colours.edges = this.value;
    true_url_encoding("edge_colour", this.value);
  }
  return;
}

// Play timeline
function toggle_play_animation() {
  clearInterval(animate_edges);
  document.getElementById("all_time_checkbox").checked = false;

  // Check for pause
  if (!document.getElementById("play_checkbox").checked) {
    return;
  }

  // Clear all edges
  for (let i = 0; i < edges.length; i++) {
    edges[i].layer.removeFrom(map);
  }

  // Play animation until end date flashing edges
  animate_edges = setInterval(function(){
    // Fade edges
    for (let i = 0; i < edges.length; i++) {
      if (map.hasLayer(edges[i].layer)) {
        if (edges[i].layer.options.opacity > 0.2) {
          edges[i].layer.setStyle({
            opacity: edges[i].layer.options.opacity - 0.1,
            color: '#00FFFF'
          });
        } else {
          edges[i].layer.setStyle({
            opacity: 0.8,
            color: '#000000'
          });
          edges[i].layer.removeFrom(map);
        }
      }
    }

    // Show nodes for the day
    let anim_date_string = ("0" + anim_date.getDate()).slice(-2) + "/"
      + ("0" + anim_date.getMonth()).slice(-2) + "/"
			+ anim_date.getFullYear();

    // Set date & time label
    document.getElementById("play_date").innerHTML = anim_date_string + " Hour: " + anim_hour.toString();

    // Show edges for date & time
    for (let i = 0; i < edges.length; i++) {
      if ((anim_date_string == edges[i].weights.date) && (anim_hour == parseInt(edges[i].weights.hour))) {
        edges[i].layer.addTo(map);
      }
    }

    // Set next day and hour
    anim_hour = anim_hour + 1;
    document.getElementById("time_slider").stepUp();
    if (anim_hour == 24) {
      anim_hour = 0;
      anim_date.setDate(anim_date.getDate() + 1);
    }
    if (anim_date.getMonth() == 11) {
      clearInterval(animate_edges);
    }

    load_metrics();
  }, 500);

  return;
}

// Show all time data
function toggle_all_time_data() {
  clearInterval(animate_edges);
  document.getElementById("play_checkbox").checked = false;

  // Check for state
  if (document.getElementById("all_time_checkbox").checked) {
    // Set date & time label
    document.getElementById("play_date").innerHTML = "xx/xx/xxxx Hour: xx";

    // Add all edges to map
    for (let i = 0; i < edges.length; i++) {
      if (!map.hasLayer(edges[i].layer)) {
        edges[i].layer.addTo(map);
      }
    }

  } else {
    // Show nodes for the day
    let anim_date_string = ("0" + anim_date.getDate()).slice(-2) + "/"
      + ("0" + anim_date.getMonth()).slice(-2) + "/"
			+ anim_date.getFullYear();

    // Set date & time label
    document.getElementById("play_date").innerHTML = anim_date_string + " Hour: " + anim_hour.toString();

    // Clear all edges
    for (let i = 0; i < edges.length; i++) {
      edges[i].layer.removeFrom(map);
    }

    // Show edges for date & time
    for (let i = 0; i < edges.length; i++) {
      if ((anim_date_string == edges[i].weights.date) && (anim_hour == parseInt(edges[i].weights.hour))) {
        edges[i].layer.addTo(map);
      }
    }
  }

  load_metrics();
  return;
}

// Time slider
function time_filter() {
  clearInterval(animate_edges);
  document.getElementById("all_time_checkbox").checked = false;
  document.getElementById("play_checkbox").checked = false;

  // Calculate time and hour
  anim_date = new Date(2020, 10, 1);
  anim_date.setDate(anim_date.getDate() + Math.floor(this.value/24));
  anim_hour = this.value % 24;

  // Show nodes for the day
  let anim_date_string = ("0" + anim_date.getDate()).slice(-2) + "/"
    + ("0" + anim_date.getMonth()).slice(-2) + "/"
    + anim_date.getFullYear();

  // Set date & time label
  document.getElementById("play_date").innerHTML = anim_date_string + " Hour: " + anim_hour.toString();

  // Clear all edges
  for (let i = 0; i < edges.length; i++) {
    edges[i].layer.removeFrom(map);
  }

  // Show edges for date & time. Update node visible weights for day FIX
  for (let i=0; i < nodes.lenghth; i++) {
    nodes[i].weights.visible = 0;
  }
  for (let i = 0; i < edges.length; i++) {
    if (anim_date_string == edges[i].weights.date) {
      edges[i].end_node.weights.visible = edges[i].end_node.weights.visible + 1;
      if (anim_hour == parseInt(edges[i].weights.hour)) {
        edges[i].layer.addTo(map);
      }
    }
  }

  load_metrics();
  return;
}

/* METRICS PANE
// Display useful graphs and metrics from the map to aid understanding
*/
function load_metrics() {
  const filter_conversion = {
    "Service Type": "service_type",
    "Dispo Broad Group": "dispo_broad",
    "Dispo Group": "dispo",
    "SD Description": "sd",
    "SG Description": "sg"
  }
  let filter = filter_conversion[document.getElementById("chart_data_dropdown").value];
  d3.select("#bar_chart > *").remove();
  d3.select("#line_graph > *").remove();
  create_bar_chart(filter);
  create_line_graph(filter);
  return;
}

// Bar chart
// https://observablehq.com/@d3/bar-chart
// https://bl.ocks.org/d3noob/8952219
function create_bar_chart(filter) {
  document.getElementById("bar_chart_div").style.display = "block";
  document.getElementById("bar_chart_legend_div").style.display = "none";

  // DATA FORMATTING
  let series_array = [];
  let found = [];
  for (let i = 0; i < edges.length; i++) {
    let p = edges[i].info[filter];

    if (!found.includes(p)) {
      found.push(p);
      series_array.push({
        "key": p,
        "value": 0
      });

    }

    for (let j = 0; j < found.length; j++) {
      if ((p == series_array[j].key) && (map.hasLayer(edges[i].layer))) {
        series_array[j].value += 1;
      }
    }
  }

  let margin = {top: 10, right: 10, bottom: 25, left: 25},
    width = 700 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  let svg = d3.select("#bar_chart")
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  let res = series_array.map(function(d){ return d.key });
  let color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  let x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .domain(res);

  let y = d3.scaleLinear()
    .domain([0, d3.max(series_array, function(d) { return d.value; })])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(5));

  svg.selectAll(".bar")
    .data(series_array)
    .enter().append("rect")
      .attr("class", "bar")
      .style("fill", function(d){ return color(d.key) })
      .attr("x", function(d) { return x(d.key); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

  // On hover show key instead
  show_key("bar_chart", res, color);
  return;
}

// Line graph
// https://observablehq.com/@d3/multi-line-chart
// https://www.d3-graph-gallery.com/graph/line_several_group.html
function create_line_graph(filter) {
  document.getElementById("line_graph_div").style.display = "block";
  document.getElementById("line_graph_legend_div").style.display = "none";

  // DATA FORMATTING
  let series_array = [];
  let found = [];
  for (let i = 0; i < edges.length; i++) {
    let p = edges[i].info[filter];

    if (!found.includes(p)) {
      found.push(p);
      let value_array = [];
      for (let i = 1; i < 32; i++) {
        value_array.push({
          "day": i,
          "n" : 0
        });
      }

      series_array.push({
        "key": p,
        "values": value_array
      });
    }

    for (let j = 0; j < found.length; j++) {
      if (p == series_array[j].key) {
          let pos = Number(edges[i].weights.date.slice(0, 2)) - 1;
          series_array[j].values[pos].n += 1;
      }
    }
  }

  // Find max value
  let max_n = 0;
  for (let i = 0; i < series_array.length; i++) {
    for (let j = 0; j < series_array[i].values.length; j++) {
      if (max_n < series_array[i].values[j].n) {max_n = series_array[i].values[j].n;}
    }
  }

  // set the dimensions and margins of the graph
  let margin = {top: 10, right: 10, bottom: 25, left: 25},
    width = 700 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = d3.select("#line_graph")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis --> it is a date format
  let x = d3.scaleLinear()
    .domain([1, 32]) // d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  let y = d3.scaleLinear()
    .domain([0, max_n]) //d3.max(data, function(d) { return +d.n; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette
  let res = series_array.map(function(d){ return d.key }); // list of group names
  let color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Draw the line
  svg.selectAll(".line")
      .data(series_array)
      .enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.day); })
            .y(function(d) { return y(+d.n); })
            (d.values)
        })

  // Define the div for the tooltip
  let div = svg.append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // On hover show key instead
  show_key("line_graph", res, color);
  return;
}

// Show key
// https://www.d3-graph-gallery.com/graph/custom_legend.html
function show_key(svg_id, res, color) {
  // Add event listeners
  document.getElementById(svg_id + "_div").onclick = function() {
    document.getElementById(svg_id + "_div").style.display = "none";
    document.getElementById(svg_id + "_legend_div").style.display = "block";

    // select the svg area
    document.getElementById(svg_id + "_legend").innerHTML = "";
    let svg = d3.select("#" + svg_id + "_legend");

    // Add one dot in the legend for each name.
    svg.selectAll("mydots")
      .data(res)
      .enter()
      .append("circle")
        .attr("cx", 10)
        .attr("cy", function(d,i){ return 10 + i*10}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 2)
        .style("fill", function(d){ return color(d)})

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
      .data(res)
      .enter()
      .append("text")
        .attr("x", 12)
        .attr("y", function(d,i){ return 10 + i*10}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("font-size", "8px")
  }
  document.getElementById(svg_id + "_legend_div").onclick = function() {
    document.getElementById(svg_id + "_div").style.display = "block";
    document.getElementById(svg_id + "_legend_div").style.display = "none";
  }
  return;
}

/* DATA FILTERS
// N: Service Type e.g. Urgent Care, GP, IUC
// L: Dispo Broad Group e.g. Primary Care Routine, ED
// K: Dispo Group e.g. 6+ hours, 2hrs
// H: SD Description e.g. PC full...
// I: SG Description e.g. Knee or lower leg pain...
*/

// Show nodes and edges for filter
function show_filter(show, hide, filter) {
  // Check for show all
  if (show.value == "SHOW ALL") {
    while (show.options.length >  1) {
      show.value = show.options[1].value;
      show_filter(show, hide, filter);
    }
    return;
  }


  // Show edges
  for (let i = 0; i < edges.length; i++) {
    if (show.value == edges[i].info[filter]) {
      edges[i].filtered -= Number(1);
      if ((!map.hasLayer(edges[i].layer)) && (!edges[i].filtered)) {
        edges[i].layer.addTo(map);
        edges[i].end_node.weights.visible += Number(1);
        nodes[0].weights.visible += Number(1);
      }
    }
  }

  // Show nodes
  for (let i = 0; i < nodes.length; i++) {
    if ((nodes[i].weights.visible) && (!map.hasLayer(nodes[i].layer))) {
      nodes[i].layer.addTo(map);
    }
  }

  // Update dropdowns
  hide.options[hide.options.length] = new Option(show.value);
  show.remove(show.selectedIndex);
  hide.value = "";
  show.value = "";
}


// Hide nodes and edges for filter
function hide_filter(show, hide, filter) {
  // Check for show all
  if (hide.value == "HIDE ALL") {
    while (hide.options.length >  1) {
      hide.value = hide.options[1].value;
      hide_filter(show, hide, filter);
    }
    return;
  }

  // Hide edges
  for (let i = 0; i < edges.length; i++) {
    if (hide.value == edges[i].info[filter]) {
      edges[i].filtered += Number(1);
      if (map.hasLayer(edges[i].layer)) {
        edges[i].layer.removeFrom(map);
        edges[i].end_node.weights.visible -= Number(1);
        nodes[0].weights.visible -= Number(1);
      }
    }
  }

  // Hide nodes
  for (let i = 0; i < nodes.length; i++) {
    if ((!nodes[i].weights.visible) && (map.hasLayer(nodes[i].layer))) {
      nodes[i].layer.removeFrom(map);
    }
  }

  // Update dropdowns
  show.options[show.options.length] = new Option(hide.value);
  hide.remove(hide.selectedIndex);
  show.value = "";
  hide.value = "";

}


// Show nodes and edges from service type
function show_service() {
  show_filter(this, document.getElementById("hide_service_dropdown"), "service_type");
  return;
}

// Hides nodes and edges from service type
function hide_service() {
  hide_filter(document.getElementById("show_service_dropdown"), this, "service_type");
  return;
}

// Show nodes and edges from dispo broad group
function show_dispo_broad() {
  show_filter(this, document.getElementById("hide_dispo_broad_dropdown"), "dispo_broad");
  return;
}

// Hides nodes and edges from dispo broad group
function hide_dispo_broad() {
  hide_filter(document.getElementById("show_dispo_broad_dropdown"), this, "dispo_broad");
  return;
}

// Show nodes and edges from dispo group
function show_dispo() {
  show_filter(this, document.getElementById("hide_dispo_dropdown"), "dispo");
  return;
}

// Hides nodes and edges from dispo group
function hide_dispo() {
  hide_filter(document.getElementById("show_dispo_dropdown"), this, "dispo");
  return;
}

// Show nodes and edges from SD
function show_sd() {
  show_filter(this, document.getElementById("hide_sd_dropdown"), "sd");
  return;
}

// Hides nodes and edges from SD
function hide_sd() {
  hide_filter(document.getElementById("show_sd_dropdown"), this, "sd");
  return;
}

// Show nodes and edges from SG
function show_sg() {
  show_filter(this, document.getElementById("hide_sg_dropdown"), "sg");
  return;
}

// Hides nodes and edges from SG
function hide_sg() {
  hide_filter(document.getElementById("show_sg_dropdown"), this, "sg");
  return;
}
