#!/usr/bin/env python

""" service_flow
        - main module for service flow
        - calls other modules to format data, generate missing data and produce
            the visualisation
"""

__version__ = '0.1'
__author__ = 'B Wainwright & D Jones'

# TODO Imports
from format_data import *
from generate_referal_data import *
from generate_visualisation import *

# TODO
def generate_visualisation():
    all_services = format_data.format_data()
    c,d = generate_referal_data.generate_referal_data(all_services)
    e,f = generate_visualisation.generate_visualisation(all_services c, d)
    return

# TODO
def update_visualisation():
    return

# TODO skeleton
if __name__ == "__main__":
    generate_visualisation()
