# WellbeingJam2020

A visualisation to map the flow of patients between different health services in Bristol

#### Latest Release

  - Displays local services in correct position on map
  - Size of circle is proportional to the number of patients who used the service
  - Lines between services indicate referrals between services
  - Thickness of the lines is proportional to the number of referrals

> ![Zoomed Out Map](docs/map_1.png)
> Zoomed out map with data plotted

<br>

> ![Zoomed In Map](docs/map_2.png)
> Zoomed in map with data plotted


### Usage

#### Apache2 Server

The Apache2 Server is used to allow the reading of .csv & .json files into d3.js. Therefore it must be downloaded to run the application on a local machine.

> Ubuntu Instructions (Mac & Windows coming soon!)

- Download Apache2 with `sudo apt update && apt install apache2`
- Test that this has worked by typing `localhost` into your web browser

#### Development

- To run the website move the copy all the source code from `src/public/` into `/var/www/html`. You will need root privelages to do this.
- Got to `localhost` in your web browser to see the website.
