// Load data from csv to create nodes
export function load_vis_nodes(svg, services_nodes) {

  for (let i = 0; i < services_nodes.location.length; i++) {
    // Check data is present
    if (typeof services_nodes.x[i] == 'undefined') {continue;};
    if (typeof services_nodes.y[i] == 'undefined') {continue;};
    if (typeof services_nodes.appointments[i] == 'undefined') {continue;};
    if (typeof services_nodes.capacity[i] == 'undefined') {continue;};

    // Draw capacity
    var circle_capacity = L.circle([services_nodes.x[i], services_nodes.y[i]], {
        color: 'black',
        weight: '0.5',
        fillColor: '#1E88E5',
        fillOpacity: 0.7,
        radius: services_nodes.capacity[i] / 20
    }).addTo(svg);

    // Draw node
    var circle_usage = L.circle([services_nodes.x[i], services_nodes.y[i]], {
        color: 'black',
        weight: '0.5',
        fillColor: '#FFC107',
        fillOpacity: 0.7,
        radius: services_nodes.appointments[i] / 20
    }).addTo(svg);


    // Create string from metadata
    var metadata_string = '<div id="metadata" style="display:block">+ Location: ' + services_nodes.location[i];
    for (let j = 0; j < services_nodes.metadata[i].length; j++) {
      metadata_string = metadata_string + "<br></br>   + "
        + services_nodes.metadata[i][j][0] + ": "
        + services_nodes.metadata[i][j][1];
    };
    metadata_string = metadata_string + "</div>";

    // Add extra information popup
    circle_usage.on('mouseover', function (event) {
      var info_popup = L.popup()
       .setLatLng(event.latlng)
       .setContent('<br></br><b>Name:</b> ' + services_nodes.name[i]
          + '<br></br><b>Appointments:</b> ' + services_nodes.appointments[i]
          + '<br></br><b>Capacity:</b> ' + services_nodes.capacity[i]
          + '<br></br><br></br><div id="meta_click"><b>Extra Information:</b></div>' + metadata_string)
       .openOn(svg);

       // document.getElementById("meta_click").addEventListener('click', toggle_meta);
    });

  };

  return;
};

function toggle_meta() {
  var list = document.getElementById("metadata");
  var head = document.getElementById("meta_click");
  console.log(list.style.display);
  if (list.style.display == "none"){
      list.style.display = "block";
      head.innerHTML = "<b>see less...</b>";
  } else {
      list.style.display = "none";
      head.innerHTML = "<b>see more...</b>";
  }
}
