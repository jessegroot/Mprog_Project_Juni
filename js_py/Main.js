// Name: Jesse Groot
// Student number: 11012579

/**
This file loads the data for all graphs in different functions and calls graph 1
**/

window.onload = function() {
  main();
};

function main() {
  european_map();
  sliders();
  // // Queue to request both files and wait until all requests are fulfilled
  // var requests = [d3.json("data.json"), d3.json("world_countries.json"), d3.json("JSON_LandCodes.json"),d3.tsv("output.tsv")];
  //
  // Promise.all(requests).then(function(response) {
  //
  //   console.log(response[0])
  //   var data = good_response(response[3], response[0])
  //
  //   var year_2014 = data[0]
  //   line_data = data[1]
  //   mean_years = data[2]
  //   landcodes = response[2]
  //
  //   // data points for line graph
  //   texten = []
  //
  //
  //   make_map(response[1], year_2014, mean_years)
  //   }).catch(function(e){
  //       throw(e);
  //   });
}

function good_response(gge_corrected, line_data) {
  total = gge_corrected.length
  for (let x = 0; x <= total; x++) {
    if ((total-x)%2 == 0) {
      delete gge_corrected[total-x]
    }
  }

  gge_corrected_format = {}
  i = 0
  meanGGEPop = 0
  meanGGEGDP = 0
  gge_corrected.forEach(function(d){
    meanGGEGDP += parseFloat(d["GGE_GDP_corrected"])
    meanGGEPop += parseFloat(d["GGE_pop_corrected"])
    gge_corrected_format[i] = d
    i += 1
  })

  meanGGEGDP = meanGGEGDP/(total/2 - 0.5)
  meanGGEPop = meanGGEPop/(total/2 - 0.5)
  for (let x = 0; x < parseInt(total/2); x++) {
    gge_corrected_format[x]["GGE_GDP_corrected"] = gge_corrected_format[x]["GGE_GDP_corrected"]/meanGGEGDP
    gge_corrected_format[x]["GGE_pop_corrected"] = gge_corrected_format[x]["GGE_pop_corrected"]/meanGGEPop
  }

  var data_keys = Object.keys(line_data)
  lands_length = data_keys.length
  years = {}

  data_keys.forEach(function(land) {
    var data_year_keys = Object.keys(line_data[land])
    data_year_keys.forEach(function(year) {
      if (year in years) {
        years[year][0] += line_data[land][year]["GGE_GDP_corrected"]
        years[year][1] += line_data[land][year]["GGE_pop_corrected"]
      }
      else {
        years[year] = [line_data[land][year]["GGE_GDP_corrected"], line_data[land][year]["GGE_pop_corrected"]]
      }
    })
  })

  years_keys = Object.keys(years)
  years_keys.forEach(function(year) {
    years[year][0] = (years[year][0]/lands_length)
    years[year][1] = (years[year][1]/lands_length)
  })

  data_keys.forEach(function(land) {
    var data_year_keys = Object.keys(line_data[land])
    data_year_keys.forEach(function(year) {
      line_data[land][year]["GGE_GDP_corrected"] = line_data[land][year]["GGE_GDP_corrected"]/years[year][0]
      line_data[land][year]["GGE_pop_corrected"] = line_data[land][year]["GGE_pop_corrected"]/years[year][1]
    })
  })
  console.log(line_data)

  return [gge_corrected_format, line_data, years]
}
