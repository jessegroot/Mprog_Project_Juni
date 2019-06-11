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

INPUT_CSV_CO2 =        "./Data/CO2_capita.csv"            # Long-Format   # Done
INPUT_CVS_Forest =     "./Data/Deforestation.csv"         # Wide-format   # Cant be done
INPUT_CVS_Food =       "./Data/Food_production.csv"       # Wide-format   # Cant be done
INPUT_CSV_Waste =      "./Data/Waste_Capita.csv"          # Wide-format   # Done
INPUT_CSV_Pop =        "./Data/FOASTAT_populaiton.csv"    # Long-format   # Done
# INPUT_CSV_CountryCodes =   "./Data/GDP_Of_Countriescsv"

def getJSON():
    # make json object
    json = {}

    # open csv file for Greenhouse Gass Emission
    with open(INPUT_CSV_CO2) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        valid = 0
        for line in reader:
            if round == 1:
                round = 2
            else:
                line = line[0].split(",")
                if (len(str(line[0])) == 3):
                    if (str(line[0]) not in json):
                        json[line[0]] = {}
                    else:
                        line[5] = line[5].replace('"', "")
                        json[line[0]]["Value"] = float(line[6])
                        json[line[0]]["Year"] = float(line[5])

    print(json)

    # open csv file for Population
    with open(INPUT_CSV_Population) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        startYear = 0
        for line in reader:
            if round == 1:
                while round == 1:
                    if "1995" in line[startYear]: #line[startYear]
                        round = 2
                        break;
                    else:
                        startYear += 1
            else:
                line = line[0].split(",")
                countryCode = "".join(line[1:3])
                for key in json.keys():
                    if key in countryCode:
                        for year in range(0,20):
                            # line[year+startYear]
                            if str(1995+year) in json[key]:
                                line[year+startYear] = line[year+startYear].replace('"', "")
                                json[key][str(1995+year)]["Population"] = float(line[year+startYear])
                        break

    # open csv file for GDP
    with open(INPUT_CSV_GDP) as csvfile:
        reader = csv.reader(csvfile)
        round = 1
        land = "XXX"
        valid = 0
        for line in reader:
            if round == 1:
                round = 2
            else:
                line = line[0].split(",")
                if land != str(line[0]):
                    for key in json.keys():
                        if key == str(line[0]):
                            land = key
                            valid = 1
                            break
                        valid = 0
                if valid == 1:
                    line[5] = line[5].replace('"', "")
                    if line[5] in json[land]:
                        json[land][line[5]]["GDP"] = float(line[6])

    return json

def addCalculations(json):

    delete_years = []
    delete_lands = []

    for lands in json:
        for year in json[lands]:
            if ("GGE" in json[lands][year]) and ("Population" in json[lands][year]) and ("GDP" in json[lands][year]):
                json[lands][year]["GGE_pop_corrected"] = (json[lands][year]["GGE"]/json[lands][year]["Population"])
                json[lands][year]["GGE_GDP_corrected"] = (json[lands][year]["GGE"]/json[lands][year]["GDP"])
            else:
                delete_years.append([lands, year])
        if len(json[lands]) <= 14:
            delete_lands.append(lands)

    for item in delete_years:
        del json[item[0]][item[1]]
    for item in delete_lands:
        del json[item]

    years = {}

    for year in range(0,20):
        years[str(1995+year)] = {}
        years[str(1995+year)]["mean_GGE_GDP_corrected"] = 0
        years[str(1995+year)]["mean_GGE_pop_corrected"] = 0
        years[str(1995+year)]["county_count"] = 0


    for lands in json:
        for year in json[lands]:
            years[year]["mean_GGE_GDP_corrected"] += json[lands][year]["GGE_GDP_corrected"]
            years[year]["mean_GGE_pop_corrected"] += json[lands][year]["GGE_pop_corrected"]
            years[year]["county_count"] += 1

    for year in years:
        years[year]["mean_GGE_GDP_corrected"] = years[year]["mean_GGE_GDP_corrected"]/years[year]["county_count"]
        years[year]["mean_GGE_pop_corrected"] = years[year]["mean_GGE_pop_corrected"]/years[year]["county_count"]
        del years[year]["county_count"]

    for lands in json:
        for year in json[lands]:
            json[lands][year]["GGE_pop_corrected"] = json[lands][year]["GGE_pop_corrected"]/years[year]["mean_GGE_pop_corrected"]
            json[lands][year]["GGE_GDP_corrected"] = json[lands][year]["GGE_GDP_corrected"]/years[year]["mean_GGE_GDP_corrected"]

    return json

