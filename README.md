# WellbeingJam2020

A visualisation to map the flow of patients between different health services in Bristol

### What does it do?

This software takes in data files about GPs and hospitals in Bristol, then outputs a visualisation of the flow of referals between the services.

> Note: Currently, only the data is formatted correctly. See schema below.

### Data Flow

- File upload to DB (python or .js)
- DB stores: service data (nodes), referral data (edges) & extra data on services (node details)
- Data injected from DB inot d3.js to create vis

> Note: The following is an outdated storage method

all_services :: {POSTCODE: {
                  "name": NAME,
                  "appointments": TOTAL_APPOINTMENTS,
                  "diagnoses": {
                    DIAGNOSIS: NUM_DIAGNOSED
                    }
                  }
                }

referrals_list :: [[SOURCE, DEST, DIAGNOSIS, NUM_REFERRALS]]
