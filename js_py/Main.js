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

    // remove some small errors from dataset
    Object.defineProperty(json, "Czech Republic",
        Object.getOwnPropertyDescriptor(json, "Czechia"));
    delete json["Czechia"];
    Object.defineProperty(json, "United Kingdom",
        Object.getOwnPropertyDescriptor(json, "United Kingdom of Great Britain and Northern Ireland"));
    delete json["United Kingdom of Great Britain and Northern Ireland"];

    // call the different functions
    cfg = bar_chard(json);
    // cfg = radar_chard(json);
    european_map(json, cfg);
    sliders(json);
  });

}
