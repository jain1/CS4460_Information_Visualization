d3.csv('cereal.csv', function(bardata) {

    //**********************************************************************
    //Key Variables
    //**********************************************************************
    var margin = { top: 30, right: 30, bottom: 40, left:50 }

    var height = 400 - margin.top - margin.bottom,
        width = 600 - margin.left - margin.right;

    var manu = []; //keeps track of all the manufacturers
    var brands = [] //keeps track of all the brands


    //**********************************************************************
    //Organizing Data
    //**********************************************************************
    for (var i = 0; i < bardata.length; i++){
        var manufacturer = bardata[i].Manufacturer;
        if (manu.indexOf(manufacturer) == -1){
            manu.push(manufacturer)
            brands.push([]);
            brands[brands.length-1].push(bardata[i]);
        }
        else {
            var index = manu.indexOf(manufacturer);
            brands[index].push(bardata[i]);
        }
    }

    var calories = [];
    var maxCalories = -1;
    for (m in brands){
        var sum = 0;
        for (b in brands[m]){
            sum += Number(brands[m][b].Calories);
        }
        calories[m] = Math.round(sum / brands[m].length);
        if (calories[m] > maxCalories) maxCalories = calories[m];
    }

    //**********************************************************************
    //Scales
    //**********************************************************************
    var yScaleBar = d3.scale.linear()
        .domain([0, maxCalories])
        .range([0, height]);

    var xScaleBar = d3.scale.ordinal()
        .domain(d3.range(0, manu.length))
        .rangeBands([0, width], 0.1)


    //**********************************************************************
    //Bar Graph
    //**********************************************************************
    var myChart = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#C9D7D6')
        .selectAll('rect').data(calories)
        .enter().append('rect')
        .style('fill', 'yellow')
        .attr('width', xScaleBar.rangeBand())
        .attr('height', 0)
        .attr('x', function(d,i) {
            return xScale(i);
        })
        .attr('y', height)

        .on('mouseover', function(d) {
            tempColor = this.style.fill;
            d3.select(this)
                .style('opacity', .5)
                .style('fill', 'yellow')
        })

        .on('mouseout', function(d) {
            d3.select(this)
                .style('opacity', 1)
                .style('fill', tempColor)
        })

    myChart.transition()
        .attr('height', function(d) {
            return yScale(d);
        })
        .attr('y', function(d) {
            return height - yScale(d);
        })
        .delay(function(d,i){
            return i * 15;
        })
        .duration(1000)
        .ease('elastic')


});