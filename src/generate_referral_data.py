#!/usr/bin/env python

""" generate_referral_data
        - Creates the referral data between services from diagnosis data
"""

__version__ = '1.0'
__author__ = 'B Wainwright & D Jones'

from format_data import *
import urllib.request
import json
import re

# Get the API Key from the file
def get_api_key():
    file1 = open("api_key.txt","r")
    api_key = file1.readline()
    file1.close()
    return api_key

# Generate referrals list from GPs to hospital
def generate_referral_data(all_services):
    referrals_list = list()
    api_key = get_api_key()

    for postcode in all_services:
        source = re.sub(" ", "%20", postcode) # Formatted postcode

        # TODO generalise
        # Find nearest hospital to each GP
        res = urllib.request.urlopen("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + source + "&destinations=BS1%203NU|BS10%205NB&key=" + api_key).read()
        data = json.loads(res.decode())
        d1 = data["rows"][0]["elements"][0]["distance"]["value"] # BS1 3NU (BRI)
        d2 = data["rows"][0]["elements"][1]["distance"]["value"] # BS10 5NB (Southmead)

        if d1 > d2:
            dest = "BS1 3NU"
        else:
            dest = "BS10 5NB"

        # Add referral data if not 0
        for diagnosis in all_services[postcode]["diagnoses"]:
            if str(all_services[postcode]["diagnoses"][diagnosis]) != "0":
                referrals_list.append([postcode, dest, diagnosis, all_services[postcode]["diagnoses"][diagnosis]])

    return all_services, referrals_list

# Test module by running 'python generate_referral_data.py'
if __name__ == "__main__":
    all_services = format_data()
    all_services, referrals_list = generate_referral_data(all_services)
    print(referrals_list)

    # Write to csv
    with open('referrals_list.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerows(referrals_list)
