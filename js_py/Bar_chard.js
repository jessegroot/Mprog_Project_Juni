function bar_chard(json) {

  // size of bargraph and margins
  var canvasBarchardWidth = 900,
      canvasBarchardHeight = 400,
      margin = { top: 30, right: 80, bottom: 50, left: 60 };

  // make width and height for graph (exluding space for labels)
  var width = canvasBarchardWidth - margin.left - margin.right;
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

  function compare( a, b ) {
  if ( a.value < b.value ){
    return 1;
  }
  if ( a.value > b.value ){
    return -1;
  }
    return 0;
  }

  datasets[0].sort( compare );

  console.log(datasets[0])

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
  var bandWidth = width / datasets[0].length - 1

  // // make the x and y axis
  // var xAxis = d3.axisBottom()
  //   .scale(x)
  //   .tickFormat(function(d) { return d; })
  //     // // makes sure every land gets an label
  //     // .ticks(datasets[0].length);
  //
  // var yAxis = d3.axisLeft()
  //   .scale(y);

  // Initialize the X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .padding(0.2);
  var xAxis = canvasBarchard.append("g")
    .attr("transform", "translate(0," + height + ")")

  // Initialize the Y axis
  var y = d3.scaleLinear()
    .range([ height, 0]);
  var yAxis = canvasBarchard.append("g")
    .attr("class", "myYaxis")

  // // call xAxis
  // canvasBarchard.append("g")
  //   .attr("transform", "translate( 0," + (height + margin.top) + ")")
  //   .call(xAxis)
  //     // append the text rotated with 60 degrees on the correct spot
  //     .selectAll("text")
  //       .attr("y", -2)
  //       .attr("x", 7)
  //       .attr("dy", ".35em")
  //       .attr("transform", "rotate(60)")
  //       .style("text-anchor", "start");

  // // call yAxis
  // var axis = canvasBarchard.append("g")
  //   .attr("transform", "translate( "+ (margin.left) +", 0)")
  //   .call(yAxis);


  // A function that create / update the plot for a given variable:
  function update(data) {

    console.log("pizzas")

    // Update the X axis
    x.domain(data.map(function(d) { return d.name; }))
    xAxis.call(d3.axisBottom(x))

    // Update the Y axis
    y.domain([0, d3.max(data, function(d) { return d.value }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    console.log("pizzas")

    // Create the u variable
    var bars = d3.select("#Bar_chard").select("svg").selectAll("rect")
      .data(data)

    console.log("pizzas")

    bars
      .enter()
      .append("rect") // Add a new rect for each new elements
      .merge(bars) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(1000)
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", "#69b3a2")

    // If less group in the new dataset, I delete the ones not in use anymore
    u
      .exit()
      .remove()
  }

  update(datasets[0])

  //
  // var margin = {top: 20, right: 20, bottom: 70, left: 40},
  //   width = 600 - margin.left - margin.right,
  //   height = 300 - margin.top - margin.bottom;
  //
  // var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
  //
  // var y = d3.scale.linear().range([height, 0]);
  //
  // var xAxis = d3.svg.axis()
  //     .scale(x)
  //     .orient("bottom")
  //     .tickFormat(d3.time.format("%Y-%m"));
  //
  // var yAxis = d3.svg.axis()
  //     .scale(y)
  //     .orient("left")
  //     .ticks(10);
  //
  // var svg = d3.select("body").append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //     .attr("transform",
  //           "translate(" + margin.left + "," + margin.top + ")");
  //
  // d3.csv("bar-data.csv", function(error, data) {
  //
  //     data.forEach(function(d) {
  //         d.date = parseDate(d.date);
  //         d.value = +d.value;
  //     });
  //
  //   x.domain(data.map(function(d) { return d.date; }));
  //   y.domain([0, d3.max(data, function(d) { return d.value; })]);
  //
  //   svg.append("g")
  //       .attr("class", "x axis")
  //       .attr("transform", "translate(0," + height + ")")
  //       .call(xAxis)
  //     .selectAll("text")
  //       .style("text-anchor", "end")
  //       .attr("dx", "-.8em")
  //       .attr("dy", "-.55em")
  //       .attr("transform", "rotate(-90)" );
  //
  //   svg.append("g")
  //       .attr("class", "y axis")
  //       .call(yAxis)
  //     .append("text")
  //       .attr("transform", "rotate(-90)")
  //       .attr("y", 6)
  //       .attr("dy", ".71em")
  //       .style("text-anchor", "end")
  //       .text("Value ($)");
  //
  //   svg.selectAll("bar")
  //       .data(data)
  //     .enter().append("rect")
  //       .style("fill", "steelblue")
  //       .attr("x", function(d) { return x(d.date); })
  //       .attr("width", x.rangeBand())
  //       .attr("y", function(d) { return y(d.value); })
  //       .attr("height", function(d) { return height - y(d.value); });
  // })
}

function update_barchard(type) {
  console.log(type)
}
