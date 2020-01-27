#!/usr/bin/env python

""" service_flow
        - main module for service flow
        - calls other modules to format data, generate missing data and produce
            the visualisation
"""

__version__ = '1.0'
__author__ = 'B Wainwright & D Jones'

from format_data import *
from generate_referal_data import *
from generate_visualisation import *

# Formats data from prespecified files, generates visualisation of the data
def create_vis():
    all_services = format_data()
    all_services, referals_list = generate_referal_data(all_services)
    generate_visualisation(all_services, referals_list)
    return all_services, referals_list

# Test module by running 'service_flow.py'
if __name__ == "__main__":
    a, b = create_vis()

    print("\n\n---ALL SERVICES (NODES)---")
    print(a)

    print("\n\n---REFERRALS (EDGES)---")
    print(b)
