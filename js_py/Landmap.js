function european_map(json_data, cfg){
  //Width and height
  var w = 800;
  var h = 600;

  countries = []

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
       .enter()
         .append("path")
         .attr("d", path)
         .attr("stroke", "rgba(8, 81, 156, 0.2)")
         .attr("fill", "rgba(169,169,169)")
         .on("click", function(path){
           if ($.inArray(path.properties.NAME, clickable) != -1) {
             // draw in radar chart
             if (countries.length < 2 & $.inArray(path.properties.NAME, countries) == -1){
               countries.push(path.properties.NAME)
             }
             else if (countries.length == 2 & $.inArray(path.properties.NAME, countries) == -1){
               countries = [countries[1],path.properties.NAME]
             }
             else if ($.inArray(path.properties.NAME, countries) != -1) {
               countries.forEach(function(names, i){
                 if (path.properties.NAME == names) {
                   countries.splice(i,1)
                 }
               })
             }

             radar_chard_data(json_data, countries, cfg);
             console.log(d3.mouse(this))
           }
         })
         .on('mouseover', function (path){
           if ($.inArray(path.properties.NAME, clickable) == -1) {
             newX =  d3.mouse(this)[0] - 10;
             newY =  d3.mouse(this)[1] - 5;

             d3.select("#European_map").select("svg").append('text')
               .style('opacity', 0.8)
               .style('font-family', 'sans-serif')
               .style('font-size', '15px')
               .attr('x', newX)
               .attr('y', newY)
               .text('Select collored country');
           }
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
	       .on('mouseout', function(){
   					d3.select("#European_map").select("svg").selectAll('text').remove()
 				  })
         });

  function radar_chard_data(json, country, cfg) {

      d3.select("#Rader_chard").select("svg").select("g").selectAll("polygon").remove()
      d3.select("#Rader_chard").select("svg").select("g").selectAll("circle").remove()
      // d3.select("#Rader_chard").selectAll(".legend").remove()

      console.log(country)

      // data
      var d = []
      var legend_names = []

      country.forEach(function(names, i){
        console.log(json)
        console.log(names)
        d.push([
        {axis:"Deforestation",    value:json[names]["Forest_ratio"]["absolute"]/1000},
        {axis:"CO2 Emmisionss",   value:json[names]["CO2_capita"]["absolute"]/1000},
        {axis:"Animal production",value:json[names]["Animals_capita"]["absolute"]/1000},
        {axis:"Waste Generation", value:json[names]["Waste_capita"]["absolute"]/1000},
        ])
        legend_names.push(names)
      })

      var g = d3.select("#Rader_chard").select("svg").select("g")

      var total = 3;
      var colorscale = d3.scaleOrdinal(d3.schemeCategory10);;

      //Legend titles
      var LegendOptions = legend_names;

      var Format = d3.format(".0%");

      dataValues = [];
      series = 0;

      d.forEach(function(y, x){
        dataValuesArray = [];
        g.selectAll(".nodes")
        // for data (j) and rotation (i) make cordinates for each rotation
      	.data(y, function(j, i){
      	  dataValuesArray.push([
      		cfg.w/2*(1-(parseFloat(Math.max(j.value, 0)))*Math.sin(i*cfg.radians/total)),
      		cfg.h/2*(1-(parseFloat(Math.max(j.value, 0)))*Math.cos(i*cfg.radians/total))
      	  ]);
      	});
        dataValuesArray.push(dataValuesArray[0]);
        dataValues.push(dataValuesArray)


        g.selectAll(".nodes")
  			 .data([dataValues[x]])
  			 .enter()
    			 .append("polygon")
    			 .attr("class", "radar-chart-serie"+series)
    			 .style("stroke-width", "2px")
    			 .style("stroke", cfg.color(series))
           // make points where in between the lines will be drawn
    			 .attr("points",function(d) {
    				 var str="";
    				 for(var pti=0;pti<d.length;pti++){
    					 str=str+d[pti][0]+","+d[pti][1]+" ";
    				 }
    				 return str;
    			  })
    			 .style("fill", function(j, i){return cfg.color(series)})
    			 .style("fill-opacity", cfg.opacityArea)
           // Make the square you go over visual and not the other
    			 .on('mouseover', function (d){
              polygon_collor("mouse_in", "polygon."+d3.select(this).attr("class"))
    				})
            // make the squares turn back to their normal state
    			 .on('mouseout', function(){
    					polygon_collor("mouse_out", "polygon."+d3.select(this).attr("class"))
    			  });

        g.selectAll(".nodes")
      		.data(y)
          .enter()
        		.append("circle")
        		.attr("class", "radar-chart-serie"+series)
        		.attr('r', cfg.radius)
        		.attr("alt", function(j){return Math.max(j.value, 0)})
        		.attr("cx", function(j, i){	return dataValues[x][i][0];})
        		.attr("cy", function(j, i){ return dataValues[x][i][1];})
        		.attr("data-id", function(j){return j.axis})
        		.style("fill", cfg.color(series)).style("fill-opacity", .9)
        		.on('mouseover', function (d){
        					newX =  parseFloat(d3.select(this).attr('cx')) - 10;
        					newY =  parseFloat(d3.select(this).attr('cy')) - 5;

        					tooltip
        						.attr('x', newX)
        						.attr('y', newY)
        						.text(Format(d.value))
        						.style('opacity', 1);

                  polygon_collor("mouse_in", "polygon."+d3.select(this).attr("class"))
        				  })
        		.on('mouseout', function(){
        					tooltip
        						.transition(200)
        						.style('opacity', 0);
                  polygon_collor("mouse_out", "polygon."+d3.select(this).attr("class"))
        				  })
        		.append("svg:title")
        		.text(function(j){return Math.max(j.value, 0)});


        series++;
      });

      function polygon_collor(type, z) {
        if (type == "mouse_in"){
          g.selectAll("polygon")
           .transition(200)
           .style("fill-opacity", 0.1);
          g.selectAll(z)
           .transition(200)
           .style("fill-opacity", .7);
        }
        else {
          g.selectAll("polygon")
            .transition(200)
            .style("fill-opacity", cfg.opacityArea);
        }
      }

      //Tooltip
    	tooltip = g.append('text')
    			   .style('opacity', 0)
    			   .style('font-family', 'sans-serif')
    			   .style('font-size', '13px');

       //Initiate Legend
       var legend = d3.select("#Rader_chard").select('svg').append("g")
       	.attr("class", "legend")
       	.attr("height", 200)
       	.attr("width", 400)
       	.attr('transform', 'translate(50,0)');

       // legend = d3.select("#Rader_chard").select('svg').select("g")

      //Create colour squares
      legend.selectAll('rect')
        .data(LegendOptions)
        .enter()
        .append("rect")
        .attr("x", cfg.w - 55)
        .attr("y", function(d, i){ return cfg.h/2 + i * 20;})
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i){ return cfg.color(i);})
        ;
      //Create text next to squares

      legend.selectAll('text')
        .data(LegendOptions)
        .enter()
        .append("text")
        .attr("x", cfg.w - 42)
        .attr("y", function(d, i){
          console.log("did work")
          return cfg.h/2 + i * 20 + 10;})
        .attr("font-size", "11px")
        .attr("fill", "#737373")
        .text(function(d) { return d; });
    }
}
