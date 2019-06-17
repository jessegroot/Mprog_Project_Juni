function european_map(json){
  //Width and height
  var w = 800;
  var h = 600;
  //Define map projection
  var projection = d3.geoMercator() //utiliser une projection standard pour aplatir les pôles, voir D3 projection plugin
               .center([ 13, 53 ]) //comment centrer la carte, longitude, latitude
               .translate([ w/2, h/2 ]) // centrer l'image obtenue dans le svg
               .scale([ w/1.3 ]); // zoom, plus la valeur est petit plus le zoom est gros
  //Define path generator
  var path = d3.geoPath()
           .projection(projection);
  //Create SVG
  var svg = d3.select("body").select("#Graph_1").select("#European_map")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

  //Load in GeoJSON data
  d3.json("europe.json").then(function(json) {
    //Bind data and create one path per GeoJSON feature
    svg.selectAll("path")
       .data(json.features)
       .enter(console.log(json.features))
         .append("path")
         .attr("d", path)
         .attr("stroke", "rgba(8, 81, 156, 0.2)")
         .attr("fill", "rgba(8, 81, 156, 0.6)")
         .on("click", function(path){
           // draw in radar chart
           radar_chard_data(json, path.properties.NAME);
           console.log(d3.mouse(this))
         });
  });


  function radar_chard_data(json, country) {
    console.log(country)
  }
}
