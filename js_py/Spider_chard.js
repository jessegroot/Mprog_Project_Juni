function sliders() {

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

    europeanmap.transition()
        .duration(10)
      .transition()
        .attr("fill", function(path) {
          a = 255/5*slider1
          b = 255/5*slider2
          c = 255/5*slider3
          return "rgba("+a +","+ b+","+ c+ ", 1)"
        });
  }
}
