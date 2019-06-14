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

# https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.csv

# import os, sys
# directory = os.path.dirname(os.path.realpath(__file__))
# sys.path.append(os.path.join(directory, "Data"))

import json
import csv

INPUT_CSV_CO2 =        "./Data/CO2_capita.csv"            # Done
INPUT_CSV_Forest =     "./Data/Deforestation.csv"         # Done
INPUT_CSV_Food =       "./Data/Food_production.csv"       # Done
INPUT_CSV_Waste =      "./Data/Waste_Capita.csv"          #
INPUT_CSV_Pop =        "./Data/Pop_country3.csv"          # Done
INPUT_CSV_Code =       "./Data/code.csv"                  # Done
# INPUT_CSV_CountryCodes =   "./Data/GDP_Of_Countriescsv"

def getJSON():

    countries = []

    # open csv file for Greenhouse Gass Emission
    with open(INPUT_CSV_Code) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        for line in reader:
            if round == 1:
                round = 2
            else:
                if(line[5] == "Europe"):
                    countries.append([line[0],line[1],line[2]])

    # make json object
    json = {}

    # open csv file for CO2 emmision per capita
    with open(INPUT_CSV_CO2) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        for line in reader:
            if round == 1:
                round = 2
            else:
                line = line[0].split(",")
                if (len(str(line[0])) == 3):
                    for country in countries:
                        if (line[0] in country):
                            if (country[0] not in json):
                                json[country[0]] = {}
                            line[5] = line[5].replace('"', "")
                            json[country[0]]["CO2_capita"] = float(line[6])

    # open csv file for Population in millions
    with open(INPUT_CSV_Pop) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        for line in reader:
            if round == 1:
                round = 2
            else:
                for country in countries:
                    if (line[0] in country):
                        if (str(country[0]) in json):
                            json[country[0]]["Pop"] = line[4]
                        else:
                            json[country[0]] = {}
                            json[country[0]]["Pop"] = line[4]


    # open csv file for Forest use ratio
    with open(INPUT_CSV_Forest) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        for line in reader:
            if round == 1:
                round = 2
            else:
                line = line[0].split(",")
                for country in countries:
                    if (line[0] in country):
                        if (str(country[0]) not in json):
                            json[country[0]] = {}
                            json[country[0]]["Forest_ratio"] = float(line[6])
                        else:
                            json[country[0]]["Forest_ratio"] = float(line[6])

    # open csv file for GDP
    with open(INPUT_CSV_Food) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        land = "XXX"
        valid = 0
        for line in reader:
            if round == 1:
                round = 2
            else:
                line[0] = line[0].replace('"', "")
                line = line[0].split(",")
                if land != "N/A":
                    if land != str(line[3]):
                        food_count = 0
                        for country in countries:
                            if (line[3] in country):
                                if (land != country[0]):
                                    if (country[0] in json):
                                        if (line[10] == "1000 Head"):
                                            json[country[0]]["Animals_capita"] = float(line[11]) * 1000
                                        else:
                                            json[country[0]]["Animals_capita"] = float(line[11])
                                        if (valid == 1):
                                            json[land]["Animals_capita"] = json[land]["Animals_capita"]/json[land]["Pop"]
                                        land = country[0]
                                        valid == 1
                                else:
                                    if (line[10] == "1000 Head"):
                                        json[country[0]]["Animals_capita"] += float(line[11]) * 1000
                                    else:
                                        json[country[0]]["Animals_capita"] += float(line[11])

    # open csv file for Waste per capita
    with open(INPUT_CSV_Waste) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        for line in reader:
            if round == 1:
                round = 2
            else:
                line = line[0].split(",")
                for country in countries:
                    if (line[0] in country):
                        if (str(country[0]) in json):
                            json[country[0]]["Waste_capita"] = float(line[6])

    return json

def addCalculations(json):

    list_waste      = []
    list_animal    = []
    list_co2        = []
    list_forest     = []

    catogories = ["Waste_capita","Animals_capita","CO2_capita","Forest_ratio"]

    for lands in json:
        for cat in catogories:
            if (cat in json[lands]):
                if (cat == "Waste_capita"):
                    list_waste.append(json[lands][cat])
                if (cat == "Animals_capita"):
                    list_animal.append(json[lands][cat])
                if (cat == "CO2_capita"):
                    list_co2.append(json[lands][cat])
                if (cat == "Forest_ratio"):
                    list_forest.append(json[lands][cat])
            else:
                json[lands][cat] = "N/A"

    list_waste.sort()
    list_animal.sort()
    list_co2.sort()
    list_forest.sort()

    print(list_animal)

    lists = [[list_waste, catogories[0]], [list_animal, catogories[1]], [list_co2, catogories[2]], [list_forest, catogories[3]]]

    json = json
    valid = 0

    for list in lists:
        min = float(list[0][0])
        max = float(list[0][len(list[0])-1])
        net_max = float(max - min)
        for land in json:
            # # Weird ass shit man
            # if (land == "Austria"):
            #     if (valid == 0):
            #         valid = 1
            #     elif (land == "Austria"):
            #         break
            if json[land][list[1]] != "N/A":
                # print(json[land][cat])
                value = json[land][list[1]]
                scale = 1000 / net_max * (json[land][list[1]] - min)
                json[land][list[1]] = {}
                json[land][list[1]]["value"] = value
                json[land][list[1]]["scale"] = scale
            else:
                json[land][list[1]] = {}
                json[land][list[1]]["value"] = "N/A"
                json[land][list[1]]["scale"] = "N/A"



    return json

if __name__ == "__main__":

    # get json
    jsonStruct = getJSON()

    completeJson = addCalculations(jsonStruct)

    # write json
    with open('data.json', 'w') as outfile:
        json.dump(completeJson, outfile)
