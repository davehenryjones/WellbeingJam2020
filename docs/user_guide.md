# User Guide

### How to use the application

On the visualisation map, each circle represents a location loaded from the data source. The yellow circle represents usage for that service, and the blue outer circle represents the capacity for that service.

To view more detailed data about a service, simply hover your mouse over it on the map.

On the control pane, there is a slider which allows you to view histroical data.

By default the page loads with dummy data that we have created. To use your own data, click the 'upload file' button and choose at least one file to upload. You may select several files if you want to view histroic data. Please see below for more information about uploading files.

> NOTE: When you select a file to use it remains on your device. All processing of data is done on your device. We do not collect or store any data uploaded to the visualisation.

> NOTE Due to a technical issue, you can currently only upload one file. We are working to fix this so that multiple files can be uploaded and displayed along the timeline.

### File Upload Requirements

Files must be uploaded in the '.csv' format. The first row must be the column headings. The column headings must include:

- `location` : this is a postcode for the service
- `name` : this is the name of the service
- `appointments` : this is the usage data for the service
- `capacity` : this is the capacity for the service

You can have extra columns if you would like. These will be displayed as metadata when you hover over the service on the visualisation map.

The name of the file must be of the form `yyyymmdd.csv` where this is the date for the data. We use the file names to decipher the date of the data in order to place it on the timeline in the correct order.
