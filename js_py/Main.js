// Name: Jesse Groot
// Student number: 11012579

/**
This file loads the data for all graphs in different functions and calls graph 1
**/

window.onload = function() {
  main();
};

function main() {

  d3.json("js_py/data.json").then(function(json) {

    // remove some small errors from dataset
    // change names in JSON to real country name
    Object.defineProperty(json, "Czech Republic",
        Object.getOwnPropertyDescriptor(json, "Czechia"));
    delete json["Czechia"];
    Object.defineProperty(json, "United Kingdom",
        Object.getOwnPropertyDescriptor(json, "United Kingdom of Great Britain and Northern Ireland"));
    delete json["United Kingdom of Great Britain and Northern Ireland"];

    cfg = bar_radar_chart(json);
    european_map(json, cfg);
    sliders(json);
  });

}
