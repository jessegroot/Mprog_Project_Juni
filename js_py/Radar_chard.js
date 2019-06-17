function radar_chard(json, countries) {
  var RadarChart = {
  draw: function(id, d, cfg){

	var allAxis = (d[0].map(function(i, j){return i.axis}));
	var total = allAxis.length-1;
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
			.data(allAxis)
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
		.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});


	d.forEach(function(y, x){
	  dataValues = [];
	  g.selectAll(".nodes")
		.data(y, function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0)))*Math.sin(i*cfg.radians/total)),
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0)))*Math.cos(i*cfg.radians/total))
		  ]);
		});
	  dataValues.push(dataValues[0]);
	  g.selectAll(".area")
					 .data([dataValues])
					 .enter()
					 .append("polygon")
					 .attr("class", "radar-chart-serie"+series)
					 .style("stroke-width", "2px")
					 .style("stroke", cfg.color(series))
					 .attr("points",function(d) {
						 var str="";
						 for(var pti=0;pti<d.length;pti++){
							 str=str+d[pti][0]+","+d[pti][1]+" ";
						 }
						 return str;
					  })
					 .style("fill", function(j, i){return cfg.color(series)})
					 .style("fill-opacity", cfg.opacityArea)
					 .on('mouseover', function (d){
										z = "polygon."+d3.select(this).attr("class");
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", 0.1);
										g.selectAll(z)
										 .transition(200)
										 .style("fill-opacity", .7);
									  })
					 .on('mouseout', function(){
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", cfg.opacityArea);
					 });
	  series++;
	});
	series=0;


	d.forEach(function(y, x){
	  g.selectAll(".nodes")
		.data(y).enter()
		.append("svg:circle")
		.attr("class", "radar-chart-serie"+series)
		.attr('r', cfg.radius)
		.attr("alt", function(j){return Math.max(j.value, 0)})
		.attr("cx", function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0)))*Math.sin(i*cfg.radians/total)),
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0)))*Math.cos(i*cfg.radians/total))
		]);
		return cfg.w/2*(1-(Math.max(j.value, 0))*Math.sin(i*cfg.radians/total));
		})
		.attr("cy", function(j, i){
		  return cfg.h/2*(1-(Math.max(j.value, 0))*Math.cos(i*cfg.radians/total));
		})
		.attr("data-id", function(j){return j.axis})
		.style("fill", cfg.color(series)).style("fill-opacity", .9)
		.on('mouseover', function (d){
					newX =  parseFloat(d3.select(this).attr('cx')) - 10;
					newY =  parseFloat(d3.select(this).attr('cy')) - 5;

					tooltip
						.attr('x', newX)
						.attr('y', newY)
						.text(Format(d.value))
						.transition(200)
						.style('opacity', 1);

					z = "polygon."+d3.select(this).attr("class");
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", 0.1);
					g.selectAll(z)
						.transition(200)
						.style("fill-opacity", .7);
				  })
		.on('mouseout', function(){
					tooltip
						.transition(200)
						.style('opacity', 0);
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", cfg.opacityArea);
				  })
		.append("svg:title")
		.text(function(j){return Math.max(j.value, 0)});

	  series++;
	});
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
var d = [
		  [
			{axis:"Deforestation",value:0.59},
			{axis:"CO2 Emmisionss",value:0.56},
			{axis:"Animal production",value:0.42},
			{axis:"Waste Generation",value:0.34},
		  ],[
			{axis:"Deforestation",value:0.48},
			{axis:"CO2 Emmisions",value:0.41},
			{axis:"Animal production",value:0.27},
			{axis:"Waste Generation",value:0.28},
		  ]
		];

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

  //Initiate Legend
  var legend = svg.append("g")
  	.attr("class", "legend")
  	.attr("height", 200)
  	.attr("width", 400)
  	.attr('transform', 'translate(50,0)');

  	//Create colour squares
  	legend.selectAll('rect')
  	  .data(LegendOptions)
  	  .enter()
  	  .append("rect")
  	  .attr("x", w - 55)
  	  .attr("y", function(d, i){ return h/2 + i * 20;})
  	  .attr("width", 10)
  	  .attr("height", 10)
  	  .style("fill", function(d, i){ return colorscale(i);})
  	  ;
  	//Create text next to squares
  	legend.selectAll('text')
  	  .data(LegendOptions)
  	  .enter()
  	  .append("text")
  	  .attr("x", w - 42)
  	  .attr("y", function(d, i){ return h/2 + i * 20 + 10;})
  	  .attr("font-size", "11px")
  	  .attr("fill", "#737373")
  	  .text(function(d) { return d; })
  	  ;
}
