
var svgPeopleWidth = 780;
var svgPeopleHeight = 500;
var tooltipPositionX, tooltipPositionY;
var tooltip;
var svg;
var prevSelection;
var isDonutloaded=false;
//var headingGroup, descGroup1, descGroup2, descGroup3;
//var heading, headingIcon;
//var descValue1, descValue2, descValue3;

// general chart details
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width = svgPeopleWidth - margin.left - margin.right;
var height = 200 - margin.top - margin.bottom;

// line chart data
var datasetLine, xDomainLine;
var lineChartGroup, path1, line1, xScaleLine, yScaleLine, yAxisLine, xAxisLine, pointsLine;

// bar chart data
var datasetBar, xDomainBar;
var barChartGroup, xScaleBar, yScaleBar, xAxisBar, yAxisBar;

var isPeopleVisited = false;
	
$(document).ready(function(){
	
	tooltip = d3.select("body")
		.append("div")
		.attr("id", "tooltip")
		.style("position", "absolute")
		.style("visibility", "hidden");
	
	svg = d3.select("#drawarea")
		.append("svg")
		.attr("width", svgPeopleWidth)
		.attr("height", svgPeopleHeight)
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("xlink", "http://www.w3.org/1999/xlink");
		
	// headingGroup = svg.append("g");
	// descGroup1 = svg.append("g");
	// descGroup2 = svg.append("g");
	// descGroup3 = svg.append("g");
// 	
	// heading = headingGroup.append("text")
		// .attr("font-family", "sans-serif")
		// .attr("font-size", "36px")
		// .attr("fill", "black")
		// .attr("x", 12)
		// .attr("y", 36);
// 		
	// headingIcon = headingGroup.append("image")
		// .attr("x", 600)
		// .attr("y", 4)
		// .attr("width", 100)
		// .attr("height", 100);
	// headingGroup.append("rect")
		// .attr("x", 597)
		// .attr("y", 1)
		// .attr("rx", 8)
		// .attr("ry", 8)
		// .attr("width", 106)
		// .attr("height", 106)
		// .style("fill-opacity", 0)
		// .style("stroke-width", 1)
		// .style("stroke", "black")
		// .style("stroke-opacity", 1);
// 	
	// descGroup1.append("text")
		// .attr("font-family", "sans-serif")
		// .attr("font-size", "12px")
		// .attr("fill", "black")
		// .attr("x", 24)
		// .attr("y", 72)
		// .text("Number of people");
// 		
	// descValue1 = descGroup1.append("text")
		// .attr("font-family", "sans-serif")
		// .attr("font-size", "12px")
		// .attr("font-weight", "bold")
		// .attr("fill", "black")
		// .attr("x", 60)
		// .attr("y", 92);
// 			
	// descGroup2.append("text")
		// .attr("font-family", "sans-serif")
		// .attr("font-size", "12px")
		// .attr("fill", "black")
		// .attr("x", 210)
		// .attr("y", 72)
		// .text("Number of publications");
// 		
	// descValue2 = descGroup2.append("text")
		// .attr("font-family", "sans-serif")
		// .attr("font-size", "12px")
		// .attr("font-weight", "bold")
		// .attr("fill", "black")
		// .attr("x", 256)
		// .attr("y", 92);
// 		
	// descGroup3.append("text")
		// .attr("font-family", "sans-serif")
		// .attr("font-size", "12px")
		// .attr("fill", "black")
		// .attr("x", 420)
		// .attr("y", 72)
		// .text("Number of patents: ");
// 		
	// descValue3 = descGroup3.append("text")
		// .attr("font-family", "sans-serif")
		// .attr("font-size", "12px")
		// .attr("font-weight", "bold")
		// .attr("fill", "black")
		// .attr("x", 464)
		// .attr("y", 92);
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var activeTab = "" + e.target; // Active Tab
     	//var prevTab = "" + e.relatedTarget; // Previous Tab
     	var currentTab = activeTab.substring(activeTab.lastIndexOf("#") + 1);
     	console.log(currentTab);

     	if(currentTab == "people"){
     		if(!isPeopleVisited){
     			drawTopPeopleGraph();
     		}
     		isPeopleVisited = true;
     	}
	});


	// -- line chart --
	//var datasetLine = [ 18, 16, 18, 24, 29, 30, 38, 34, 27, 32, 40, 35, 34, 30 ];
	datasetLine = getRandomArray(14, 30, 40);
	xDomainLine = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013"];
	
	lineChartGroup = svg.append("g")
		.attr("id", "lineChartGroup")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("transform", "translate(" + 40 + "," + 40 + ")");
	
	// add title to line chart
	lineChartGroup.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Number of People vs. Year");
	
	xScaleLine = d3.scale.ordinal()
		.domain(xDomainLine)
		.rangeRoundBands([0, width], 1, 0.5);
	
	yScaleLine = d3.scale.linear()
		.domain([0, d3.max(datasetLine)])
		.range([height, 0]);
	
	xAxisLine = d3.svg.axis()
		.scale(xScaleLine)
		.orient("bottom");
	
	yAxisLine = d3.svg.axis()
		.scale(yScaleLine)
		.orient("left")
		//.tickValues([1, 2, 3, 5, 8, 13, 21]) // what values
		.ticks(5); // how many lines (ex: 5)
	
	line1 = d3.svg.line()
		.x(function(d, i) {
			return xScaleLine(xDomainLine[i]);
		})
		.y(function(d, i) {
			return yScaleLine(datasetLine[i]);
		})
		.interpolate("linear"); // cardinal, linear
		
	// should remove after including these statements in drawPeopleLineChart function, like y axis
	// lineChartGroup.append("g")
		// .attr("class", "x axis")
		// .attr("transform", "translate(0," + height + ")")
		// .call(xAxisLine);
	
	// horizontal grid lines
	lineChartGroup.selectAll("g.rule")
		.data(yScaleLine.ticks())
		.enter()
		.append("g")
		.attr("class", "rule").append("line")
		.attr("y1", yScaleLine)
		.attr("y2", yScaleLine)
		.attr("x1", 0)
		.attr("x2", width);
		
	// vertical grid lines
	// var rules2 = lineChartGroup.selectAll("g.rule")
		// .data(xScaleLine.ticks())
		// .enter()
		// .append("g")
		// .attr("class", "rule");
