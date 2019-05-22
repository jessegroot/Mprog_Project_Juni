"""
First Programm
This Programm retreives information including:
    1) Crimes per province in the netherlands (2010 till 2018)
    2) Population of each province and the netherlands and their etnicity
    3) Data from crimes 2016 till 2018 and their etnicity (total in the netherlands)
    4) Data from
It will be stored in
Province -> Years -> Crimes/Population*10000 (JSON style)
"""

"""
Data will be used by D3 version 5
Needed format change to arrays instead of dict (JSON to Arrays for graphs)

Netherlands map:
[Province[year [Crimes/Population*10000]]]
This way year can be selected and given a new map (2010 till 2018)
selecting different years as start position will change a variable year and ask for a update of the map
where in this variable is used to select the right year.

Line Chard:
[Province [year [etnicity % in pop, Crimes/Population*10000]]] (same as worldmap)
will create a line chard containing the % Population with an migration background and the crimes per 10000 pop.

Sunburst:
[year [Migration_Background, No_Migration_Background [All sorts of crimes]]]

"""

"""
How it works?
Select a country on world map by clicking on it.
Instandly make line + bar chard.
By selecting another courty up to 5 add the country in the linechard and replace the barchard
Of the selected countries a list is represented by clicking on one of them the lines in the chard are deleted.
"""
