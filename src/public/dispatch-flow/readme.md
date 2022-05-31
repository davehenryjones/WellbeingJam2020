# 111 Data Demo

## Overview
Adaption the PAVE visualisation to use the 111 referral data provided. Provided datasets were two excel files:
1. a list of health services and postcodes (services dataset);
1. a list of referrals from 111 to different health services with rich metadata (referrals dataset).     

## Data Exploration
In the services dataset there are 11,975 services, 11,963 unique services, when filtered by service name, and 2,968 unique postcodes. Therefore many services share the same postcode and site.

In the referrals dataset there are 12,794 referrals and 352 unique services where patients were referred to. Of these 352 referred to services, 325 were found in the services data, based on a search by service name. Upon further inspection, it was discovered that the missing 27 services were as a result of inconsistent naming conventions e.g. in the referrals dataset, the service name `'UCC - South Bristol Community Hospital - Bristol'` is used. Whereas the services dataset uses the name `'UCC - South Bristol Community Hospital - Bristol (read referral information),BS14 0DB'`. A full list of missing services is below.

This means that some pre-processing needs to be done to the data to try and resolve the inconsistent service names.

### Data Wrangling

Several steps were taken (below) to pre-process and clean the datasets so that they were ready to be inputted into the visualisation.

A limitation of the visualisation is that it was assumed that all services have a unique postcode. Therefore, data cleaning was undertaken to ensure each postcode was unique to a single service by removing duplicates. This limitation simplified the code for the purposes of the demos, but will need to be accounted for in the future.

**Services Dataset Wrangling**
- Removed extra, empty columns.
- Exported from Excel file to CSV with quotation marks around fields.
- Removed "Not available" postcodes.
- Renamed 7 services to match referral data.
- Removed services not found in the referral data.
- Removed services with duplicated postcodes.

**Referral Dataset Wrangling**
- Removed extra, not needed columns.
- Filled in blank cells with 'No data available' for consistency.

After this data wrangling process there were **209 services** and **10,142 referrals** inputted into the visualisation.

## Deliverables & Demos

### Demo 1 (30th March 2021)
Key Features:
- Displays services and referrals on a map of Bristol.
- Data filters limited to postcodes and setting a minimum number of referrals.
- Design controls on services node and referral edge scaling.
- Play button which runs through the visualisation, hour by hour, showing referrals for that hour.
- URL encoding for exporting state of the filters in the visualisation.

### Demo 2 (14th July 2021*)
Key Features:
- Displays services and referrals on a map of Bristol.
- Data filters updated to reflect use case and provide more granularity.
- Timeline controls improved to allow play/ pause functionality and user scrolling across time periods.
- Metrics pane added to provide graphical view of the data.
- Limited URL encoding for exporting the state of the design controls for the visualisation.