// 		
	// rules2.append("line")
		// .attr("x1", xScaleLine)
		// .attr("x2", xScaleLine)
		// .attr("y1", 30)
		// .attr("y2", height);
	
	// y axis
	/*lineChartGroup.append("g")
	.attr("class", "y axis")
	.call(yAxisLine)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.text("No. of Publications");*/
	

	/*pointsLine = lineChartGroup.selectAll(".dot")
	    .data(datasetLine)
		.enter()
		.append("circle")
		.style("fill", "brown")
		.style("fill-opacity", 0)
		.style("stroke", "brown")
		.style("stroke-opacity", 0);
		
	pointsLine.transition()
		.delay(1000)
		.attr("class", "dot")
		.attr("cx", line1.x())
	    .attr("cy", line1.y())
		.attr("r", 1)
		.style("stroke-width", 20 + "px");
	
	pointsLine.on("mouseover", function(d, i){
		tooltipPositionX = d3.event.pageX + 10;
		tooltipPositionY = d3.event.pageY + 10;
		d3.select(this)
			.transition()
			.duration(500)
			.attr("r", 10)
			.style("fill-opacity", 0.8)
			.style("stroke-width", 10 + "px");
			
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
			.attr("r", 1)
			.style("fill-opacity", 0)
			.style("stroke-width", 20 + "px");
			
		tooltip
			.transition()
			.duration(500)
			.style("visibility", "hidden");
	});*/



    // -- bar chart --
    //var datasetBar = [ 14, 34, 21, 38, 19, 32 ];
    datasetBar = getRandomArray(7, 20, 50);
    xDomainBar = ["Mathematics", "Computer and information sciences", "Physical sciences", "Chemical sciences", "Earth and related environmental sciences", "Biological sciences", "Other natural sciences"];
    //var barPadding = 1;
    
    barChartGroup = svg.append("g")
		.attr("id", "barChartGroup")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("transform", "translate(" + 40 + "," + 260 + ")");
    
    // add title to bar chart
	// barChartGroup.append("text")
        // .attr("x", (width / 2))
        // .attr("y", 0 - (margin.top / 2))
        // .attr("text-anchor", "middle")	
        // .style("font-size", "14px") 	
        // .text("Number of People vs. Categories");
        
    xScaleBar = d3.scale.ordinal()
		.domain(xDomainBar)
		.rangeRoundBands([0, width], 0.4, 0.2); // (range, gap between bars, gap between both sides)
		
	yScaleBar = d3.scale.linear()
		.domain([0, d3.max(datasetBar)])
		.range([height, 0], 0.5);
    
    xAxisBar = d3.svg.axis()
		.scale(xScaleBar)
		.orient("bottom");

	yAxisBar = d3.svg.axis()
		.scale(yScaleBar)
		.orient("left")
		.ticks(10);
		
		
	barChartGroup.selectAll("rect")
		.data(datasetBar)
		.enter()
		.append("rect")
		.attr("class", "bar")
		// .attr("rx", 10)
		// .attr("ry", 10)
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
    
    
    /*barChartGroup.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxisBar)
		.selectAll(".tick text")
		.call(wrap, xScaleBar.rangeBand());*/
	
	/*barChartGroup.append("g")
		.attr("class", "y axis")
		.call(yAxisBar)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("No. of People");*/
    
    loadContent("People", "Number of People", "people.svg", 54489, 2845, 789);
    prevSelection = "People";
    
    $("#imgPeople").click(function(){
    	loadChartContent($("#area").text(), "Number of People");
    });
    
    $("#imgPubs").click(function(){
    	loadChartContent($("#area").text(), "Number of Publications");
    });
    
    $("#imgPatents").click(function(){
    	loadChartContent($("#area").text(), "Number of Patents");
    });
});

