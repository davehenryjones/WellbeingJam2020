// Load data from csvs to variable
export function load_data_from_default(grid_ref) {
  var services_location = [];
  var services_x = [];
  var services_y = [];
  var services_name = [];
  var services_appointments = [];
  var services_capacity = [];
  var services_metadata = [];

  d3.csv("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/services_list.csv", function(data) {

    // Get column headers
    var extra_columns = Object.keys(data[0]);

    // Remove colleted columns
    extra_columns.splice(extra_columns.indexOf("location",),1);
    extra_columns.splice(extra_columns.indexOf("name",),1);
    extra_columns.splice(extra_columns.indexOf("appointments",),1);

    // Save data
    for (let i = 0; i < data.length; i++) {
      services_location.push(data[i].location);
      services_x.push(grid_ref[data[i].location][0]);
      services_y.push(grid_ref[data[i].location][1]);
      services_name.push(data[i].name);
      services_appointments.push(data[i].appointments);

      // metadata saving
      var extra_data = [];
      for (let j = 0; j < extra_columns.length; j++) {
        extra_data.push([extra_columns[j], data[i][extra_columns[j]]]);
      };
      services_metadata.push(extra_data);
    };
  });

  d3.csv("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/services_dummy_capacity.csv", function(data) {
    for (let i = 0; i < data.length; i++) {
      services_capacity.push(data[i].dummy_capacity);
    };
  });

  return { "location": services_location,
           "x": services_x,
           "y": services_y,
           "name": services_name,
           "appointments": services_appointments,
           "capacity": services_capacity,
           "metadata": services_metadata
         };
};