def writeTsv(json):

    with open('output.tsv', 'wt') as out_file:
        tsv_writer = csv.writer(out_file, delimiter='\t')
        tsv_writer.writerow(['Land', 'GGE_pop_corrected', 'GGE_GDP_corrected'])
        for lands in json:
            for item in json[lands]:
                if (item == "2014"):
                    tsv_writer.writerow([lands, json[lands][item]["GGE_pop_corrected"], json[lands][item]["GGE_GDP_corrected"]])

def writeJsonLineGraph(json):

    line_json = {}
    line_json["GGE_pop_corrected"] = {}
    line_json["GGE_GDP_corrected"] = {}
    line_json["GGE_pop_corrected"]["series"] = {}
    line_json["GGE_GDP_corrected"]["series"] = {}

    values_pop = []
    values_GDP = []
    series_index = 0

    for land in json:
        for year in range(1995,2015):
            year = str(year)
            if year in json[land]:
                values_pop.append(json[land][year]["GGE_pop_corrected"])
                values_GDP.append(json[land][year]["GGE_GDP_corrected"])
            else:
                values_pop.append(0)
                values_GDP.append(0)
        line_json["GGE_pop_corrected"]["series"][series_index] = {}
        line_json["GGE_pop_corrected"]["series"][series_index]["name"] = land
        line_json["GGE_pop_corrected"]["series"][series_index]["values"] = values_pop
        series_index += 1
        line_json["GGE_GDP_corrected"]["series"][series_index] = {}
        line_json["GGE_GDP_corrected"]["series"][series_index]["name"] = land
        line_json["GGE_GDP_corrected"]["series"][series_index]["values"] = values_GDP
        series_index += 1
        values_pop = []
        values_GDP = []

    # print(line_json)

    # # write json
    # with open('line_data.json', 'w') as outfile:
    #     json.dump(line_json, outfile)

def writeJsonBarGraph(json):

    bar_json = {}
    array_pop = []
    array_GDP = []

    for land in json:
        bar_json[land+"_pop_corrected"] = []
        bar_json[land+"_GDP_corrected"] = []
        for year in json[land]:
            array_pop.append({})
            array_GDP.append({})

            # name: year, value: json[land][year]["GGE_pop_corrected"]
            # name: year, value: json[land][year]["GGE_GDP_corrected"]

    print(bar_json)

    # # write json
    # with open('line_data.json', 'w') as outfile:
    #     json.dump(line_json, outfile)

if __name__ == "__main__":

    # get json
    jsonStruct = getJSON()

    completeJson = addCalculations(jsonStruct)

    writeTsv(completeJson)

    writeJsonLineGraph(completeJson)

    writeJsonBarGraph(completeJson)



    # write json
    with open('data.json', 'w') as outfile:
        json.dump(completeJson, outfile)



# Past unused

# # open csv file for % of import that is export
# with open(INPUT_CSV_ImIsEx_Perc) as csvfile:
#     reader = csv.reader(csvfile)
#     for item in reader:
#         string1 = item[0][0:3]
#         string2 = item[0][39:43]
#         string3 = item[0][45:50]
#         if "," in string3:
#             string3 = string3.replace(",", "")
#         if string1 != "ï»¿":
#             if string1 not in json:
#                 json[string1] = {}
#             json[string1][string2] = {"Percentage": float(string3)}
