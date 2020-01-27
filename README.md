# WellbeingJam2020

A visualisation to map the flow of patients between different health services in Bristol

### What does it do?

This software takes in data files about GPs and hospitals in Bristol, then outputs a visualisation of the flow of referals between the services.

> Note: Currently, only the data is formatted correctly. See schema below.

### Data Schema

Our 'format_data.py' & 'generate_referal_data.py' files convert '.csv' data to our internal format for the visualisation. Therefore, a developer can simply edit these files to attain the correct data structure as outlined below.

all_services :: {POSTCODE: {
                  "name": NAME,
                  "appointments": TOTAL_APPOINTMENTS,
                  "diagnoses": {
                    DIAGNOSIS: NUM_DIAGNOSED
                    }
                  }
                }

referrals_list :: [[SOURCE, DEST, DIAGNOSIS, NUM_REFERRALS]]
