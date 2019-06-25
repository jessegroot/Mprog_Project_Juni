function european_map(json_data, cfg){
  //Width and height
  var w = 800;
  var h = 600;

  countries = []

  //Define map projection
  //use a standard projection to flatten the poles, see D3 projection plugin
  var projection = d3.geoMercator()
    //to center the map, longitude, latitude
    .center([ 13, 53 ])
    // to center of the svg
    .translate([ w/2, h/2 ])
    // zoom in on map
    .scale([ w/1.3 ]);

  //Define path generator
  var path = d3.geoPath().projection(projection);

  //Create SVG
  var svg = d3.select("body").select("#Graph_1").select("#European_map")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

  //Load in GeoJSON data
  d3.json("europe.json").then(function(json) {
    //Bind data and create one path per GeoJSON feature
    svg.selectAll("path")
    // surrounding of every country
    .data(json.features)
    .enter()
      .append("path")
      .attr("d", path)
      // lines around the country
      .attr("stroke", "rgba(8, 81, 156, 0.2)")
      // color of the country
      .attr("fill", "rgba(169,169,169)")
      .on("click", function(path){
        // if country in array
        if ($.inArray(path.properties.NAME, clickable) != -1) {
          // add country in array while length remains 2 or shorter
          if (countries.length < 2 & $.inArray(path.properties.NAME, countries) == -1){
            countries.push(path.properties.NAME)
          }
          else if (countries.length == 2 & $.inArray(path.properties.NAME, countries) == -1){
            countries = [countries[1],path.properties.NAME]
          }
          // remove country if clicked twice
          else if ($.inArray(path.properties.NAME, countries) != -1) {
            countries.forEach(function(names, i){
              if (path.properties.NAME == names) {
                countries.splice(i,1)
              }
            })
          }
          // call radar_chard
          radar_chard_data(json_data, countries, cfg);
          // console.log(d3.mouse(this))
        }
      })
      // on mouse over country
      .on('mouseover', function (path){
        // if not in clickable
        if ($.inArray(path.properties.NAME, clickable) == -1) {
          // get mouse cordinates
          newX =  d3.mouse(this)[0] - 10;
          newY =  d3.mouse(this)[1] - 5;

          // give text to select colored country
          d3.select("#European_map").select("svg").append('text')
            .style('opacity', 0.8)
            .style('font-family', 'sans-serif')
            .style('font-size', '15px')
            .attr('x', newX)
            .attr('y', newY)
            .text('Select collored country');
        }
        // else give text of colored county
        else {
          newX =  d3.mouse(this)[0] - 10;
          newY =  d3.mouse(this)[1] - 5;

          d3.select("#European_map").select("svg").append('text')
            .style('opacity', 0.8)
            .style('font-family', 'sans-serif')
            .style('font-size', '15px')
            .attr('x', newX)
            .attr('y', newY)
            .text(path.properties.NAME);
        }
      })
      // on mouseout delete
      .on('mouseout', function(){
      d3.select("#European_map").select("svg").selectAll('text').remove()
    })
  });

  // json country list and cfg (format of radar chard info)
  function radar_chard_data(json, country, cfg) {

    // delete perfious lines
    d3.select("#Rader_chard").select('svg').selectAll("g").selectAll("#legend").remove()

    // data
    var data = []
    var legend_names = []

    // collect data for radar chard
    country.forEach(function(names, i){
      data.push([
      {axis:"CO2 Emmisionss",   value:json[names]["CO2_capita"]["absolute"]/1000},
      {axis:"Waste Generation", value:json[names]["Waste_capita"]["absolute"]/1000},
      {axis:"Animal production",value:json[names]["Animals_capita"]["absolute"]/1000},
      {axis:"Deforestation",    value:json[names]["Forest_ratio"]["absolute"]/1000},
      ])
      legend_names.push(names)
    })

    // select the things the lines are going to be made of
    var g = d3.select("#Rader_chard").select("svg").select("g")

    // total steps of the lines
    var total = 3;
    // used color cale for radar chart
    var colorscale = d3.scaleOrdinal(d3.schemeCategory10);;

    // legend titles
    var LegendOptions = legend_names;

    // format to show values in script
    var Format = d3.format(".0%");

    // points of the data in chard and which country is selected
    var data_values = [];
    var series = 0;

    // add datapoints to data_value
    data.forEach(function(y, x){
      data_values_array = [];
      // for data (j) and rotation (i) make cordinates for each rotation
    	y.forEach(function(j, i){
        // if data isnt "NaN"
        if (isNaN(j.value) != true) {
          data_values_array.push([
      		cfg.w/2*(1-(parseFloat(Math.max(j.value, 0)))*Math.sin(i*cfg.radians/total)),
      		cfg.h/2*(1-(parseFloat(Math.max(j.value, 0)))*Math.cos(i*cfg.radians/total))
      	  ]);
        }
        // if data is "NaN" give cordinates of middle of chard
        else {
          data_values_array.push([cfg.h/2,cfg.w/2])
        }
    	});

      // push the first point again to end in a circle
      data_values_array.push(data_values_array[0]);
      // push all the values
      data_values.push(data_values_array)

      // select nodes for data points
      lines = g.selectAll(".radar-chart-lines"+series)
  		 .data([data_values[x]])

      lines
  		 .enter()
        .append("polygon")
        //  give class so its selectable
        .attr("class", "radar-chart-lines"+series)
        // line width and color
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(series))
        // make points where in between the lines will be drawn
        .style("fill", function(j, i){return cfg.color(series)})
        //  fill between lines
        .style("fill-opacity", cfg.opacityArea)
        // Make the square you go over visual and not the other
        .on('mouseover', function (d){
          polygon_collor("mouse_in", "polygon."+d3.select(this).attr("class"))
        })
        // make the squares turn back to their normal state
        .on('mouseout', function(){
        	polygon_collor("mouse_out", "polygon."+d3.select(this).attr("class"))
        })
        // add the perviously made lines
        .merge(lines)
        .transition()
        .duration(500)
          .attr("points",function(d) {
            // start in middle of svg
            var str="" + cfg.h/2 + "," + cfg.w/2 + " ";
            for(var pti=0;pti<d.length-1;pti++){
              //  get data points if there is data
              if (isNaN(data[x][pti].value) != true){
                str=str+d[pti][0]+","+d[pti][1]+" ";
              }
            }
            return str;
          })

      // for circles with values loop 4 times
      dots = g.selectAll(".radar-chart-dots"+series)
    		.data(y)

      dots
        .enter()
      		.append("circle")
      		.attr("class", "radar-chart-dots"+series)
          // fill circle with right color
      		.style("fill", cfg.color(series)).style("fill-opacity", .9)
          .on('mouseover', function (d){
            // get mouse cordinates
            newX =  parseFloat(d3.select(this).attr('cx')) - 10;
            newY =  parseFloat(d3.select(this).attr('cy')) - 5;

            // give text when hovering circle
            tooltip
              .attr('x', newX)
              .attr('y', newY)
              .text(Format(d.value))
              .style('opacity', 1);

            polygon_collor("mouse_in", "polygon."+d3.select(this).attr("class"))
          })
          // delete text when mouse out
          .on('mouseout', function(){
            tooltip
              .transition(200)
              .style('opacity', 0);

            polygon_collor("mouse_out", "polygon."+d3.select(this).attr("class"))
          })
          .merge(dots)
          .transition()
          .duration(500)
            // select radius x and y
        		.attr('r', cfg.radius)
        		.attr("cx", function(j, i){	return data_values[x][i][0];})
        		.attr("cy", function(j, i){ return data_values[x][i][1];})
      // got to next dataset
      series++;

      if (data.length < 2) {
        // If less group in the new dataset, I delete the ones not in use anymore
        g.selectAll(".radar-chart-lines1")
          .remove()
        g.selectAll(".radar-chart-dots1")
          .remove()
      }
    });

    function polygon_collor(type, z) {
      // if mouse in darken the polygon
      if (type == "mouse_in"){
        g.selectAll("polygon")
         .transition(200)
         .style("fill-opacity", 0.1);
        g.selectAll(z)
         .transition(200)
         .style("fill-opacity", .7);
      }
      // if mouse out lighten the polygon
      else {
        g.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", cfg.opacityArea);
      }
    }

    // tooltip layout
  	tooltip = g.append('text')
  			   .style('opacity', 0)
  			   .style('font-family', 'sans-serif')
  			   .style('font-size', '13px');

     // initiate Legend
     var legend = d3.select("#Rader_chard").select('svg').append("g")
     	.attr("class", "legend")
     	.attr("height", 200)
     	.attr("width", 400)
     	.attr('transform', 'translate(50,0)');

    // create colour squares
    legend.selectAll('rect')
      .data(LegendOptions)
      .enter()
      .append("rect")
      .attr("x", cfg.w - 55)
      .attr("y", function(d, i){ return cfg.h/2 + i * 20;})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d, i){ return cfg.color(i);});

    //Create text next to squares
    legend.selectAll('text')
      .data(LegendOptions)
      .enter()
      .append("text")
      .attr("id", "legend")
      .attr("x", cfg.w - 42)
      .attr("y", function(d, i){
        return cfg.h/2 + i * 20 + 10;})
      .attr("font-size", "11px")
      .attr("fill", "#737373")
      .text(function(d) { return d; });
  }
}