function loadContent(areaOfInterest, yAxisTitle, iconName, numPeople, numPubs, numPatents){
	if(areaOfInterest !== prevSelection){
		loadHeadingData (areaOfInterest, iconName, numPeople, numPubs, numPatents);
		drawPeopleLineChart(yAxisTitle);
		drawPeopleBarChart(areaOfInterest, yAxisTitle);
		prevSelection = areaOfInterest;
	} else {
		loadHeadingData ("People", "people.svg", 54489, 2845, 789);
		drawPeopleLineChart("Number of People");
		drawPeopleBarChart("People", "Number of People");
		prevSelection = "People";
	}
}

function loadChartContent(areaOfInterest, yAxisTitle){
	drawPeopleLineChart(yAxisTitle);
	drawPeopleBarChart(areaOfInterest, yAxisTitle);
}

// load heading text data
function loadHeadingData (areaOfInterest, iconName, numPeople, numPubs, numPatents){
	// heading
	d3.select("#area")
		.style("font-size", 12+"px")
		.text(areaOfInterest)
		.transition()
		.style("font-size", 20+"px");
	
	// subject logo
	d3.select("#imgMain")
		.attr("src", "images/svg/" + iconName)
		.attr("width", 0)
		.attr("height", 0)
		.transition()
		.attr("width", 56)
		.attr("height", 56);
	
	// first description value
	d3.select("#numPeople")
		.style("font-size", 8+"px")
		.text(numPeople)
		.transition()
		.style("font-size", 16+"px");
		
	// second description value
	d3.select("#numPubs")
		.style("font-size", 8+"px")
		.text(numPubs)
		.transition()
		.style("font-size", 16+"px");
	
	// third description value
	d3.select("#numPatents")
		.style("font-size", 8+"px")
		.text(numPatents)
		.transition()
		.style("font-size", 16+"px");
}

// function predrawLineChart(){
	// path1 = lineChartGroup.append("path")
		// .datum(datasetLine)
		// .attr("class", "line")
		// .style("stroke", "brown")
		// .attr("d", line1);
		// //.call(transition)
// 		
	// path1.transition()
		// .duration(1000)
		// .ease("linear") // linear, circle, elastic, bounce
		// .attrTween("stroke-dasharray", tweenDash);
// }

function drawPeopleLineChart(yAxisTitle){
	//var tempMax = Math.random() * 90;
	datasetLine = getRandomArray(14, 45, 60);
	
	yScaleLine.domain([0, d3.max(datasetLine)]);
	
	// add title to line chart
	lineChartGroup.select("text")
		.remove();
	lineChartGroup.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(yAxisTitle + " vs. Year");
	
	// remove old grid and update horizontal grid lines
	lineChartGroup.selectAll("g.rule")
		.remove();
	lineChartGroup.selectAll("g.rule")
		.data(yScaleLine.ticks())
		.enter()
		.append("g")
		.attr("class", "rule").append("line")
		.attr("y1", yScaleLine)
		.attr("y2", yScaleLine)
		.attr("x1", 0)
		.attr("x2", width);
		
	// update x axis
	lineChartGroup.select("g.x")
		.remove();
	lineChartGroup.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxisLine);
	
	// update y axis
	lineChartGroup.select("g.y")
		.remove();
	lineChartGroup.append("g")
		.attr("class", "y axis")
		.call(yAxisLine)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(yAxisTitle);
	
	// update line details
	line1.x(function(d, i) {
			return xScaleLine(xDomainLine[i]);
		})
		.y(function(d, i) {
			return yScaleLine(datasetLine[i]);
		})
		.interpolate("linear"); // cardinal
	
	// remove old line and draw new line
	lineChartGroup.select(".line")
		.remove();
	path1 = lineChartGroup.append("path")
		.datum(datasetLine)
		.attr("class", "line")
		.style("stroke", "brown")
		.attr("d", line1)
		.transition()
		.duration(1000)
		.ease("linear") // linear, circle, elastic, bounce
		.attrTween("stroke-dasharray", tweenDash);

	// remove old points and add new points to line
	lineChartGroup.selectAll(".dot")
		.remove();
	pointsLine = lineChartGroup.selectAll(".dot")
	    .data(datasetLine)
		.enter()
		.append("circle")
		.style("fill", "brown")
		.style("fill-opacity", 0)
		.style("stroke", "brown")
		.style("stroke-opacity", 0);
	pointsLine.transition()
		.delay(1000)
		.attr("class", "dot")
		.attr("cx", line1.x())
	    .attr("cy", line1.y())
		.attr("r", 1)
		.style("stroke-width", 20 + "px");
	pointsLine.on("mouseover", function(d, i){
		tooltipPositionX = d3.event.pageX + 10;
		tooltipPositionY = d3.event.pageY + 10;
		d3.select(this)
			.transition()
			.duration(500)
			.attr("r", 10)
			.style("fill-opacity", 0.8)
			.style("stroke-width", 10 + "px");
			
		// tooltip
			// .style("left", tooltipPositionX + "px")
			// .style("top", tooltipPositionY + "px")
			// .transition()
			// .delay(500)
			// .style("visibility", "visible")
			// .style("background-color", "brown")
			// .text(xDomainLine[i] + " : " + d);
			
	var pageX, newX, x, pageY, newY, y;
		
	pageX = d3.event.pageX;
	newX = d3.mouse(this)[0];
	x = Number(d3.select(this).attr("cx"));
	
	pageY = d3.event.pageY;
	newY = d3.mouse(this)[1];
	y = Number(d3.select(this).attr("cy"));
	
	tooltipPositionX = pageX - newX + x;
	tooltipPositionY = pageY - newY + y - 95 - 10;
	
	d3.select("#tooltip-value").text(d);
	d3.select("#tooltip-title").text(xDomainLine[i]);
	d3.select("#tooltip-desc").text("");
	
	d3.select("#tooltip2")
		.transition()
		.delay(500)
		.style("display", "block")
		.style("left", tooltipPositionX + "px")
		.style("top", tooltipPositionY + "px");
		
	})
	.on("mouseout", function(d, i){
		d3.select(this)
			.transition()
			.duration(500)
			.attr("r", 1)
			.style("fill-opacity", 0)
			.style("stroke-width", 20 + "px");
			
		// tooltip
			// .transition()
			// .duration(500)
			// .style("visibility", "hidden");
			
		d3.select("#tooltip2")
			.transition()
			.style("display", "none");
	});
}

