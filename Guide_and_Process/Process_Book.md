# day 1 (03-06-2019)

Made a plan for my project on forhand about different migration backgrounds and criminalitie however there was not enough depth in my visualisation.
This causes the deletion of a lot of work and i started working out a different project. However this didnt go smoothly cause i did want something
which i could correlate back somewhat to a political statement.

# day 2 (04-06-2019)

I made a vew plans however there was either not enough data for (car exidents in the netherlands per province and car deaths (only car deaths per province)),
data was to complex and to hard to optain (european parlemend related, inflation different coins, earopean tempature differences), data displays would be too
common (import export related things) or graphs would not have enough depth. So after a day of strugling i still had nothing.

# day 3 (05-06-2019)

Time pressure gets real however after a good night of sleep i got premision to work on one of the two proposals i did. My first idear was to research if not only
the tempature was going up but if the tempature differences day to day where also increasing. secondly i had the idea to make a european map where of the countries
would get a ranking from 1-28 depending on the importance of the viewer on 4 catogories: 1) involvement deforestation 2) Water reuse 3) CO2 emmision 4) waste generation.
Since the first project is easier i desided that if at start of day 4 i didnt have an european map i would do project one instead of two.


# day 4 (07-06-2019)

Since i managed to get a map i worked on getting the countries getting visual when hovering it. Also onclick the country name gets consoled logged. After this i worked At getting the Sliders for my project. This worked quite easly. I desided to place the Raderplot and Barchard both below the european map because the sliders took quite some space.

# day 5 (11-06-2019)

I worked on loading in my data. I noticed that the data about the population per country was missing a large portion of the countries in Europe. I tried to find a new data set. Also i desided that the Water Reuse data was quite small so i dicided to change it in Animal production per capita. This way around 80% of the counties in europe got data of these countries. I almost finished the importing og the data i just needed to do some calculations still.

# day 6 (13-06-2019)

I finished the format for my data which i was going to use in my graphs and loaded in the JSON file. After this i was working on the sliders. first i gave the different sliders a collour (R, G, B) so i could change the europe map. After that i tried to change the collours of my sliders to actual data.

# day 7 (14-06-2019)

I let all data influence the map through sliders however still a small bug accurs. When setting some sliders to zero some countries turn black. this is most likely caused because no color is given. So i have to check my loops.

# day 8 (16-06-2019)

I went searching for a radar chard but this wasnt to easy to find I found one project that works and adjusted it to my data. However it contains a lot of code i most likely wont need. so i am still doubting if it would be the right thing to use.

# day 9 (17-06-2019)

I worked on my radar chard. It was hard to get to know the scripts since they did a lot of thing i didnt need. After cleaning it up I disided that i would only show a half circle radar chard because there are only 4 axis (data points). It would look more pretty. I got in the end my radar chard background and only needed to load in the data points/lines.

# day 10 (18-06-2019)

Since i still had small errors in my land map I decided to first fix them so the right data was given to my radar chard. I fixed the problem where only x countries would show. now all the countries show is data available. I made my data import a little different since than the not the relative but the absolute values could be shown in my radar chart but also later in my bar chard. However loading in the data was quite difficult and i didnt exceed.

# day 11 (20-06-2019)

I started to work on loading my data in the radar chard and after a while found out I had a part of the code double... After that was fixed it became a lot more readable. Still only the data would show if all the data was complete but i thought the barchard had more priority so I tried starting working on that. Since I once made one i tried working off that code. However when I wanted to update it to different data it became a issue.

# day 12 (21-06-2019)

Since I needed data for updates anyways I decided to finish my radar chard. This was quite a challenge cause i wanted data to skip axis if it was NaN. In the end i decided just to put it on 0 with a NaN text. This was way easier. Since by creating the points and lines the same datapoints where used i pulled them out of part where the points and lines where created and made them somewhere else so i had to make it only one time.

# day 13 (23-06-2019)

this day i worked on the barchard which now got the correct information. this was still quite difficult since the update function could not be found in the radar chart function. This most likely because the barchard opdate was a function in the barchard function. i didnt know how to make a function global so in the end I dicided to for the time being just to put the barchard in the radar chart function so it works. I also made a dropdown to sort the bar chart in different ways. which worked until you called the updat in radarchart these graphs would not be sorted in the way the dropdown showed. Also i found out the animal data wasnt right. I worked on fixing that and it did at the end. In the perfious script only the first value was taken. this was my beta version now.

# day 14 (24-06-2019)

Time to fix my bugs :)
