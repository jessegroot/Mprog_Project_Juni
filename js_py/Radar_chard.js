function bar_chard(json) {

  // size of bargraph and margins
  var canvasBarchardWidth = 900,
      canvasBarchardHeight = 400,
      margin = { top: 30, right: 80, bottom: 80, left: 60 };

  // make width and height for graph (exluding space for labels)
  var width = canvasBarchardWidth - (margin.left + margin.right);
  var height = canvasBarchardHeight - (margin.bottom + margin.top);

  // make canvasBarchard in correct place for barchard
  canvasBarchard = d3.select("#Bar_chard")
    .append("svg")
    .attr("width", canvasBarchardWidth)
    .attr("height", canvasBarchardHeight);

  // Title BarChard
  canvasBarchard.append("text")
    .attr("transform","translate( " + (width/2+margin.left) + "," + (margin.top - 10) + ")")
    .style("text-anchor", "middle")
    .text("CO2 Emmisions in tons per capita");

  x_axis_data = []
  datasets = [[],[],[],[]]

  for (let item in json) {
     x_axis_data.push(item)
     if (json[item]["CO2_capita"]["value"] != "N/A") {
       datasets[0].push({name: item, value: json[item]["CO2_capita"]["value"]})
     }
     if (json[item]["Waste_capita"]["value"] != "N/A") {
       datasets[1].push({name: item, value: json[item]["Waste_capita"]["value"]})
     }
     if (json[item]["Animals_capita"]["value"] != "N/A") {
       datasets[2].push({name: item, value: json[item]["Animals_capita"]["value"]})
     }
     if (json[item]["Forest_ratio"]["value"] != "N/A") {
       datasets[3].push({name: item, value: json[item]["Forest_ratio"]["value"]})
     }
  }

  // function compare( a, b ) {
  // if ( a.value < b.value ){
  //   return 1;
  // }
  // if ( a.value > b.value ){
  //   return -1;
  // }
  //   return 0;
  // }

  for (let i = 0; i < datasets.length; i++){
    datasets[i].sort((a, b) => b.value - a.value);
  }

  // update_barchard(datasets, canvasBarchard, margin, width, height)
  return radar_chard(json, datasets, canvasBarchard, margin, width, height)
}

function radar_chard(json, datasets, canvasBarchard, margin, width, height) {

  console.log(datasets)

  // make a scale for the xAxis
  x = d3.scaleBand()
    .domain(datasets[0].map(d => d.name))
    .range([margin.left, width + margin.left])
    .padding(0.1)

  // make a scale for the yAxis
  y = d3.scaleLinear()
    .domain([0, d3.max(datasets[0], d => d.value)]).nice()
    .range([height + margin.top, margin.top])

  // make the width that one land takes in barchard
  var bandWidth = width / datasets[0].length

  // Initialize the X axis
  var x = d3.scaleBand()
    .range([ margin.left, width + margin.left ])
    .padding(0.1);
  var xAxis = canvasBarchard.append("g")
    .attr("transform", "translate(0," + (height + margin.top) + ")")

  // Initialize the Y axis
  var y = d3.scaleLinear()
    .range([ height + margin.top, margin.top]);
  var yAxis = canvasBarchard.append("g")
    .attr("transform", "translate("+ margin.left +", 0)")

  var current_dataset;

  // A function that create / update the plot for a given variable:
  function update(data) {

    current_dataset = data

    // Update the X axis
    x.domain(data.map(function(d) { return d.name; }))
    xAxis.transition().duration(1000).call(d3.axisBottom(x))
      .selectAll("text")
        .attr("y", 10)
        .attr("x", 10)
        .attr("dy", ".35em")
        .attr("transform", "rotate(60)")
        .style("text-anchor", "start");

    // Update the Y axis
    y.domain([0, d3.max(data, function(d) { return d.value }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Create the u variable
    var bars = d3.select("#Bar_chard").select("svg").selectAll("rect")
      .data(data)

    bars
      .enter()
      .append("rect") // Add a new rect for each new elements
      .merge(bars) // get the already existing elements as well
      .transition() // and apply changes to all of them
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

  options = ["Alphabetical", "Desending", "At Rank"]
  // Create a dropdown
  var dropdown = d3.select("#Bar_div").select("#Dropdown")

  dropdown
		.append("select")
		.selectAll("option")
        .data(options)
        .enter()
        .append("option")
        .attr("value", function(d){
            return d;
        })
        .text(function(d){
            return d;
        })

  d3.select("#selected-dropdown").text("first");

  dropdown.on("change", function(){
    // Find what was selected from the dropdown
 		var selected = d3.select("#Dropdown").node().value

    if (selected == "Alphabetical") {
      current_dataset.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (selected == "Desending") {
      current_dataset.sort((a, b) => b.value - a.value);
    }
    if (selected == "At Rank") {
      current_dataset.sort((a, b) => a.value - b.value);
    }

    update(current_dataset)
  })

  update(datasets[2])

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
    .on("click", function(d, i){
      update(datasets[i])
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
