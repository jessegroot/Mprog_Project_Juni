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
//     .attr("id", "titles")
//     .attr("transform","translate( " + (width/2+margin.left) + "," + (margin.top - 10) + ")")
//     .style("text-anchor", "middle")
//     .text("CO2 Emmisions in tons per capita");
//
//   canvasBarchard.append("text")
//     .attr("id", "y_axis")
//     .attr("transform","translate( 30 ," + (margin.top + height/2) + ") rotate(-90)")
//     .style("text-anchor", "middle")
//     .text("CO2 Emmisions in tons per capita");
//
//   x_axis_data = []
//   datasets = [[],[],[],[]]
//
//   for (let item in json) {
//      x_axis_data.push(item)
//      if (json[item]["Forest_ratio"]["value"] != "N/A") {
//        datasets[3].push({name: item, value: json[item]["Forest_ratio"]["value"]})
//      }
//      if (json[item]["CO2_capita"]["value"] != "N/A") {
//        datasets[0].push({name: item, value: json[item]["CO2_capita"]["value"]})
//      }
//      if (json[item]["Animals_capita"]["value"] != "N/A") {
//        datasets[2].push({name: item, value: json[item]["Animals_capita"]["value"]})
//      }
//      if (json[item]["Waste_capita"]["value"] != "N/A") {
//        datasets[1].push({name: item, value: json[item]["Waste_capita"]["value"]})
//      }
//   }
//
//   for (let i = 0; i < datasets.length; i++){
//     datasets[i].sort((a, b) => b.value - a.value);
//   }
//
//   bar_info = {
//     data: datasets,
//     svg: canvasBarchard,
//     margins: margin,
//     width: width,
//     height: height
//   }
//
//   // update_barchard(datasets, canvasBarchard, margin, width, height)
//   return update_barchard(json, bar_info)
// }
//
// function update_barchard(json, datasets, canvasBarchard, margin='50px', width, height) {
//   console.log(datasets)
//
//   // console.log(d3.select("#Bar_chard").select("svg"))
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
//   //
//   // // make the width that one land takes in barchard
//   // var bandWidth = width / datasets[0].length
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
//   var current_dataset;
//   graph_info = {
//     titles: ["CO2 emmisions per Capita","Waste gerneration per Capita","Animals produced per Capita","Intencity of wood use per country"],
//     y_axis: ["In 1000 KG per year","kilo grams per year","Amount of animals per year","Wood use ratio (1 max 0 nothing)"]
//   }
//
//   // A function that create / update the plot for a given variable:
//   function update(data, type, graph_info) {
//
//     var title = d3.select("#Bar_chard").select("#titles")
//       .transition()
//       .text(graph_info["titles"][type])
//
//     var y_axis = d3.select("#Bar_chard").select("#y_axis")
//       .transition()
//       .text(graph_info["y_axis"][type])
//
//     current_dataset = data
//
//     // Update the X axis
//     x.domain(data.map(function(d) { return d.name; }))
//     xAxis.transition().duration(1000).call(d3.axisBottom(x))
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
//     // If less group in the new dataset, I delete the ones not in use anymore
//     bars
//       .exit()
//       .remove()
//   }
//
//   var dropdown = d3.select("#Bar_div").select("#Dropdown")
//
//   dropdown.on("change", function(){
//     // Find what was selected from the dropdown
//  		var selected = d3.select("#Dropdown").node().value
//
//     if (selected == "Alphabetical") {
//       current_dataset.sort((a, b) => a.name.localeCompare(b.name));
//       for (let i = 0; i < datasets.length; i++){
//         datasets[i].sort((a, b) => a.name.localeCompare(b.name));
//       }
//     }
//     if (selected == "Desending") {
//       current_dataset.sort((a, b) => b.value - a.value);
//       for (let i = 0; i < datasets.length; i++){
//         datasets[i].sort((a, b) => b.value - a.value);
//       }
//     }
//     if (selected == "At Rank") {
//       current_dataset.sort((a, b) => a.value - b.value);
//       for (let i = 0; i < datasets.length; i++){
//         datasets[i].sort((a, b) => a.value - b.value);
//       }
//     }
//
//     update(current_dataset, 0, graph_info)
//   })
//
//   update(datasets[0], 0, graph_info)
// }
