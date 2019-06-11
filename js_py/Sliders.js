function sliders() {
  for (i = 1; i < 5; i++) {

    var obj()"slider"+i]= d3.sliderHorizontal()
        .min(0)
        .max(10)
        .step(1)
        .width(300)
        .displayValue(false)
        .on('onchange', function(val) {
          time = i
          console.log(val)
          console.log(time)
        });

    d3.select(`#slider-${i}`)
      .append('svg')
      .attr('width', 500)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(30,30)')
      .call(slider+i);
  }
}