// function to animate line chart
function tweenDash() {
	var l = this.getTotalLength();
	var i = d3.interpolateString("0," + l, l + "," + l);
	return function(t) {
		return i(t);
	};
}

function drawPeopleBarChart(areaOfInterest, yAxisTitle){
	//xDomainBar = ["History and archaeology", "Languages and literature", "Philosophy, ethics and religion", "Art (arts, history of arts, performing arts, music)", "Other humanities"];
	xDomainBar = getSubAreaArray(areaOfInterest);
	
	var tempMax = Math.random() * 90;
	datasetBar = getRandomArray(xDomainBar.length, 20, tempMax);
	
	xScaleBar.domain(xDomainBar);
	yScaleBar.domain([0, d3.max(datasetBar)]);
	
	// update title to bar chart
	barChartGroup.select("text")
		.remove();
	barChartGroup.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(yAxisTitle + " vs. Area of interests");
	
	// remove old grid and update horizontal grid lines
	barChartGroup.selectAll("g.rule")
		.remove();
	barChartGroup.selectAll("g.rule")
		.data(yScaleBar.ticks())
		.enter()
		.append("g")
		.attr("class", "rule").append("line")
		.attr("y1", yScaleBar)
		.attr("y2", yScaleBar)
		.attr("x1", 0)
		.attr("x2", width);
	
	// create bars
	barChartGroup.selectAll("rect")
		.remove();
	barChartGroup.selectAll("rect")
		.data(datasetBar)
		.enter()
		.append("rect")
		.attr("class", "bar")
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
		.attr("fill", "steelblue");
		
	// update x axis
	barChartGroup.select("g.x")
		.remove();
	barChartGroup.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxisBar)
		.selectAll(".tick text")
		.call(wrap, xScaleBar.rangeBand());
	
	// update y axis
	barChartGroup.select("g.y")
		.remove();
	barChartGroup.append("g")
		.attr("class", "y axis")
		.call(yAxisBar)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(yAxisTitle);
		
	// tooltip2
	barChartGroup.selectAll("rect")
		.on("mouseover", function(d, i){
			var pageX, newX, x, w, pageY, newY, y, h;
			
			pageX = d3.event.pageX;
			newX = d3.mouse(this)[0];
			x = Number(d3.select(this).attr("x"));
			w = Number(d3.select(this).attr("width"));
			
			pageY = d3.event.pageY;
			newY = d3.mouse(this)[1];
			y = Number(d3.select(this).attr("y"));
			h = Number(d3.select(this).attr("height"));
			
			tooltipPositionX = pageX - newX + x + (w / 2);
			tooltipPositionY = pageY - newY + y - 95;
			
			d3.select("#tooltip-value").text(d);
			d3.select("#tooltip-title").text(xDomainBar[i]);
			d3.select("#tooltip-desc").text("");
			
			d3.select("#tooltip2")
				.transition()
				.style("display", "block")
				.style("left", tooltipPositionX + "px")
				.style("top", tooltipPositionY + "px");
			})
		.on("mousemove", function(d, i){
			// tooltipPositionX = d3.event.pageX;
			// tooltipPositionY = d3.event.pageY;
			// d3.select("#tooltip2")
				// .style("display", "block")
				// .style("left", tooltipPositionX + "px")
				// .style("top", tooltipPositionY - 95 + "px");
		})
		.on("mouseout", function(d, i){
			d3.select("#tooltip2")
				.transition()
				.style("display", "none");
		});
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
// moved to utility.js
// function getRandomArray(arrLength, min, max){
	// var randArr = new Array();
	// for (var i=0; i < arrLength; i++) {
		// randArr.push(Math.floor((Math.random() * (max - min)) + min));
	// }
	// return randArr;
