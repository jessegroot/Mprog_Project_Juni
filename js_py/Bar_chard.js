// function bar_chard(json) {
//
//   // size of bargraph and margins
//   var canvasBarchardWidth = 900,
//       canvasBarchardHeight = 400,
//       margin = { top: 30, right: 80, bottom: 80, left: 60 };
//
//   // make width and height for graph (exluding space for labels)
//   var width = canvasBarchardWidth - (margin.left + margin.right);
//   var height = canvasBarchardHeight - (margin.bottom + margin.top);
//
//   // make canvasBarchard in correct place for barchard
//   canvasBarchard = d3.select("#Bar_chard")
//     .append("svg")
//     .attr("width", canvasBarchardWidth)
//     .attr("height", canvasBarchardHeight);
//
//   // Title BarChard
//   canvasBarchard.append("text")
//     .attr("transform","translate( " + (width/2+margin.left) + "," + (margin.top - 10) + ")")
//     .style("text-anchor", "middle")
//     .text("CO2 Emmisions in tons per capita");
//
//   x_axis_data = []
//   datasets = [[],[],[],[]]
//
//   for (let item in json) {
//      x_axis_data.push(item)
//      if (json[item]["CO2_capita"]["value"] != "N/A") {
//        datasets[0].push({name: item, value: json[item]["CO2_capita"]["value"]})
//      }
//      if (json[item]["Waste_capita"]["value"] != "N/A") {
//        datasets[1].push({name: item, value: json[item]["Waste_capita"]["value"]})
//      }
//      if (json[item]["Animals_capita"]["value"] != "N/A") {
//        datasets[2].push({name: item, value: json[item]["Animals_capita"]["value"]})
//      }
//      if (json[item]["Forest_ratio"]["value"] != "N/A") {
//        datasets[3].push({name: item, value: json[item]["Forest_ratio"]["value"]})
//      }
//   }
//
//   function compare( a, b ) {
//   if ( a.value < b.value ){
//     return 1;
//   }
//   if ( a.value > b.value ){
//     return -1;
//   }
//     return 0;
//   }
//
//   datasets[0].sort(compare);
//
//   update_barchard(datasets, canvasBarchard, margin, width, height)
//
// }
//
// function update_barchard(datasets, canvasBarchard, margin, width, height) {
//
//   // make a scale for the xAxis
//   x = d3.scaleBand()
//     .domain(datasets[0].map(d => d.name))
//     .range([margin.left, width + margin.left])
//     .padding(0.1)
//
//   // make a scale for the yAxis
//   y = d3.scaleLinear()
//     .domain([0, d3.max(datasets[0], d => d.value)]).nice()
//     .range([height + margin.top, margin.top])
//
//   // make the width that one land takes in barchard
//   var bandWidth = width / datasets[0].length
//
//   // Initialize the X axis
//   var x = d3.scaleBand()
//     .range([ margin.left, width + margin.left ])
//     .padding(0.1);
//   var xAxis = canvasBarchard.append("g")
//     .attr("transform", "translate(0," + (height + margin.top) + ")")
//
//   // Initialize the Y axis
//   var y = d3.scaleLinear()
//     .range([ height + margin.top, margin.top]);
//   var yAxis = canvasBarchard.append("g")
//     .attr("transform", "translate("+ margin.left +", 0)")
//
//   // A function that create / update the plot for a given variable:
//   function update(data) {
//
//     // Update the X axis
//     x.domain(data.map(function(d) { return d.name; }))
//     xAxis.call(d3.axisBottom(x))
//       .selectAll("text")
//         .attr("y", 10)
//         .attr("x", 10)
//         .attr("dy", ".35em")
//         .attr("transform", "rotate(60)")
//         .style("text-anchor", "start");
//
//     // Update the Y axis
//     y.domain([0, d3.max(data, function(d) { return d.value }) ]);
//     yAxis.transition().duration(1000).call(d3.axisLeft(y));
//
//     // Create the u variable
//     var bars = d3.select("#Bar_chard").select("svg").selectAll("rect")
//       .data(data)
//
//     bars
//       .enter()
//       .append("rect") // Add a new rect for each new elements
//       .merge(bars) // get the already existing elements as well
//       .transition() // and apply changes to all of them
//       .duration(1000)
//         .attr("x", function(d) { return x(d.name); })
//         .attr("y", function(d) { return y(d.value); })
//         .attr("width", x.bandwidth())
//         .attr("height", function(d) { return (height+ margin.top) - y(d.value); })
//         .attr("fill", "#69b3a2")
//
//
//
//
//     // If less group in the new dataset, I delete the ones not in use anymore
//     bars
//       .exit()
//       .remove()
//
//     return update
//   }
//
//   update(datasets[2])
// }
