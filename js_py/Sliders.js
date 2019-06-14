function sliders(json) {

  var items = []

  for (var i = 1; i < 5; i++) {

    var slider = d3.sliderHorizontal()
        .min(0)
        .max(5)
        .step(1)
        .width(300)
        .ticks(5)
        .displayValue(false)
        .on('onchange', function() {
          transitionCollour(items[0].value(), items[1].value(), items[2].value(), items[3].value())
        });

    d3.select(`#slider-${i}`)
      .append('svg')
      .attr('width', 500)
      .attr('height', 100)
      .attr("id", "slider"+i)
      .append('g')
      .attr('transform', 'translate(30,30)')
      .call(slider);

    items.push(slider)
  }

  function transitionCollour(slider1, slider2, slider3, slider4) {

    europeanmap = d3.select("#European_map").selectAll("path")
    path = d3.select("#European_map").selectAll("d")

    var catogories = ["Forest_ratio", "CO2_capita", "Animals_capita", "Waste_capita"]
    var sliders = [slider1, slider2, slider3, slider4]
    var slider_total = sliders.reduce((a, b) => a + b, 0)
    console.log(slider_total)

    var slider_off = 0
    var use_cat = []
    var use_slider = []

    for (let i = 0; i < 4; i++){
      if (sliders[i] == 0){
        slider_off += 1
      }
      else {
        use_cat.push(catogories[i])
        use_slider.push(sliders[i])
      }
    }

    europeanmap.transition()
        .duration(10)
      .transition()
        .attr("fill", function(path) {
          if (path.properties.NAME in json){
            factors = []
            variables = 0
            for (let i = 0; i < use_cat.length; i++){
              if (json[path.properties.NAME][catogories[i]]["scale"] == "N/A"){
                factors.push(0)
              }
              else {
                factors.push(1)
                variables += 1
              }
            }
            if (factors.includes(1) == true) {
              collour = 0.2
              ammount = 0.8/slider_total
              for (let i = 0; i < use_cat.length; i++){
                if (factors[i] == 1) {
                  collour += ammount/1000*json[path.properties.NAME][use_cat[i]]["scale"]*use_slider[i]
                }
              }
              return d3.interpolateBlues(collour)
            }
            else {
              return "rgb(169,169,169)"
            }
            // else {
            //   for
            //   val1 = json[path.properties.NAME]["Forest_ratio"]["scale"]/1000*0.25 * slider1
            //   val2 = json[path.properties.NAME]["CO2_capita"]["scale"]/1000*0.25 * slider2
            //   val3 = json[path.properties.NAME]["Animals_capita"]["scale"]/1000*0.25 * slider3
            //   val4 = json[path.properties.NAME]["Waste_capita"]["scale"]/1000*0.25 * slider4
            //   return d3.interpolateBlues((1 + (val1+val2+val3+val4)*0.8)/def_rate)
            // }
          }
          return "rgb(169,169,169)"

          // totalslide = slider1 + slider2 + slider3 + slider4
          // return d3.interpolateBlues((1 + slider1*0.8)/5)
          // return "rgba("+a +","+ b+","+ c+ ", 1)"
        });
  }
}