// }

// for temporary usage
function getSubAreaArray(area){
	var subAreaArr = new Array();
	if(area == "People"){
		subAreaArr.push("Natural Sciences");
		subAreaArr.push("Engineering and Technology");
		subAreaArr.push("Medical and Health Sciences");
		subAreaArr.push("Agricultural Sciences");
		subAreaArr.push("Social Sciences");
		subAreaArr.push("Humanities");
	} else if (area == "Natural Sciences") {
		subAreaArr.push("Mathematics");
		subAreaArr.push("Computer and information sciences");
		subAreaArr.push("Physical sciences");
		subAreaArr.push("Chemical sciences");
		subAreaArr.push("Earth and related environmental sciences");
		subAreaArr.push("Biological sciences");
		subAreaArr.push("Other natural sciences");
	} else if(area == "Engineering and Technology"){
		subAreaArr.push("Civil engineering");
		subAreaArr.push("Electrical engineering, electronic engineering, information engineering");
		subAreaArr.push("Mechanical engineering");
		subAreaArr.push("Chemical engineering");
		subAreaArr.push("Materials engineering");
		subAreaArr.push("Medical engineering");
		subAreaArr.push("Environmental engineering");
		subAreaArr.push("Environmental biotechnology");
		subAreaArr.push("Industrial Biotechnology");
		subAreaArr.push("Nano-technology");
		subAreaArr.push("Other engineering and technologies");
	} else if(area == "Medical and Health Sciences"){
		subAreaArr.push("Basic medicine");
		subAreaArr.push("Clinical medicine");
		subAreaArr.push("Health sciences");
		subAreaArr.push("Health biotechnology");
		subAreaArr.push("Other medical sciences");
	} else if(area == "Agricultural Sciences"){
		subAreaArr.push("Agriculture, forestry, and fisheries");
		subAreaArr.push("Animal and dairy science");
		subAreaArr.push("Veterinary science");
		subAreaArr.push("Agricultural biotechnology");
		subAreaArr.push("Other agricultural sciences");
	} else if(area == "Social Sciences"){
		subAreaArr.push("Psychology");
		subAreaArr.push("Economics and business");
		subAreaArr.push("Educational sciences");
		subAreaArr.push("Sociology");
		subAreaArr.push("Law");
		subAreaArr.push("Political Science");
		subAreaArr.push("Social and economic geography");
		subAreaArr.push("Media and communications");
		subAreaArr.push("Other social sciences");
	} else if(area == "Humanities"){
		subAreaArr.push("History and archaeology");
		subAreaArr.push("Languages and literature");
		subAreaArr.push("Philosophy, ethics and religion");
		subAreaArr.push("Art (arts, history of arts, performing arts, music)");
		subAreaArr.push("Other humanities");
	} else if(area == ""){
		subAreaArr.push("");
		subAreaArr.push("");
		subAreaArr.push("");
	}
	return subAreaArr;
}



function drawTopPeopleGraph(){
	var svgTopPeople = d3.select("#top-people-1-area")
		.append("svg")
		.attr("width", 350)
		.attr("height", 38)
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("xlink", "http://www.w3.org/1999/xlink");
		
	var topPeopleGroup = svgTopPeople.append("g")
		.attr("id", "topPeopleGroup1");
	
	var peopleDefs = topPeopleGroup.append("defs");
	
	var grad1 = peopleDefs.append("linearGradient")
		.attr("id", "grad7")
		.attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "100%")
	    .attr("y2", "0%");
	grad1.append("svg:stop")
		.attr("offset", "0%")
		.attr("stop-color", "#4682B4")
		.attr("stop-opacity", 1);
	grad1.append("svg:stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#50acf9")
	    .attr("stop-opacity", 1);
	
	var grad2 = peopleDefs.append("linearGradient")
		.attr("id", "grad8")
		.attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "100%")
	    .attr("y2", "0%");
	grad2.append("svg:stop")
		.attr("offset", "0%")
		.attr("stop-color", "#A52A2A")
		.attr("stop-opacity", 1);
	grad2.append("svg:stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#ec3e3e")
	    .attr("stop-opacity", 1);
		
	topPeopleGroup.append("rect")
		.attr("x", 0)
		.attr("y", 3)
		.attr("width", 180)
		.attr("height", 15)
		.attr("rx", 2)
		.attr("ry", 2)
		.style("fill", "url(#grad7)")
		.on("click", function(){popitup("publications.html")}) 
		.on('mouseover', function(){
			d3.select(this).style("cursor", "pointer");
		});
	
	topPeopleGroup.append("rect")
		.attr("x", 0)
		.attr("y", 20)
		.attr("width", 100)
		.attr("height", 15)
		.attr("rx", 2)
		.attr("ry", 2)
		.style("fill", "url(#grad8)");

	topPeopleGroup.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-weight", "bold")
		.attr("font-size", "14px")
		.attr("fill", "black")
		.attr("x", 210)
		.attr("y", 18)
		.text("200");

	topPeopleGroup.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-weight", "bold")
		.attr("font-size", "14px")
		.attr("fill", "black")
		.attr("x", 130)
		.attr("y", 35)
		.text("35");

	topPeopleGroup.append("svg:image")
      	.attr("xlink:href", "images/icons/publications_b.svg")
      	.attr("x", 190)
		.attr("y", 4)
		.attr("fill", "black")
      	.attr("width", 16)
      	.attr("height", 16);

     topPeopleGroup.append("svg:image")
      	.attr("xlink:href", "images/icons/patent_b.svg")
      	.attr("x", 107)
		.attr("y", 22)
		.attr("fill", "black")
      	.attr("width", 16)
      	.attr("height", 16);
