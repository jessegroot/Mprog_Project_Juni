// Name: Jesse Groot
// Student number: 11012579

/**
This file loads the data for all graphs in different functions and calls graph 1
**/

window.onload = function() {
  main();
};

function main() {

  d3.json("/js_py/data.json").then(function(json) {
    cfg = radar_chard(json);
    european_map(json, cfg);
    sliders(json);
    bar_chard(json);
  });

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
