// Name: Jesse Groot
// Student number: 11012579

/**
Makes the sliders, ranking and transitions the color of the european map
**/

function sliders(json) {

  // the sliders
  var items = []

  // for the amount of sliders
  for (var i = 1; i < 5; i++) {

    // create slider
    var slider = d3.sliderHorizontal()
        .min(0)
        .max(5)
        .step(1)
        .width(150)
        .ticks(5)
        .displayValue(true)
        // onchange call function
        .on('onchange', function() {
          transitioncolor(items[0].value(), items[1].value(), items[2].value(), items[3].value())
        });

    // select slider location on page and call slider
    d3.select(`#slider-${i}`)
      .append('svg')
      .attr('width', 500)
      .attr('height', 100)
      .attr("id", "slider"+i)
      .append('g')
      .attr('transform', 'translate(30,30)')
      .call(slider);

    // push slider in items
    items.push(slider)
  }

  function transitioncolor(slider1, slider2, slider3, slider4) {

    // get the european map and the individal countries
    var european_map = d3.select("#European_map").selectAll("path")
    var path = d3.select("#European_map").selectAll("d")

    // make the posible variables and the sliders that correlate to them in the same order
    var catogories = ["Forest_ratio", "CO2_capita", "Animals_capita", "Waste_capita"]
    var sliders = [slider1, slider2, slider3, slider4]

    // calculate the total value of all the sliders together
    var slider_total = sliders.reduce((a, b) => a + b, 0)

    // variable how manny sliders are off and array with the sliders that are used.
    var slider_off = 0
    var use_cat = []
    var use_slider = []

    // the countries that are colored
    clickable = []
    var ranking = []

    // calculate how manny sliders are off and which are used
    for (let i = 0; i < 4; i++){
      if (sliders[i] == 0){
        slider_off += 1
      }
      else {
        use_cat.push(catogories[i])
        use_slider.push(sliders[i])
      }
    }

    //  update european map
    european_map.transition()
        .duration(10)
      .transition()
        .attr("fill", function(path) {
          // if there is data for the countries
          if (path.properties.NAME in json){
            var factors = []
            var variables = 0
            // for every catogorie check if there is data of the specific country
            for (let i = 0; i < use_cat.length; i++){
              // push 0 if there is no data and 1 if there is
              if (json[path.properties.NAME][use_cat[i]]["scale"] == "N/A"){
                factors.push(0)
              }
              else {
                factors.push(1)
                variables += 1
              }
            }
            // if one datapoint is missing or no datapoints are selected color gray
            if (factors.includes(0) == true || factors.length < 1) {
              return "rgb(169,169,169)"
            }
            else {
              // color scale works from 0 to 1 min color in graph = 0.2
              var color = 0.2
              //  0.8 devided with the sum score of the sliders
              var ammount = 0.8/slider_total
              for (let i = 0; i < use_cat.length; i++){
                // ammount / scale * the weight of the slider
                color += ammount/1000*json[path.properties.NAME][use_cat[i]]["scale"]*use_slider[i]
              }
              // make the colored country clickable
              clickable.push(path.properties.NAME)
              ranking.push({name: path.properties.NAME, rank: color})

              // color country
              return d3.interpolateBlues(color)
            }
          }
          // if country not in JSON color it
          return "rgb(169,169,169)"
        })

    function make_ranking(ranking) {

      // remove the ranking
      d3.select("body").select("#Ranking").select("ol").remove()

      // sort the ranking in order
      ranking.sort((a, b) => b.rank - a.rank);

      // append the text to html
      d3.select("body").select("#Ranking").append("ol").selectAll("h7")
        .data(ranking.splice(0,10))
        .enter()
        .append("li")
        .append("h7")
        .text(function(d){
          return d.name
        })

    }

    make_ranking(ranking)

  }
}