/////////////////////////////////////////////////////////////////////
	var svgTopPeople2 = d3.select("#top-people-2-area")
		.append("svg")
		.attr("width", 350)
		.attr("height", 38)
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("xlink", "http://www.w3.org/1999/xlink");
		
	var topPeopleGroup2 = svgTopPeople2.append("g")
		.attr("id", "topPeopleGroup2");
	
	var peopleDefs2 = topPeopleGroup2.append("defs");
	
	var grad1 = peopleDefs2.append("linearGradient")
		.attr("id", "grad10")
		.attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "100%")
	    .attr("y2", "0%");
	grad1.append("svg:stop")
		.attr("offset", "0%")
		.attr("stop-color", "#4682B4")
		.attr("stop-opacity", 1);
	grad1.append("svg:stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#50acf9")
	    .attr("stop-opacity", 1);
	
	var grad2 = peopleDefs2.append("linearGradient")
		.attr("id", "grad11")
		.attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "100%")
	    .attr("y2", "0%");
	grad2.append("svg:stop")
		.attr("offset", "0%")
		.attr("stop-color", "#A52A2A")
		.attr("stop-opacity", 1);
	grad2.append("svg:stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#ec3e3e")
	    .attr("stop-opacity", 1);
	
	topPeopleGroup2.append("rect")
		.attr("x", 0)
		.attr("y", 3)
		.attr("width", 135)
		.attr("height", 15)
		.attr("rx", 2)
		.attr("ry", 2)
		.style("fill", "url(#grad7)");
	
	topPeopleGroup2.append("rect")
		.attr("x", 0)
		.attr("y", 20)
		.attr("width", 90)
		.attr("height", 15)
		.attr("rx", 2)
		.attr("ry", 2)
		.style("fill", "url(#grad8)");

	topPeopleGroup2.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-weight", "bold")
		.attr("font-size", "14px")
		.attr("fill", "black")
		.attr("x", 170)
		.attr("y", 18)
		.text("147");

	topPeopleGroup2.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-weight", "bold")
		.attr("font-size", "14px")
		.attr("fill", "black")
		.attr("x", 125)
		.attr("y", 34)
		.text("26");

      topPeopleGroup2.append("svg:image")
      	.attr("xlink:href", "images/icons/publications_b.svg")
      	.attr("x", 145)
		.attr("y", 4)
		.attr("fill", "black")
      	.attr("width", 16)
      	.attr("height", 16);

     topPeopleGroup2.append("svg:image")
      	.attr("xlink:href", "images/icons/patent_b.svg")
      	.attr("x", 100)
		.attr("y", 22)
		.attr("fill", "black")
      	.attr("width", 16)
      	.attr("height", 16);

	///////////////////////////////////////////////////////

	var svgTopPeople3 = d3.select("#top-people-3-area")
		.append("svg")
		.attr("width", 350)
		.attr("height", 38)
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("xlink", "http://www.w3.org/1999/xlink");
		
	var topPeopleGroup3 = svgTopPeople3.append("g")
		.attr("id", "topPeopleGroup2");
	
	var peopleDefs3 = topPeopleGroup3.append("defs");
	
	var grad13 = peopleDefs3.append("linearGradient")
		.attr("id", "grad10")
		.attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "100%")
	    .attr("y2", "0%");
	grad13.append("svg:stop")
		.attr("offset", "0%")
		.attr("stop-color", "#4682B4")
		.attr("stop-opacity", 1);
	grad13.append("svg:stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#50acf9")
	    .attr("stop-opacity", 1);
	
	var grad23 = peopleDefs3.append("linearGradient")
		.attr("id", "grad11")
		.attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "100%")
	    .attr("y2", "0%");
	grad23.append("svg:stop")
		.attr("offset", "0%")
		.attr("stop-color", "#A52A2A")
		.attr("stop-opacity", 1);
	grad23.append("svg:stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#ec3e3e")
	    .attr("stop-opacity", 1);
	
	topPeopleGroup3.append("rect")
		.attr("x", 0)
		.attr("y", 3)
		.attr("width", 88)
		.attr("height", 15)
		.attr("rx", 2)
		.attr("ry", 2)
		.style("fill", "url(#grad7)");
	
	topPeopleGroup3.append("rect")
		.attr("x", 0)
		.attr("y", 20)
		.attr("width", 40)
		.attr("height", 15)
		.attr("rx", 2)
		.attr("ry", 2)
		.style("fill", "url(#grad8)");

	topPeopleGroup3.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-weight", "bold")
		.attr("font-size", "14px")
		.attr("fill", "black")
		.attr("x", 170)
		.attr("y", 18)
		.text("89");

	topPeopleGroup3.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-weight", "bold")
		.attr("font-size", "14px")
		.attr("fill", "black")
		.attr("x", 125)
		.attr("y", 34)
		.text("14");

      topPeopleGroup3.append("svg:image")
      	.attr("xlink:href", "images/icons/publications_b.svg")
      	.attr("x", 145)
		.attr("y", 4)
		.attr("fill", "black")
      	.attr("width", 16)
      	.attr("height", 16);

     topPeopleGroup3.append("svg:image")
      	.attr("xlink:href", "images/icons/patent_b.svg")
      	.attr("x", 100)
		.attr("y", 22)
		.attr("fill", "black")
      	.attr("width", 16)
      	.attr("height", 16);

