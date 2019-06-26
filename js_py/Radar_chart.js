function bar_radar_chart(json) {

  // size of bargraph and margins
  var canvasBarchartWidth = 900,
      canvasBarchartHeight = 400,
      margin = { top: 30, right: 80, bottom: 80, left: 60 };

  // make width and height for graph (exluding space for labels)
  var width = canvasBarchartWidth - (margin.left + margin.right);
  var height = canvasBarchartHeight - (margin.bottom + margin.top);

  // make canvas barchart in correct place for barchart
  canvasBarchart = d3.select("#Bar_chart")
    .append("svg")
    .attr("width", canvasBarchartWidth)
    .attr("height", canvasBarchartHeight);

  // title bar chart
  canvasBarchart.append("text")
    .attr("id", "titles")
    .attr("transform","translate( " + (width/2+margin.left) + "," + (margin.top - 10) + ")")
    .style("text-anchor", "middle")
    .text("CO2 Emmisions in tons per capita");

  // y_axis bar chart
  canvasBarchart.append("text")
    .attr("id", "y_axis")
    .attr("transform","translate( 30 ," + (margin.top + height/2) + ") rotate(-90)")
    .style("text-anchor", "middle")
    .text("CO2 Emmisions in tons per capita");

  // get the datasets of each catogorie
  datasets = [[],[],[],[]]

  // for every item in json add to the right catogorie
  for (let item in json) {
     if (json[item]["Forest_ratio"]["value"] != "N/A") {
       datasets[3].push({name: item, value: json[item]["Forest_ratio"]["value"]})
     }
     if (json[item]["CO2_capita"]["value"] != "N/A") {
       datasets[0].push({name: item, value: json[item]["CO2_capita"]["value"]})
     }
     if (json[item]["Animals_capita"]["value"] != "N/A") {
       datasets[2].push({name: item, value: json[item]["Animals_capita"]["value"]})
     }
     if (json[item]["Waste_capita"]["value"] != "N/A") {
       datasets[1].push({name: item, value: json[item]["Waste_capita"]["value"]})
     }
  }

  // sort the datasets to desending
  for (let i = 0; i < datasets.length; i++){
    datasets[i].sort((a, b) => b.value - a.value);
  }

  // make a scale for the x axis
  x = d3.scaleBand()
    .domain(datasets[0].map(d => d.name))
    .range([margin.left, width + margin.left])
    .padding(0.1)

  // make a scale for the y axis
  y = d3.scaleLinear()
    .domain([0, d3.max(datasets[0], d => d.value)]).nice()
    .range([height + margin.top, margin.top])

  // make the width that one land takes in barchart
  var bandWidth = width / datasets[0].length

  // initialize the x axis
  var x = d3.scaleBand()
    .range([ margin.left, width + margin.left ])
    .padding(0.1);
  var x_axis = canvasBarchart.append("g")
    .attr("transform", "translate(0," + (height + margin.top) + ")")

  // initialize the y axis
  var y = d3.scaleLinear()
    .range([ height + margin.top, margin.top]);
  var yAxis = canvasBarchart.append("g")
    .attr("transform", "translate("+ margin.left +", 0)")

  // what is the used dataset
  var current_dataset;

  // titles and y_axis
  graph_info = {
    titles: ["CO2 emmisions per Capita","Waste gerneration per Capita","Animals produced per Capita","Intencity of wood use per country"],
    y_axis: ["In 1000 KG per year","kilo grams per year","Amount of animals per year","Wood use ratio (1 max 0 nothing)"]
  }

  // A function that create / update the plot for a given variable:
  function update(data, type, graph_info) {

    // update title
    var title = d3.select("#Bar_chart").select("#titles")
      .transition()
      .text(graph_info["titles"][type])

    // updat y_axis
    var y_axis = d3.select("#Bar_chart").select("#y_axis")
      .transition()
      .text(graph_info["y_axis"][type])

    // give data to current dataset
    current_dataset = data

    // Update the X axis
    x.domain(data.map(function(d) { return d.name; }))
    x_axis
      .transition()
      .duration(1000)
      .call(d3.axisBottom(x))
      // rotate text so it is readable
      .selectAll("text")
        .attr("y", 10)
        .attr("x", 10)
        .attr("dy", ".35em")
        .attr("transform", "rotate(60)")
        .style("text-anchor", "start");

    // Update the Y axis
    y.domain([0, d3.max(data, function(d) { return d.value }) ]);
    yAxis
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y));

    // Create the u variable
    var bars = d3.select("#Bar_chart").select("svg").selectAll("rect")
      .data(data)

    bars
      .enter()
      // Add a new rect for each new elements
      .append("rect")
      // get the already existing elements as well
      .merge(bars)
      // and apply changes to all of them
      .transition()
      .duration(1000)
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return (height+ margin.top) - y(d.value); })
        .attr("fill", "#69b3a2")

    // If less group in the new dataset, I delete the ones not in use anymore
    bars
      .exit()
      .remove()
  }

  // select dropdown
  var dropdown = d3.select("#Bar_div").select("#Dropdown")

  dropdown.on("change", function(){
    // Find what was selected from the dropdown
 		var selected = d3.select("#Dropdown").node().value

    if (selected == "Alphabetical") {
      // change the datasets in alphabetical order
      current_dataset.sort((a, b) => a.name.localeCompare(b.name));
      for (let i = 0; i < datasets.length; i++){
        datasets[i].sort((a, b) => a.name.localeCompare(b.name));
      }
    }
    if (selected == "Desending") {
      // change the datasets in desending order
      current_dataset.sort((a, b) => b.value - a.value);
      for (let i = 0; i < datasets.length; i++){
        datasets[i].sort((a, b) => b.value - a.value);
      }
    }
    if (selected == "Ascending") {
      // change the datasets in ascending order
      current_dataset.sort((a, b) => a.value - b.value);
      for (let i = 0; i < datasets.length; i++){
        datasets[i].sort((a, b) => a.value - b.value);
      }
    }

    update(current_dataset, 0, graph_info)
  })

  update(datasets[0], 0, graph_info)

  var RadarChart = {
  draw: function(id, d, cfg){

	var total = d.length-1;
	var radius = Math.min(cfg.w/2, cfg.h/2);
	var Format = d3.format(".1f");
  var lines = [0,1,2]

	var g = d3.select("#Rader_chart")
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
    .on("click", function(d, i){
      update(datasets[i], i, graph_info)
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
var d = ["CO2 Emmisionss","Waste Generation","Animal production","Deforestation"];

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

  var svg = d3.select("#Rader_chart")
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
