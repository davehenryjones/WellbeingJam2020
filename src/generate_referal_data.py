#!/usr/bin/env python

""" generate_referal_data
        - creates the referal data between services from diagnosis data
"""

__version__ = '0.1'
__author__ = 'B Wainwright & D Jones'

# TODO Imports
from format_data import *
import urllib.request
import json
import re

# Get the API Key
def get_api_key():
    file1 = open("api_key.txt","r")
    api_key = file1.readline()
    file1.close()
    return api_key

# TODO
def generate_referal_data(all_services):
    api_key = get_api_key()

    for postcode in all_services:
        source = re.sub(" ", "%20", postcode)
        print(source)
        input()
        #source = "BS20%206AQ" #Formatted postcode

        # Find nearest hospital
        res = urllib.request.urlopen("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + source + "&destinations=BS1%203NU|BS10%205NB&key=" + api_key).read()
        data = json.loads(res.decode())
        d1 = data["rows"][0]["elements"][0]["distance"]["value"] #BS1 3NU
        d2 = data["rows"][0]["elements"][1]["distance"]["value"] #BS10 5NB

    print(d1)
    print(d2)
    return None

# TODO skeleton
if __name__ == "__main__":
    all_services = format_data()
    referals = generate_referal_data(all_services)
    print(referals)
