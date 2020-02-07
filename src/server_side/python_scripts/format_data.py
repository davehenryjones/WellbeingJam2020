#!/usr/bin/env python

""" format_data
        - Converts the data from input files to internal format
"""

__version__ = '1.0'
__author__ = 'B Wainwright & D Jones'

import csv
import json

# Add data from bristol_gps
def add_gp_data(all_services):
    with open('../docs/data_sources/bristol_gps.csv', 'r') as csvfile:
        gp_reader = csv.reader(csvfile, delimiter = ',', quotechar = '"')

        for gp in gp_reader:
            all_services[gp[6]] = { "name": gp[2],
                                    "appointments": gp[11],
                                    "diagnoses" : dict()
                                  }

        #remove heading line
        del all_services["POSTCODE"]

    return all_services

# Add data from bristol_hospitals
def add_hospital_data(all_services):
    with open('../docs/data_sources/bristol_hospitals.csv', 'r') as csvfile:
        hospital_reader = csv.reader(csvfile, delimiter = ',', quotechar = '"')

        for hospital in hospital_reader:
            all_services[hospital[2]] = { "name": hospital[1],
                                          "appointments": hospital[4],
                                          "diagnoses" : dict()
                                        }

        #remove heading line
        del all_services["Postcode"]

    return all_services

# Add diagnoses data
def add_diagnosis(all_services):
    with open('../docs/data_sources/gp_referral_data.csv', 'r') as csvfile:
        diagnosis_reader = csv.reader(csvfile, delimiter = ',', quotechar = '"')

        postcode_list = next(diagnosis_reader)

        for postcode in diagnosis_reader:
            for i in range(1,len(postcode)-1):
                if postcode[i] != '0':
                    all_services[postcode_list[i]]["diagnoses"][postcode[0]] = postcode[i]

    return all_services

# Create graph nodes from service data
def format_data():
    all_services = dict()
    all_services = add_gp_data(all_services)
    all_services = add_hospital_data(all_services)
    all_services = add_diagnosis(all_services)

    # Write to .json
    with open('services_list.json', 'w') as fp:
        json.dump(all_services, fp)

    return all_services

# Test module by running 'python format_data.py'
if __name__ == "__main__":
    a = format_data()
    print(a)