//////////////////////////////////////////////////////////
	
	var svgTopPeople4 = d3.select("#top-people-4-area")
		.append("svg")
		.attr("width", 350)
		.attr("height", 38)
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("xlink", "http://www.w3.org/1999/xlink");
		
	var topPeopleGroup4 = svgTopPeople4.append("g")
		.attr("id", "topPeopleGroup2");
	
	var peopleDefs4 = topPeopleGroup4.append("defs");
	
	var grad14 = peopleDefs4.append("linearGradient")
		.attr("id", "grad10")
		.attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "100%")
	    .attr("y2", "0%");
	grad14.append("svg:stop")
		.attr("offset", "0%")
		.attr("stop-color", "#4682B4")
		.attr("stop-opacity", 1);
	grad14.append("svg:stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#50acf9")
	    .attr("stop-opacity", 1);
	
	var grad24 = peopleDefs4.append("linearGradient")
		.attr("id", "grad11")
		.attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "100%")
	    .attr("y2", "0%");
	grad24.append("svg:stop")
		.attr("offset", "0%")
		.attr("stop-color", "#A52A2A")
		.attr("stop-opacity", 1);
	grad24.append("svg:stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#ec3e3e")
	    .attr("stop-opacity", 1);
	
	topPeopleGroup4.append("rect")
		.attr("x", 0)
		.attr("y", 3)
		.attr("width", 135)
		.attr("height", 15)
		.attr("rx", 2)
		.attr("ry", 2)
		.style("fill", "url(#grad7)");
	
	topPeopleGroup4.append("rect")
		.attr("x", 0)
		.attr("y", 20)
		.attr("width", 90)
		.attr("height", 15)
		.attr("rx", 2)
		.attr("ry", 2)
		.style("fill", "url(#grad8)");

	topPeopleGroup4.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-weight", "bold")
		.attr("font-size", "14px")
		.attr("fill", "black")
		.attr("x", 170)
		.attr("y", 18)
		.text("147");

	topPeopleGroup4.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-weight", "bold")
		.attr("font-size", "14px")
		.attr("fill", "black")
		.attr("x", 125)
		.attr("y", 34)
		.text("26");

      topPeopleGroup4.append("svg:image")
      	.attr("xlink:href", "images/icons/publications_b.svg")
      	.attr("x", 145)
		.attr("y", 4)
		.attr("fill", "black")
      	.attr("width", 16)
      	.attr("height", 16);

     topPeopleGroup4.append("svg:image")
      	.attr("xlink:href", "images/icons/patent_b.svg")
      	.attr("x", 100)
		.attr("y", 22)
		.attr("fill", "black")
      	.attr("width", 16)
      	.attr("height", 16);

