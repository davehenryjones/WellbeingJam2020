# Development Guide

### Dependencies & Setting Up

#### Apache2 Server

The Apache2 Server is used to allow the reading of .csv & .json files into d3.js. Therefore it must be downloaded to run the application on a local machine.

**Ubuntu Instructions (Mac coming soon!)**

- Download Apache2 with `sudo apt update && apt install apache2`
- Test that this has worked by typing `localhost` into your web browser

**Windows Instructions**

- Download Apache2 from [Apache Lounge](https://www.apachelounge.com/download/).
    - Select: Apache x.x.xx Win64 link
- After downloaded, unzip the file httpd-x.x.xx-Win64-VC15.zip into C:/

>_To Run in Command_
>- Run CMD as administrator
>- cd \Apache24\bin
>- httpd.exe

>_To Add as Service_
>- Run CMD as administrator
>- cd \Apache24\bin
>- httpd.exe -k install
>- Start > "Services" > Run Apache2

To test server running go to web browser and type `localhost`, should display "It Works".


#### Running the application

- To run the website move the copy all the source code from `src/public/` into `/var/www/html`. You will need root privelages to do this.
- Got to `localhost` in your web browser to see the website.

### Programming Guide

#### Current Site Structure

- src/public  
  - css/  
    - index.css  
  - js/  
      - index.js  
      - vis_edges.js  
      - vis_nodes.js  
  - resources/  
      - postcode_ne.csv  
      - referrals_list_combined.csv  
      - services_dummy_capacity.csv  
      - services_list.csv  
  - index.html

#### Releases & Versioning Semantics

vX.Y.Z such as v0.1.0 as the intial release. Based on the [ASDF Standard](https://asdf-standard.readthedocs.io/en/stable/versioning.html).

> - X : Major Release i.e. major change that reduces or removes backwards compatability e.g. a new data schema
> - Y : Minor Release i.e. new functionality added, major bug fixes
> - Z : Patch i.e. small change to documentation or codebase, minor bug fixes

Accompanying documentation for each release will follow [this guide](https://rollout.io/blog/best-practices-when-versioning-a-release/) from the Rollout Blog.
