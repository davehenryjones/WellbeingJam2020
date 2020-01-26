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

# TODO
def generate_referal_data(all_services):

    res = urllib.request.urlopen("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=SE1%208XX&destinations=B2%205NY").read()
    data = json.loads(res.decode())
    print(data)
    #print(data["rows"][0]["elements"][0]["distance"])
    return None

# TODO skeleton
if __name__ == "__main__":
    all_services = format_data()
    referals = generate_referal_data(all_services)
    print(referals)
