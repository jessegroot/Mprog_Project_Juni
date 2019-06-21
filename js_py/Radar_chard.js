function radar_chard(json, countries) {
  var RadarChart = {
  draw: function(id, d, cfg){

	var total = d.length-1;
	var radius = Math.min(cfg.w/2, cfg.h/2);
	var Format = d3.format(".1f");
  var lines = [0,1,2]

	var g = d3.select("#Rader_chard")
			.append("svg")
			.attr("width", cfg.w+cfg.ExtraWidthX)
			.attr("height", cfg.h+cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
			;

	var tooltip;

	//Circular segments
	for(var j=0; j<cfg.levels; j++){
	  var levelFactor = radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data(lines)
	   .enter()
	   .append("svg:line")
	   .attr("x1", function(d, i){return levelFactor*(1-Math.sin(i*cfg.radians/total));})
	   .attr("y1", function(d, i){return levelFactor*(1-Math.cos(i*cfg.radians/total));})
	   .attr("x2", function(d, i){return levelFactor*(1-Math.sin((i+1)*cfg.radians/total));})
	   .attr("y2", function(d, i){return levelFactor*(1-Math.cos((i+1)*cfg.radians/total));})
	   .attr("class", "line")
	   .style("stroke", "grey")
	   .style("stroke-opacity", "0.75")
	   .style("stroke-width", "0.3px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
	}

	//Text indicating at what % each level is
	for(var j=0; j<cfg.levels; j++){
	  var levelFactor = radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data([1]) //dummy data
	   .enter()
	   .append("svg:text")
	   .attr("x", function(d){return levelFactor*(1-Math.sin(0));})
	   .attr("y", function(d){return levelFactor*(1-Math.cos(0));})
	   .attr("class", "legend")
	   .style("font-family", "sans-serif")
	   .style("font-size", "10px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
	   .attr("fill", "#737373")
	   .text(Format((j+1)/cfg.levels));
	}

	series = 0;

	var axis = g.selectAll(".axis")
			.data(d)
			.enter()
			.append("g")
			.attr("class", "axis");

	axis.append("line")
		.attr("x1", cfg.w/2)
		.attr("y1", cfg.h/2)
		.attr("x2", function(d, i){return cfg.w/2*(1-Math.sin(i*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total));})
		.attr("class", "line")
		.style("stroke", "grey")
		.style("stroke-width", "1px");

	axis.append("text")
		.attr("class", "legend")
		.text(function(d){return d})
		.style("font-family", "sans-serif")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "1.5em")
		.attr("transform", function(d, i){return "translate(0, -10)"})
		.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
		.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);})
    .on("mouseover", function(d){
      axis.transition()
        .duration(10)
        .transition()
        .style("font-size", "15px")
    })
    .on("click", function(d){
      update_barchard(d)
    })

	//Tooltip
	tooltip = g.append('text')
			   .style('opacity', 0)
			   .style('font-family', 'sans-serif')
			   .style('font-size', '13px');
  }
};

var w = 300,
	h = 300;

var colorscale = d3.scaleOrdinal(d3.schemeCategory10);;

//Legend titles
var LegendOptions = ['Netherlands','Spain'];

//Data
var d = ["Deforestation","CO2 Emmisionss","Animal production","Waste Generation"];

//Options for the Radar chart, other than default
var mycfg = {
  radius: 4,
  w: 300,
  h: 300,
  factorLegend: 0.85,
  levels: 10,
  radians: 1 * Math.PI,
  opacityArea: 0.4,
  ToRight: 5,
  TranslateX: 100,
  TranslateY: 30,
  ExtraWidthX: 120,
  ExtraWidthY: 100,
  color: d3.scaleOrdinal(d3.schemeCategory10)
  }

  //Call function to draw the Radar chart
  //Will expect that data is in %'s
  RadarChart.draw("#chart", d, mycfg);

  ////////////////////////////////////////////
  /////////// Initiate legend ////////////////
  ////////////////////////////////////////////

  var svg = d3.select("#Rader_chard")
  	.selectAll('svg')
  	.append('svg')
  	.attr("width", w+100)
  	.attr("height", h)

  //Create the title for the legend
  var text = svg.append("text")
  	.attr("class", "title")
  	.attr('transform', 'translate(90,0)')
  	.attr("x", w - 95)
  	.attr("y", h/2 - 7)
  	.attr("font-size", "12px")
  	.attr("fill", "#404040")
  	.text("Countries");

  // //Initiate Legend
  // var legend = svg.append("g")
  // 	.attr("class", "legend")
  // 	.attr("height", 200)
  // 	.attr("width", 400)
  // 	.attr('transform', 'translate(50,0)');

    return mycfg
}
