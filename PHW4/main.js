d3.csv('cereal.csv', function(data) {

//**********************************************************************
//Key Variables
//**********************************************************************

    var margin = {top: 30, right: 30, bottom: 60, left: 60}

    var height = 400 - margin.top - margin.bottom,
        width = 500 - margin.left - margin.right;

    var manu = []; //keeps track of all the manufacturers
    var brands = [] //keeps track of all the brands

    var color = '#B58929';
    var tempColor;


//**********************************************************************
//Organizing Data
//**********************************************************************
    for (var i = 0; i < data.length; i++) {
        var manufacturer = data[i].Manufacturer;
        if (manu.indexOf(manufacturer) == -1) {
            manu.push(manufacturer)
            brands.push([]);
            brands[brands.length - 1].push(data[i]);
        }
        else {
            var index = manu.indexOf(manufacturer);
            brands[index].push(data[i]);
        }
    }

    var calories = [];
    var maxCalories = -1;
    for (m in brands) {
        var sum = 0;
        for (b in brands[m]) {
            sum += Number(brands[m][b].Calories);
            if (Number(brands[m][b].Calories) > maxCalories) maxCalories = Number(brands[m][b].Calories);
        }
        calories[m] = Math.round(sum / brands[m].length);
    }

    console.log(brands);

//**********************************************************************
//Bar Graph Scales
//**********************************************************************
    var yScaleBar = d3.scale.linear()
        .domain([40, maxCalories])
        .range([0, height]);

    var xScaleBar = d3.scale.ordinal()
        .domain(d3.range(0, manu.length))
        .rangeRoundBands([0, width], 0.1)

    var vGuideScaleBar = d3.scale.linear()
        .domain([40, maxCalories])
        .range([height, 0])

    var vAxisBar = d3.svg.axis()
        .scale(vGuideScaleBar)
        .orient('left')
        .ticks(10)

    var hAxisBar = d3.svg.axis()
        .scale(xScaleBar)
        .orient('bottom')


//**********************************************************************
//Bar Graph
//**********************************************************************
    var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0)

    var myChart = d3.select('#chart')
        .append('svg')
        .style('background', '#E7E0CB')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .selectAll('rect').data(calories)
        .enter().append('rect')
        .style('fill', color)
        .attr('width', xScaleBar.rangeBand())
        .attr('x', function (d, i) {
            return xScaleBar(i);
        })
        .attr('height', 0)
        .attr('y', height)

        .on('mouseover', function (d) {
            tooltip.transition()
                .style('opacity', .9)

            tooltip.html(d)
                .style('left', (d3.event.pageX - 35) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px')


            tempColor = this.style.fill;
            d3.select(this)
                .style('opacity', .5)
                .style('fill', 'green')
        })

        .on('mouseout', function (d) {
            tooltip.transition()
                .style('opacity', 0)

            d3.select(this)
                .style('opacity', 1)
                .style('fill', tempColor)
        })
        .on('click', function (d,i) {
            d3.select('#chart').select('svg').selectAll('rect')
                .style('fill', color)
            var current = manu[i];
            svg.selectAll('circle').transition()
                .style('opacity', function(c){
                    if (c.Manufacturer === current) return 1;
                    else return 0.25;
                })
                .delay(function(b,i){
                    return i * 8;
                })
                .duration(150)
        })

    myChart.transition()
        .attr('height', function (d) {
            return yScaleBar(d);
        })
        .attr('y', function (d) {
            return height - yScaleBar(d);
        })
        .delay(function (d, i) {
            return i * 20;
        })
        .duration(150)
        .ease('elastic')

    var vGuide = d3.select('svg').append('g')
    vAxisBar(vGuide)
    vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    vGuide.selectAll('path')
        .style({fill: 'none', stroke: "#000"})
    vGuide.selectAll('line')
        .style({stroke: "#000"})


    var hGuide = d3.select('svg').append('g')
    hAxisBar(hGuide)
    hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
    hGuide.selectAll('path')
        .style({fill: 'none', stroke: "#000"})
    hGuide.selectAll('line')
        .style({stroke: "#000"})
    hGuide.selectAll('text')
        .text(function (d) {
            return manu[d];
        })
        //.attr('transform', 'rotate(-45)')
    hGuide.append("text")
        .attr("class", "label")
        .attr("x", width/2 + 40)
        .attr("y", 50)
        .attr("fill", "black")
        .style("text-anchor", "end")
        .text("Manufacturer");

//**********************************************************************
//Scatter Plot Scales and Variables
//**********************************************************************
    // pre-cursors
    var sizeForCircle = function (d) {
        return 5*Number(d['Serving Size Weight']);
    }

    // setup x
    var xValue = function (d) {
            return Number(d.Sugars);
        }, // data -> value
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = function (d) {
            return xScale(xValue(d));
        }, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    // setup y
    var yValue = function (d) {
            return Number(d.Calories);
        }, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function (d) {
            return yScale(yValue(d));
        }, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    // setup fill color
    var cValue = function (d) {
            return d.Manufacturer;
        },
        scatterColor = d3.scale.category10();


    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
    yScale.domain([d3.min(data, yValue) - 10, d3.max(data, yValue)]);



//**********************************************************************
//Scatter Plot Scales and Variables
//**********************************************************************
    //adding a gap between the two graphs
    d3.select('#chart').append("svg")
        .style('background', '#FFFFFF')
        .attr("width", 20)
        .attr("height", height + margin.top + margin.bottom)

    // add the graph canvas to the body of the webpage
    var svg = d3.select('#chart').append("svg")
        .style('background', '#E7E0CB')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    var tooltip2 = d3.select("body").append("div")
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0)

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .attr("fill", "white")
        .call(xAxis)
        .append("text")
            .attr("class", "label")
            .attr("x", width/2)
            .attr("y", 40)
            .attr("fill", "white")
            .style("text-anchor", "end")
            .text("Sugars");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("fill", "white")
        .call(yAxis)
        .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("fill", "white")
            .style("text-anchor", "end")
            .text("Calories");

    var plot = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 0)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) { return scatterColor(cValue(d));})
            .on("mouseover", function(d) {
                tooltip2
                    .style("opacity", 1)
                    .html(d["Cereal Name"] + "<br/>" + d["Calories"] + "<br/>" + d["Sugars"])
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY + 5) + "px");

            })
            .on("mouseout", function() {
                tooltip2
                    .style("opacity", 0);

            })
            .on('click', function (d) {
                svg.selectAll('circle')
                    .style('opacity', 1)

                //console.log("current is " + d.Calories);
                var current = Number(d.Calories);
                d3.select('#chart').select('svg').selectAll('rect').transition()
                    .style('fill', function(f){
                        console.log(f);
                        if (f > current) return 'red';
                        else return color;
                    })
                    .delay(function(b,i){
                        return i * 50;
                    })
                    .duration(500)
            })

    plot.transition()
        .attr('r', sizeForCircle)
        .delay(function (d, i) {
            //console.log(d);
            return i * 20;
        })
        .duration(300)
        .ease('elastic')

    // draw legend
    var legend = svg.selectAll(".legend")
        .data(scatterColor.domain())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 165) + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", scatterColor);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("fill", "white")
        .style("text-anchor", "end")
        .text(function(d) { return d;});







});