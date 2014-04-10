
var svgWidth = 750;
var svgHeight = 540;
var tooltipPositionX, tooltipPositionY;
var tooltip;
var svg;

var headingGroup, descGroup1, descGroup2, descGroup3;
var heading, headingIcon;
var descValue1, descValue2, descValue3;

// general chart details
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width = 750 - margin.left - margin.right;
var height = 200 - margin.top - margin.bottom;

// line chart data
var dataset1;
var lineChartGroup;
var path1;
var line1;
var xScale, yScale;
var xDomainLine;


$(document).ready(function(){
	
	tooltip = d3.select("body")
		.append("div")
		.attr("id", "tooltip")
		.style("position", "absolute")
		.style("visibility", "hidden");
	
	svg = d3.select("#drawarea")
		.append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight)
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("xlink", "http://www.w3.org/1999/xlink");
		
	headingGroup = svg.append("g");
	descGroup1 = svg.append("g");
	descGroup2 = svg.append("g");
	descGroup3 = svg.append("g");
	
	heading = headingGroup.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-size", "36px")
		.attr("fill", "black")
		.attr("x", 12)
		.attr("y", 36);
		
	headingIcon = headingGroup.append("image")
		.attr("x", 600)
		.attr("y", 4)
		.attr("width", 100)
		.attr("height", 100);
	
	descGroup1.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-size", "12px")
		.attr("fill", "black")
		.attr("x", 24)
		.attr("y", 72)
		.text("Number of people");
		
	descValue1 = descGroup1.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-size", "12px")
		.attr("font-weight", "bold")
		.attr("fill", "black")
		.attr("x", 60)
		.attr("y", 92);
			
	descGroup2.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-size", "12px")
		.attr("fill", "black")
		.attr("x", 210)
		.attr("y", 72)
		.text("Number of publications");
		
	descValue2 = descGroup2.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-size", "12px")
		.attr("font-weight", "bold")
		.attr("fill", "black")
		.attr("x", 256)
		.attr("y", 92);
		
	descGroup3.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-size", "12px")
		.attr("fill", "black")
		.attr("x", 420)
		.attr("y", 72)
		.text("Number of patents: ");
		
	descValue3 = descGroup3.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-size", "12px")
		.attr("font-weight", "bold")
		.attr("fill", "black")
		.attr("x", 464)
		.attr("y", 92);
		
	//loadTextData("Natural Sciences", "natural-science.svg", 3242, 566, 12);	
	


	// -- line chart --
	//var dataset1 = [ 18, 16, 18, 24, 29, 30, 38, 34, 27, 32, 40, 35, 34, 30 ];
	dataset1 = getRandomArray(14, 20, 40);
	//var dataset2 = [ 14, 25, 23, 31, 38, 42, 48, 49, 56, 61, 68, 69, 71, 80 ];
	xDomainLine = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013"];
	
	lineChartGroup = svg.append("g")
		.attr("id", "lineChartGroup")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("transform", "translate(" + 40 + "," + 140 + ")");
	
	// add title to line chart
	lineChartGroup.append("text")
        .attr("x", (width / 2))				
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")	
        .style("font-size", "14px") 	
        .text("Number of Publications vs. Year");
	
	xScale = d3.scale.ordinal()
		.domain(xDomainLine)
		.rangeRoundBands([0, width], 1, 0.5);
	
	yScale = d3.scale.linear()
		.domain([0, d3.max(dataset1)])
		.range([height, 0]);
	
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");
	
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		//.tickValues([1, 2, 3, 5, 8, 13, 21]) // what values
		.ticks(5); // how many lines (ex: 5)
	
	line1 = d3.svg.line()
		.x(function(d, i) {
			return xScale(xDomainLine[i]);
		})
		.y(function(d, i) {
			return yScale(dataset1[i]);
		})
		.interpolate("linear"); // cardinal
		
	lineChartGroup.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
	
	// horizontal grid lines
	var rules = lineChartGroup.selectAll("g.rule")
		.data(yScale.ticks())
		.enter()
		.append("g")
		.attr("class", "rule");
		
	rules.append("line")
		.attr("y1", yScale)
		.attr("y2", yScale)
		.attr("x1", 0)
		.attr("x2", width);
		
	// vertical grid lines
	// var rules2 = lineChartGroup.selectAll("g.rule")
		// .data(xScale.ticks())
		// .enter()
		// .append("g")
		// .attr("class", "rule");
// 		
	// rules2.append("line")
		// .attr("x1", xScale)
		// .attr("x2", xScale)
		// .attr("y1", 30)
		// .attr("y2", height);
	
	// y axis
	lineChartGroup.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("No. of Publications");
	
	//drawLineChart();
		
	// path1.transition()
		// .duration(1000)
		// .ease("linear") // linear, circle, elastic, bounce
		// .attrTween("stroke-dasharray", tweenDash);
	
	//Do Transistion of Path
    // var totalLength = path1.node().getTotalLength();
    // path1
    	// .attr("stroke-dasharray", totalLength + ", " + totalLength)
        // .attr("stroke-dashoffset", totalLength)
        // .transition()
        // .duration(1000)
        // .ease("linear-in-out")
        // .attr("stroke-dashoffset", 0);
        
    // function transition(path) {
		// path.transition()
			// .duration(2500)
			// .attrTween("stroke-dasharray", tweenDash);
	// }
	

	var points1 = lineChartGroup.selectAll(".dot1")
	    .data(dataset1)
		.enter()
		.append("circle")
		.style("fill", "brown")
		.style("fill-opacity", 0)
		.style("stroke", "brown")
		.style("stroke-opacity", 0);
		
	points1.transition()
		.delay(1000)
		.attr("class", "dot")
		.attr("cx", line1.x())
	    .attr("cy", line1.y())
		.attr("r", 10)
		.style("stroke-width", 10 + "px");
		
	points1.on("mouseover", function(d, i){
		tooltipPositionX = d3.event.pageX + 10;
		tooltipPositionY = d3.event.pageY + 10;
		d3.select(this)
			.transition()
			.duration(500)
			.style("fill-opacity", 0.8);
			
		tooltip
			.style("left", tooltipPositionX + "px")
			.style("top", tooltipPositionY + "px")
			.transition()
			.delay(500)
			.style("visibility", "visible")
			.style("background-color", "brown")
			.text(xDomainLine[i] + " : " + d);
	})
	.on("mouseout", function(d, i){
		d3.select(this)
			.transition()
			.duration(500)
			.style("fill-opacity", 0);
			
		tooltip
			.transition()
			.duration(500)
			.style("visibility", "hidden");
	});
	
	
	loadTextData("Natural Sciences", "natural-science.svg", 3242, 566, 12);
    


    // -- bar chart --
    //var dataset2 = [ 14, 34, 21, 38, 19, 32 ];
    var dataset2 = getRandomArray(6, 20, 50);
    var xDomainBar = ["Natural sciences", "Engineering and technology", "Medical and Health sciences", "Agricultural sciences", "Social sciences", "Humanities"];
    var barPadding = 1;
    
    var barChartGroup = svg.append("g")
		.attr("id", "barChartGroup")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("transform", "translate(" + 40 + "," + 350 + ")");
    
    // add title to line chart
	barChartGroup.append("text")
        .attr("x", (width / 2))				
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")	
        .style("font-size", "14px") 	
        .text("Number of People vs.Categories");
        
    var xScaleBar = d3.scale.ordinal()
		.domain(xDomainBar)
		.rangeRoundBands([0, width], 0.1);
		
	var yScaleBar = d3.scale.linear()
		.domain([0, d3.max(dataset2)])
		.range([height, 0], 0.5);
    
    var xAxisBar = d3.svg.axis()
		.scale(xScaleBar)
		.orient("bottom");

	var yAxisBar = d3.svg.axis()
		.scale(yScaleBar)
		.orient("left")
		.ticks(10);
		
		
	barChartGroup.selectAll("rect")
		.data(dataset2)
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("rx", 10)
		.attr("ry", 10)
		.attr("x", function(d, i) {
			return xScaleBar(xDomainBar[i]); // <-- Set x values
		})
		.attr("width", xScaleBar.rangeBand())
		.attr("y", function(d) {
			return height;
		})
		.attr("height", 0)
		.attr("fill", "steelblue")
		.transition()
		.duration(1000)
		.ease("cubic-in-out") // linear, circle, elastic, bounce, cubic
		.attr("y", function(d, i){
			return yScaleBar(d);
		})
		.attr("height", function(d){
			return height - yScaleBar(d);
		})
		// .attr("fill", function(d) {
			// //return "rgb(" + (d * 2) + ", " + (d * 2) + ", " + (d * 2) + ")";
		// })
		.attr("fill", "steelblue");
    
    
    barChartGroup.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxisBar)
		.selectAll(".tick text")
		.call(wrap, xScaleBar.rangeBand());
	
	barChartGroup.append("g")
		.attr("class", "y axis")
		.call(yAxisBar)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("No. of People");
    
});

