#!/usr/bin/env python
# Name: Jesse Groot
# Student number: 11012579

"""
This Programm retreives all futher used information including:
    1) CO2 per Capita
    2) Wood Resorces used per Capita
    3) Food Production per Capita
    4) Waste per Capita
    5) Population
It will be stored in
Countries --> data per country (JSON style)
"""

import json
import csv

# get the files for the data
INPUT_CSV_CO2 =        "./Data/CO2_capita.csv"
INPUT_CSV_Forest =     "./Data/Deforestation.csv"
INPUT_CSV_Food =       "./Data/Food_production.csv"
INPUT_CSV_Waste =      "./Data/Waste_Capita.csv"
INPUT_CSV_Pop =        "./Data/Pop_country3.csv"
INPUT_CSV_Code =       "./Data/code.csv"

def getJSON():

    # variable for countries in europe
    countries = []

    # open csv file for landcodes and land names
    with open(INPUT_CSV_Code) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        # for each line in file
        for line in reader:
            # skip first row
            if round == 1:
                round = 2
            else:
                # select only european countries
                if(line[5] == "Europe"):
                    # append land code (2 and 3 long) and land name
                    countries.append([line[0],line[1],line[2]])

    # make json object
    json = {}

    # open csv file for CO2 emmision per capita
    with open(INPUT_CSV_CO2) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        # for each line in file
        for line in reader:
            # skip first row
            if round == 1:
                round = 2
            else:
                # split the different values of the line
                line = line[0].split(",")
                # all european countries have a length of 3
                if (len(str(line[0])) == 3):
                    for country in countries:
                        # check if line[0] in the european countries
                        if (line[0] in country):
                            # append to JSON of not already exist
                            if (country[0] not in json):
                                json[country[0]] = {}
                            # append to value to JSON without "
                            line[5] = line[5].replace('"', "")
                            json[country[0]]["CO2_capita"] = float(line[6])

    # open csv file for Population in millions
    with open(INPUT_CSV_Pop) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        # for each line in file
        for line in reader:
            # skip first row
            if round == 1:
                round = 2
            else:
                for country in countries:
                    # check if land in the european countries
                    if (line[0] in country):
                        # add value to JSON
                        if (str(country[0]) in json):
                            json[country[0]]["Pop"] = float(line[4])
                        else:
                            json[country[0]] = {}
                            json[country[0]]["Pop"] = float(line[4])

    # open csv file for GDP
    with open(INPUT_CSV_Food) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        land = "XXX"
        # for each line in file
        for line in reader:
            # skip first row
            if round == 1:
                round = 2
            else:
                # remove " symbols in line
                line[0] = line[0].replace('"', "")
                # split the different values of the line
                line = line[0].split(",")
                # if new country
                if land != str(line[3]):
                    # check if land in the european countries
                    for country in countries:
                        if (line[3] in country):
                            # no else because if there is population known we dont need the data
                            if (country[0] in json):
                                # add value to JSON
                                if (line[10] == "1000 Head"):
                                    json[country[0]]["Animals_capita"] = float(line[11]) * 1000 / (json[country[0]]["Pop"]*1000000)
                                else:
                                    json[country[0]]["Animals_capita"] = float(line[11]) / (json[country[0]]["Pop"]*1000000)
                                # select current country
                                land = country[0]
                # add animals to already given value
                else:
                    if (line[10] == "1000 Head"):
                        json[land]["Animals_capita"] += float(line[11]) * 1000 / (json[land]["Pop"]*1000000)
                    else:
                        json[land]["Animals_capita"] += float(line[11]) / (json[land]["Pop"]*1000000)

    # open csv file for Forest use ratio
    with open(INPUT_CSV_Forest) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        # for each line in file
        for line in reader:
            # skip first row
            if round == 1:
                round = 2
            else:
                # split the different values of the line
                line = line[0].split(",")
                for country in countries:
                    # check if line[0] in the european countries
                    if (line[0] in country):
                        # add values to JSON
                        if (str(country[0]) not in json):
                            json[country[0]] = {}
                            json[country[0]]["Forest_ratio"] = float(line[6])
                        else:
                            json[country[0]]["Forest_ratio"] = float(line[6])

    # open csv file for Waste per capita
    with open(INPUT_CSV_Waste) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        # for each line in file
        for line in reader:
            # skip first row
            if round == 1:
                round = 2
            else:
                # split the different values of the line
                line = line[0].split(",")
                # check if line[0] in the european countries
                for country in countries:
                    if (line[0] in country):
                        # add value to JSON
                        if (str(country[0]) in json):
                            json[country[0]]["Waste_capita"] = float(line[6])

    return json

def addCalculations(json):

    # list for he values of every catogorie
    list_waste      = []
    list_animal    = []
    list_co2        = []
    list_forest     = []

    # the different catagories
    categories = ["Waste_capita","Animals_capita","CO2_capita","Forest_ratio"]

    # for countries in json
    for lands in json:
        # for categorie in categories
        for cat in categories:
            # if catogorie of the country in JSON add the value to the correct list
            if (cat in json[lands]):
                if (cat == "Waste_capita"):
                    list_waste.append(json[lands][cat])
                if (cat == "Animals_capita"):
                    list_animal.append(json[lands][cat])
                if (cat == "CO2_capita"):
                    list_co2.append(json[lands][cat])
                if (cat == "Forest_ratio"):
                    list_forest.append(json[lands][cat])
            # else append N/A to JSON
            else:
                json[lands][cat] = "N/A"

    # sort the lists
    list_waste.sort()
    list_animal.sort()
    list_co2.sort()
    list_forest.sort()

    # collect the sorted lists
    lists = [[list_waste, categories[0]], [list_animal, categories[1]], [list_co2, categories[2]], [list_forest, categories[3]]]

    # itterate over the lists and select minimum maximum and difference between both
    for list in lists:
        min = float(list[0][0])
        max = float(list[0][len(list[0])-1])
        net_max = float(max - min)
        for land in json:
            # add values to countries in JSON
            if json[land][list[1]] != "N/A":
                value = json[land][list[1]]
                # translate the value to a range between 1 to 1000
                scale = 1000 / net_max * (value - min)
                json[land][list[1]] = {}
                # used for barchard
                json[land][list[1]]["value"] = value
                # used for land map
                json[land][list[1]]["scale"] = scale
                # used for radar chard
                json[land][list[1]]["absolute"] = value/max*1000
            # add N/A to countries in JSON
            else:
                json[land][list[1]] = {}
                json[land][list[1]]["value"] = "N/A"
                json[land][list[1]]["scale"] = "N/A"
                json[land][list[1]]["absolute"] = "N/A"
            # at max to JSON -> country
            json[land][list[1]]["max"] = max

    return json

if __name__ == "__main__":

    # get json
    jsonStruct = getJSON()

    # change JSON for graphs
    completeJson = addCalculations(jsonStruct)

    # write json
    with open('data.json', 'w') as outfile:
        json.dump(completeJson, outfile)