//////////////////////////////////////////////////////////
	
	var svgTopPeople5 = d3.select("#top-people-5-area")
		.append("svg")
		.attr("width", 350)
		.attr("height", 38)
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("xlink", "http://www.w3.org/1999/xlink");
		
	var topPeopleGroup5 = svgTopPeople5.append("g")
		.attr("id", "topPeopleGroup2");
	
	var peopleDefs5 = topPeopleGroup5.append("defs");
	
	var grad15 = peopleDefs5.append("linearGradient")
		.attr("id", "grad10")
		.attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "100%")
	    .attr("y2", "0%");
	grad15.append("svg:stop")
		.attr("offset", "0%")
		.attr("stop-color", "#4682B4")
		.attr("stop-opacity", 1);
	grad15.append("svg:stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#50acf9")
	    .attr("stop-opacity", 1);
	
	var grad25 = peopleDefs5.append("linearGradient")
		.attr("id", "grad11")
		.attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "100%")
	    .attr("y2", "0%");
	grad25.append("svg:stop")
		.attr("offset", "0%")
		.attr("stop-color", "#A52A2A")
		.attr("stop-opacity", 1);
	grad25.append("svg:stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#ec3e3e")
	    .attr("stop-opacity", 1);
	
	topPeopleGroup5.append("rect")
		.attr("x", 0)
		.attr("y", 3)
		.attr("width", 135)
		.attr("height", 15)
		.attr("rx", 2)
		.attr("ry", 2)
		.style("fill", "url(#grad7)");
	
	topPeopleGroup5.append("rect")
		.attr("x", 0)
		.attr("y", 20)
		.attr("width", 90)
		.attr("height", 15)
		.attr("rx", 2)
		.attr("ry", 2)
		.style("fill", "url(#grad8)");

	topPeopleGroup5.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-weight", "bold")
		.attr("font-size", "14px")
		.attr("fill", "black")
		.attr("x", 170)
		.attr("y", 18)
		.text("147");

	topPeopleGroup5.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-weight", "bold")
		.attr("font-size", "14px")
		.attr("fill", "black")
		.attr("x", 125)
		.attr("y", 34)
		.text("26");

      topPeopleGroup5.append("svg:image")
      	.attr("xlink:href", "images/icons/publications_b.svg")
      	.attr("x", 145)
		.attr("y", 4)
		.attr("fill", "black")
      	.attr("width", 16)
      	.attr("height", 16);

     topPeopleGroup5.append("svg:image")
      	.attr("xlink:href", "images/icons/patent_b.svg")
      	.attr("x", 100)
		.attr("y", 22)
		.attr("fill", "black")
      	.attr("width", 16)
      	.attr("height", 16);

//////////////////////////////////////////////////////////
	
	svg = d3.select("#people-draw-area")
		.append("svg")
		.attr("width", '700')
		.attr("height", '250')
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("xlink", "http://www.w3.org/1999/xlink");
	

	// -- line chart --
	//var datasetLine = [ 18, 16, 18, 24, 29, 30, 38, 34, 27, 32, 40, 35, 34, 30 ];
	datasetLine = getRandomArray(14, 30, 40);
	xDomainLine = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013"];
	
	lineChartGroup = svg.append("g")
		.attr("id", "lineChartGroup")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("transform", "translate(" + 40 + "," + 40 + ")");
	
	// add title to line chart
	lineChartGroup.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Number of People vs. Year");
	
	xScaleLine = d3.scale.ordinal()
		.domain(xDomainLine)
		.rangeRoundBands([0, width], 1, 0.5);
	
	yScaleLine = d3.scale.linear()
		.domain([0, d3.max(datasetLine)])
		.range([height, 0]);
	
	xAxisLine = d3.svg.axis()
		.scale(xScaleLine)
		.orient("bottom");
	
	yAxisLine = d3.svg.axis()
		.scale(yScaleLine)
		.orient("left")
		//.tickValues([1, 2, 3, 5, 8, 13, 21]) // what values
		.ticks(5); // how many lines (ex: 5)
	
	line1 = d3.svg.line()
		.x(function(d, i) {
			return xScaleLine(xDomainLine[i]);
		})
		.y(function(d, i) {
			return yScaleLine(datasetLine[i]);
		})
		.interpolate("linear"); // cardinal, linear
		
	// should remove after including these statements in drawPeopleLineChart function, like y axis
	// lineChartGroup.append("g")
		// .attr("class", "x axis")
		// .attr("transform", "translate(0," + height + ")")
		// .call(xAxisLine);
	
	// horizontal grid lines
	lineChartGroup.selectAll("g.rule")
		.data(yScaleLine.ticks())
		.enter()
		.append("g")
		.attr("class", "rule").append("line")
		.attr("y1", yScaleLine)
		.attr("y2", yScaleLine)
		.attr("x1", 0)
		.attr("x2", width);

    }


    function donutChart(){
    	if(!isDonutloaded){
	    	var dataset = { apples: [53245, 8562],};

			var width = 460,
			    height = 300,
			    radius = Math.min(width, height) / 2;

			var color = d3.scale.category20();

			var pie = d3.layout.pie()
			    .sort(null);

			var arc = d3.svg.arc()
			    .innerRadius(radius - 100)
			    .outerRadius(radius - 50);

			var svg = d3.select("#people-draw-area-donut").append("svg")
			    .attr("width", width)
			    .attr("height", height)
			    .append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			var path = svg.selectAll("path")
			    .data(pie(dataset.apples))
			    .enter().append("path")
			    .attr("fill", function(d, i) { return color(i); })
			    .attr("d", arc);

			isDonutloaded=true;
		}
    }