// load heading text data
function loadTextData (title, iconName, numPeople, numPubs, numPatents){
	// heading
	heading.text(title); // Natural Sciences
	
	// subject logo
	headingIcon.attr("xlink:href", "images/svg/" + iconName); // natural-science.svg
	
	// first description value
	descValue1.text(numPeople); // 1289
		
	// second description value
	descValue2.text(numPubs); // 374
	
	// third description value
	descValue3.text(numPatents); // 52
	
	//
	drawLineChart();
	//reDrawLineChart();
}

function drawLineChart(){
	path1 = lineChartGroup.append("path")
		.datum(dataset1)
		.attr("class", "line")
		.style("stroke", "brown")
		.attr("d", line1);
		//.call(transition)
		
	path1.transition()
		.duration(1000)
		.ease("linear") // linear, circle, elastic, bounce
		.attrTween("stroke-dasharray", tweenDash);
}

function reDrawLineChart(){
	dataset1 = getRandomArray(14, 20, 40);
	
	line1 = d3.svg.line()
		.x(function(d, i) {
			return xScale(xDomainLine[i]);
		})
		.y(function(d, i) {
			return yScale(dataset1[i]);
		})
		.interpolate("linear"); // cardinal
	
	path1 
		.datum(dataset1)
		.attr("class", "line")
		.style("stroke", "brown")
		.attr("d", line1);
		
	path1.transition()
		.duration(1000)
		.ease("linear") // linear, circle, elastic, bounce
		.attrTween("stroke-dasharray", tweenDash);
}

// function to animate line chart
function tweenDash() {
	var l = this.getTotalLength();
	var i = d3.interpolateString("0," + l, l + "," + l);
	return function(t) {
		return i(t);
	};
}

// function to wrap x axis tick lables
function wrap(text, width) {
	text.each(function() {
		var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.1, // ems
		y = text.attr("y"),
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
		
		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			}
		}
	});
}

// function to get random number array
function getRandomArray(arrLength, min, max){
	var randArr = new Array();
	for (var i=0; i < arrLength; i++) {
		randArr.push(Math.floor((Math.random() * (max - min)) + min));
	}
	return randArr;
}

