
var svgPositionWidth = 780;
var svgPositionHeight = 570;
var isPositionVisited = false;
var svgPosition;

// line chart details
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width = svgPositionWidth - margin.left - margin.right;
var height = 200 - margin.top - margin.bottom;

// line chart data
var positionDatasetLine, positionXDomainLine;
var positionLineChartGroup, positionPath, positionSLLine, positionSALine, positionGALine, positionXScaleLine,
	positionYScaleLine, positionYAxisLine, positionXAxisLine, positionPointsLine;
	
// custom chart details
var marginCustChart = {top: 20, right: 20, bottom: 30, left: 50};
var widthCustChart = svgPositionWidth - marginCustChart.left - marginCustChart.right;
var heightCustChart = 120 - marginCustChart.top - marginCustChart.bottom;

// custom chart data
var positionCustChartGroup;
var positionCustChartTriangleGroup;
var positionCustChartTooltipGroup;
var CountriesX = new Array();

// radar chart
var radarCnfg;
var positionRadarLegendTitles;

$(document).ready(function(){
	
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var activeTab = "" + e.target; // Active Tab
     	var currentTab = activeTab.substring(activeTab.lastIndexOf("#") + 1);

     	if(currentTab == "position"){
     		if(!isPositionVisited){
     			
     			svgPosition = d3.select("#drawarea-position")
					.append("svg")
					.attr("width", svgPositionWidth)
					.attr("height", svgPositionHeight)
					.attr("xmlns", "http://www.w3.org/2000/svg")
					.attr("xlink", "http://www.w3.org/1999/xlink");
				
				positionRadarLegendTitles = ['Sri Lanka', 'South Asia', 'Global Average'];
				
				//Options for the Radar chart
				radarCnfg = {
					w: 200,
					h: 200,
					//maxValue: 60, // maximum axis value, if actual values are below than this
					levels: 5, // number of circles in the web
					ExtraWidthX: 250, // extra horizontal space in addition to w
					ExtraWidthY: 100, // extra vertical space in addition to w
					radius: 4, // radius of the data points
					factor: 1, // size of the spider web
					factorLegend: 1, // distance from centre to leg text
					radians: 2 * Math.PI, // angle of the web. starting from top
					opacityArea: 0.0, // opacity of the filled colour of created web from data points
					ToRight: 8, // distance between y axis and axis labels
					TranslateX: 100, // horizontal translation from top left corner position
					TranslateY: 50, // vertical translation from top left corner position
					lineTitles: positionRadarLegendTitles // lsf edit
				};
				
				//initPositionLineChart();
				//drawPositionLineChart("Score");
     			drawRegionMap();
     			drawRadarChart("gii");
     			drawRadarChartLegend(0);
     			
     			initPositionCustChart();
     			drawPositionCustChart(0);    
     		}
     		isPositionVisited = true;
     	}
	});
	
	$("#position-third-level").hide();
	
});

function drawRegionMap(){
	// create AmMap object
    var map = new AmCharts.AmMap();
    // set path to images
    map.pathToImages = "ammap/images/";

	var balloon = map.balloon;
    
    balloon.adjustBorderColor = true;
	balloon.color = "#FFFFFF"; // Color of text in the balloon.
	balloon.fillColor = "#000000"; // Balloon background color. Only if "adjustBorderColor" is "true" this color will be used.
	balloon.borderColor = "#000000"; // Balloon border color. Will only be used of adjustBorderColor is false.
	balloon.borderThickness = 0;
	balloon.fillAlpha = 0.8;
	balloon.fontSize = 14;
	balloon.shadowAlpha = 0;
	balloon.cornerRadius = 0;
    
    map.panEventsEnabled = true;
    map.zoomControl.panControlEnabled = true;
    map.zoomControl.zoomControlEnabled = true;
    
    map.backgroundAlpha  = 0;
    map.dragMap = true;
    map.fontFamily = "Helvetica Neue";
    
    map.areasSettings = {
    	unlistedAreasColor: "#bcbcbc",
    	unlistedAreasOutlineColor: "#F2F2F2",
        autoZoom: false,
        color: "#FFCC00",
        outlineColor: "#F2F2F2",
        rollOverColor: "#f97924",
        rollOverOutlineColor: "#F2F2F2",
        selectedColor: "#f97924",
        balloonText: "<h4>[[title]]</h4>[[customData]]"
    };

    var dataProvider = {
        map: "worldHigh",
        selectable: false,
        zoomLevel: 60,
        zoomLongitude: 81,
		zoomLatitude: 8,
		getAreasFromMap : false
    };
    
    var countryAreas = new Array();
    var giiCountryData = getGiiCountryDataArray();
    giiCountryData.forEach(function(d, i){
    	countryAreas.push({title: ""+d.name+"", id: ""+d.code+"", customData: "Rank: <strong>"+ d.rank +"</strong>, Score: <strong>"+ d.score +"</strong>"});
    });
    for (var i=0; i < countryAreas.length; i++) {
    	if(countryAreas[i].id == "LK"){
    		countryAreas[i].color = "#1F77B4";
    		countryAreas[i].outlineColor = "#1F77B4";
    		countryAreas[i].rollOverColor = "#f97924";
    		countryAreas[i].rollOverOutlineColor = "#f97924";
    	}
    	else if(countryAreas[i].id == "IN"){
    		countryAreas[i].color = "#E4CD5C";
    	}
    	else if(countryAreas[i].id == "NP"){
    		countryAreas[i].color = "#DA6161";
    	}
    	else if(countryAreas[i].id == "BD"){
    		countryAreas[i].color = "#34C490";
    	}
    	else if(countryAreas[i].id == "PK"){
    		countryAreas[i].color = "#56A54B";
    	} else {
    		countryAreas[i].color = "#9b9b9b";
    	}
    };
    
    dataProvider.areas = countryAreas;
    
    // pass data provider to the map object
    map.dataProvider = dataProvider;

    // write the map to container div
    map.write("region-map-area");
    
    // map.addListener("click", function (event) {
    	// var s = map.getDevInfo();
    	// console.log("Any click : longitude: " + s.longitude + ", latitude: " + s.latitude);
	// });
	
	map.addListener("clickMapObject", function (event) { // fires only when autoZoom is set to true
		// var s = map.getDevInfo();
    	// console.log("Map click : longitude: " + s.longitude + ", latitude: " + s.latitude);
    });
	
	map.addListener("rollOverMapObject", function (event) {
    	//var s = map.getDevInfo();
    	//console.log("over: " + event.mapObject.id + ", " + event.mapObject.title);
    	changeCustomChartTriangle(event.mapObject.id, event.mapObject.title);
	});

	map.addListener("rollOutMapObject", function (event) {
    	//var s = map.getDevInfo();
    	//console.log("out: ");
    	changeCustomChartTriangle("LK", "Sri Lanka");
	});
}

function loadInitialPositionContent(gii){
	$("#region-map-area").show(1000);
	d3.select("#radar-chart")
		.transition()
		.duration(1000)
		.style("top", 35+"px")
		.style("left", 330+"px")
		.style("width", 450+"px")
		.style("height", 320+"px");
	
	//Options for the Radar chart
	radarCnfg = {
		w: 200,
		h: 200,
		//maxValue: 60, // maximum axis value, if actual values are below than this
		levels: 5, // number of circles in the web
		ExtraWidthX: 250, // extra horizontal space in addition to w
		ExtraWidthY: 100, // extra vertical space in addition to w
		radius: 4, // radius of the data points
		factor: 1, // size of the spider web
		factorLegend: 1, // distance from centre to leg text
		radians: 2 * Math.PI, // angle of the web. starting from top
		opacityArea: 0.0, // opacity of the filled colour of created web from data points
		ToRight: 8, // distance between y axis and axis labels
		TranslateX: 100, // horizontal translation from top left corner position
		TranslateY: 50, // vertical translation from top left corner position
		lineTitles: positionRadarLegendTitles // lsf edit
	};

	drawRadarChart(gii);
	drawRadarChartLegend(2);
	
	drawPositionCustChart(0);
	
	prevPositionSelection = "gii";
}

var prevPositionSelection = "";

function reloadPositionContent(gii){
	$("#drawarea-position").show(500);
	//Options for the Radar chart
	radarCnfg = {
		w: 340,
		h: 340,
		//maxValue: 60, // maximum axis value, if actual values are below than this
		levels: 5, // number of circles in the web
		ExtraWidthX: 465, // extra horizontal space in addition to w
		ExtraWidthY: 100, // extra vertical space in addition to w
		radius: 4, // radius of the data points
		factor: 1, // size of the spider web
		factorLegend: 1, // distance from centre to leg text
		radians: 2 * Math.PI, // angle of the web. starting from top
		opacityArea: 0.0, // opacity of the filled colour of created web from data points
		ToRight: 8, // distance between y axis and axis labels
		TranslateX: 210, // horizontal translation from left
		TranslateY: 50, // vertical translation from top
		lineTitles: positionRadarLegendTitles // lsf edit
	};

	if(prevPositionSelection != gii){ // new selection
		prevPositionSelection = gii;
		// hiding region map
		$("#region-map-area").hide(1000);
		// hide third level div
		$("#position-third-level").hide(1000);
		$("#radar-chart").show(1000);
		d3.select("#radar-chart")
			.transition()
			.duration(1000)
			.style("top", 35+"px")
			.style("left", 5+"px")
			.style("width", 780+"px")
			.style("height", 420+"px")
			.each("end", function() {
				drawRadarChart(gii);
			});
		
		drawRadarChartLegend(1);
		drawPositionCustChart(1);
	}
}

function drawRadarChart(gii){
	var dataRadar  = new Array();
	
	var legsArray = getNationalIndicatorArray(gii);
	var legsAndValues = new Array();
	
	// set data for radar chart
	for(var i = 0; i < positionRadarLegendTitles.length; i++){
		for (var j = 0; j < legsArray.length; j++) {
			var obj = {"axis":legsArray[j], "value": getRandomValue(20, 50)};
			legsAndValues.push(obj);
		}
		dataRadar.push(legsAndValues);
		legsAndValues = [];
	}
	
	RadarChart.draw("#radar-chart", dataRadar, radarCnfg);
	
}

// level: 0 = initial, 1 = maximize, 2 = minimize
function drawRadarChartLegend(level){
	var colorscale = d3.scale.category10();

	if(level == 0){
		d3.select("#radarLegendGroup").remove();
		
		var radarLegendGroup = svgPosition.append("g")
			.attr("id", "radarLegendGroup")
			.attr('transform', 'translate(90, -10)');
		
		//Create color squares
		radarLegendGroup.selectAll('rect')
			.data(positionRadarLegendTitles)
			.enter()
			.append("rect")
			.attr("y", 10)
			.attr("width", 16)
			.attr("height", 28)
			.attr("rx", 6)
			.attr("ry", 6)
			.style("fill", function(d, i){
				return colorscale(i);
			})
			.attr("x", function(d, i){
				return 260 + (i * 150);
			});
		
		//Create legend text next to squares
		radarLegendGroup.selectAll('text')
			.data(positionRadarLegendTitles)
			.enter()
			.append("text")
			.attr("y", 30)
			.style("font-size", "14px")
			.attr("fill", "#00152E")
			.attr("class", "legendText")
			.text(function(d) {
				return d;
			})
			.attr("x", function(d, i){
				return 280 + (i * 150);
			});
	} else if(level == 1){
		// color squares
		d3.select("#radarLegendGroup")
			.selectAll('rect')
			.transition()
			.duration(1000)
			.attr("x", function(d, i){
				return 60 + (i * 200);
			});
		
		// text
		d3.select("#radarLegendGroup")
			.selectAll('text')
			.transition()
			.duration(1000)
			.attr("x", function(d, i){
				return 80 + (i * 200);
			});
		
	} else if(level == 2){
		// color squares
		d3.select("#radarLegendGroup")
			.selectAll('rect')
			.transition()
			.duration(1000)
			.attr("x", function(d, i){
				return 260 + (i * 150);
			});
		
		// text
		d3.select("#radarLegendGroup")
			.selectAll('text')
			.transition()
			.duration(1000)
			.attr("x", function(d, i){
				return 280 + (i * 150);
			});
		
	}
}

function drawPositionLineChart(yAxisTitle){
	positionDatasetLine = getRandomArray(14, 45, 60);
	var positionSADatasetLine = getRandomArray(14, 30, 50);
	var positionGADatasetLine = getRandomArray(14, 30, 50);
	positionXDomainLine = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013"];
	
	positionXScaleLine = d3.scale.ordinal()
		.domain(positionXDomainLine)
		.rangeRoundBands([0, width], 1, 0.5);
	
	positionYScaleLine = d3.scale.linear()
		.domain([0, d3.max(positionDatasetLine)])
		.range([height, 0]);
		
	positionXAxisLine = d3.svg.axis()
		.scale(positionXScaleLine)
		.orient("bottom");
		
	positionYAxisLine = d3.svg.axis()
		.scale(positionYScaleLine)
		.orient("left")
		.ticks(5);

	// add title to line chart
	positionLineChartGroup.select("text")
		.remove();
	positionLineChartGroup.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(yAxisTitle + " vs. Year");
        
    // remove old grid and update horizontal grid lines
	positionLineChartGroup.selectAll("g.rule")
		.remove();
	positionLineChartGroup.selectAll("g.rule")
		.data(positionYScaleLine.ticks())
		.enter()
		.append("g")
		.attr("class", "rule").append("line")
		.attr("y1", positionYScaleLine)
		.attr("y2", positionYScaleLine)
		.attr("x1", 0)
		.attr("x2", width);
	
	// update x axis
	positionLineChartGroup.select("g.x")
		.remove();
	positionLineChartGroup.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(positionXAxisLine);
		
	// update y axis
	positionLineChartGroup.select("g.y")
		.remove();
	positionLineChartGroup.append("g")
		.attr("class", "y axis")
		.call(positionYAxisLine)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(yAxisTitle);
	
	// update line details
	// Sri Lanka
	positionSLLine.x(function(d, i) {
			return positionXScaleLine(positionXDomainLine[i]);
		})
		.y(function(d, i) {
			return positionYScaleLine(positionDatasetLine[i]);
		})
		.interpolate("linear");
		
	// South Asia
	positionSALine.x(function(d, i) {
			return positionXScaleLine(positionXDomainLine[i]);
		})
		.y(function(d, i) {
			return positionYScaleLine(positionSADatasetLine[i]);
		})
		.interpolate("linear");
	
	// Global Average
	positionGALine.x(function(d, i) {
			return positionXScaleLine(positionXDomainLine[i]);
		})
		.y(function(d, i) {
			return positionYScaleLine(positionGADatasetLine[i]);
		})
		.interpolate("linear");
	
	// remove old lines and draw new Sri Lanka line
	positionLineChartGroup.selectAll(".line")
		.remove();
	positionPath = positionLineChartGroup.append("path")
		.datum(positionDatasetLine)
		.attr("class", "line")
		.style("stroke", "#1F77B4")
		.attr("d", positionSLLine)
		.transition()
		.duration(1000)
		.ease("linear") // linear, circle, elastic, bounce
		.attrTween("stroke-dasharray", tweenDash);
	
	// draw new South Asia line
	positionLineChartGroup.append("path")
		.datum(positionSADatasetLine)
		.attr("class", "line")
		.style("stroke", "#FF7F0E")
		.attr("d", positionSALine)
		.transition()
		.duration(1000)
		.ease("linear") // linear, circle, elastic, bounce
		.attrTween("stroke-dasharray", tweenDash);
	
	// draw new Global Average line
	positionLineChartGroup.append("path")
		.datum(positionGADatasetLine)
		.attr("class", "line")
		.style("stroke", "#2CA02C")
		.attr("d", positionGALine)
		.transition()
		.duration(1000)
		.ease("linear") // linear, circle, elastic, bounce
		.attrTween("stroke-dasharray", tweenDash);
		
	// remove old points and add new Sri Lanka points to line
	positionLineChartGroup.selectAll(".dot")
		.remove();
	positionPointsLine = positionLineChartGroup.selectAll(".dot")
		.data(positionDatasetLine)
		.enter()
		.append("circle")
		.style("fill", "#1F77B4")
		.style("fill-opacity", 0)
		.style("stroke", "#1F77B4")
		.style("stroke-opacity", 0);
	positionPointsLine.transition()
		.delay(1000)
		.attr("class", "dot")
		.attr("cx", positionSLLine.x())
		.attr("cy", positionSLLine.y())
		.attr("r", 1)
		.style("stroke-width", 20 + "px");
	positionPointsLine.on("mouseover", function(d, i){
		tooltipPositionX = d3.event.pageX + 10;
		tooltipPositionY = d3.event.pageY + 10;
		d3.select(this)
			.transition()
			.duration(500)
			.attr("r", 10)
			.style("fill-opacity", 0.8)
			.style("stroke-width", 10 + "px");
			
			var pageX, newX, x, pageY, newY, y;
				
			pageX = d3.event.pageX;
			newX = d3.mouse(this)[0];
			x = Number(d3.select(this).attr("cx"));
			
			pageY = d3.event.pageY;
			newY = d3.mouse(this)[1];
			y = Number(d3.select(this).attr("cy"));
			
			tooltipPositionX = pageX - newX + x;
			tooltipPositionY = pageY - newY + y - 95 - 10;
			
			// inserting data to tooltip
			d3.select("#tooltip-value").text(d);
			d3.select("#tooltip-title").text(positionXDomainLine[i]);
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
			
		d3.select("#tooltip2")
			.transition()
			.style("display", "none");
	});

	// add new South Asia points to line
	// positionPointsLine = positionLineChartGroup.selectAll(".dot")
		// .data(positionDatasetLine)
		// .enter()
		// .append("circle")
		// .style("fill", "#1F77B4")
		// .style("fill-opacity", 0)
		// .style("stroke", "#1F77B4")
		// .style("stroke-opacity", 0);
	// positionPointsLine.transition()
		// .delay(1000)
		// .attr("class", "dot")
		// .attr("cx", positionSLLine.x())
		// .attr("cy", positionSLLine.y())
		// .attr("r", 1)
		// .style("stroke-width", 20 + "px");
	// positionPointsLine.on("mouseover", function(d, i){
		// tooltipPositionX = d3.event.pageX + 10;
		// tooltipPositionY = d3.event.pageY + 10;
		// d3.select(this)
			// .transition()
			// .duration(500)
			// .attr("r", 10)
			// .style("fill-opacity", 0.8)
			// .style("stroke-width", 10 + "px");
// 			
			// var pageX, newX, x, pageY, newY, y;
// 				
			// pageX = d3.event.pageX;
			// newX = d3.mouse(this)[0];
			// x = Number(d3.select(this).attr("cx"));
// 			
			// pageY = d3.event.pageY;
			// newY = d3.mouse(this)[1];
			// y = Number(d3.select(this).attr("cy"));
// 			
			// tooltipPositionX = pageX - newX + x;
			// tooltipPositionY = pageY - newY + y - 95 - 10;
// 			
			// // inserting data to tooltip
			// d3.select("#tooltip-value").text(d);
			// d3.select("#tooltip-title").text(positionXDomainLine[i]);
			// d3.select("#tooltip-desc").text("");
// 			
			// d3.select("#tooltip2")
				// .transition()
				// .delay(500)
				// .style("display", "block")
				// .style("left", tooltipPositionX + "px")
				// .style("top", tooltipPositionY + "px");
// 		
	// })
	// .on("mouseout", function(d, i){
		// d3.select(this)
			// .transition()
			// .duration(500)
			// .attr("r", 1)
			// .style("fill-opacity", 0)
			// .style("stroke-width", 20 + "px");
// 			
		// d3.select("#tooltip2")
			// .transition()
			// .style("display", "none");
	// });
	
}

function initPositionLineChart(){
	positionLineChartGroup = svgPosition.append("g")
		.attr("id", "positionLineChartGroup")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("transform", "translate(" + 40 + "," + 370 + ")");
		
	positionSLLine = d3.svg.line();
	positionSALine = d3.svg.line();
	positionGALine = d3.svg.line();
}

function initPositionCustChart(){
	positionCustChartGroup = svgPosition.append("g")
		.attr("id", "positionCustChartGroup")
		.attr("width", widthCustChart + marginCustChart.left + marginCustChart.right)
		.attr("height", heightCustChart + marginCustChart.top + marginCustChart.bottom)
		.attr("transform", "translate(" + 40 + "," + 455 + ")");
	
	positionCustChartTriangleGroup = positionCustChartGroup.append("g")
		.attr("id", "positionCustChartTriangleGroup")
		.attr("width", widthCustChart + marginCustChart.left + marginCustChart.right)
		.attr("height", heightCustChart + marginCustChart.top + marginCustChart.bottom)
		.attr("transform", "translate(" + 0 + "," + 72 + ")");
	
	positionCustChartTooltipGroup = positionCustChartGroup.append("g")
		.attr("id", "positionCustChartTooltipGroup")
		.attr("width", widthCustChart + marginCustChart.left + marginCustChart.right)
		.attr("height", heightCustChart + marginCustChart.top + marginCustChart.bottom)
		.attr("transform", "translate(" + 0 + "," + 100 + ")");
}

function drawPositionCustChart(level){
	var giiCountryData;
	if(level == 0){
		giiCountryData = getGiiCountryDataArray();
	} else if(level == 1){
		giiCountryData = getGiiPillarDataArray();
	}

	var maxRank = d3.max(giiCountryData.map(function(d) { return parseInt(d.rank); }));
	var maxScore = d3.max(giiCountryData.map(function(d) { return parseFloat(d.score); }));
	var slX = 0;
	CountriesX = [];
	
	positionCustChartGroup.selectAll("rect")
		.remove();
		
	positionCustChartGroup.selectAll("rect")
		.data(giiCountryData)
		.enter()
		.append("rect")
		.sort(sortDescItems)
		.style("fill", function(data){
			if(data.name == "Sri Lanka"){
				return "#FF7900";
			} else {
				return "#215ACD";
			}
		})
		.style("stroke", "#D6E0F6")
		.style("stroke-width", 1)
		.attr("x", function (data, i) {
			if(data.name == "Sri Lanka"){
				slX = (i * (widthCustChart / giiCountryData.length)) - 5;
				positionCustChartTriangleGroup
					.transition()
					.ease("linear-in-out")
					.attr("transform", "translate(" + slX + "," + 72 + ")");
			}
			// for custom chart
			var xVal = (i * (widthCustChart / giiCountryData.length)) - 5;
			CountriesX.push({"cCode": data.code, "cX": xVal, "cRank": data.rank, "cScore": data.score});
			
			return (i * (widthCustChart / giiCountryData.length));
		})
		.attr("y", function(data){
			//return heightCustChart - ((heightCustChart * data.rank) / maxRank);
			return heightCustChart - ((heightCustChart * data.score) / maxScore);
		})
		.attr("width", (widthCustChart / giiCountryData.length))
		.attr("height", function(data, i){
			//return ((heightCustChart * data.rank) / maxRank);
			return ((heightCustChart * data.score) / maxScore);
		})
		.on("mouseover", function(data, i){
			d3.select(this)
				.transition()
				.attr("height", function(data){
					//return ((heightCustChart * data.rank) / maxRank) + 15;
					return ((heightCustChart * data.score) / maxScore) + 15;
				})
				.attr("y", function(data){
					//return heightCustChart - ((heightCustChart * data.rank) / maxRank) - 15;
					return heightCustChart - ((heightCustChart * data.score) / maxScore) - 15;
				});
			
			// set values to bottom tooltip
			d3.select("#positionCustChartTooltipCountry")
				.text(data.name);
			d3.select("#positionCustChartTooltipRank")
				.text(data.rank);
			d3.select("#positionCustChartTooltipScore")
				.text(data.score);
		})
		.on("mousemove", function(){
			positionCustChartTriangleGroup
				.transition()
				.ease("linear-in-out")
				.attr("transform", "translate(" + (d3.mouse(this)[0] - 7) + "," + 72 + ")");
		})
		.on("mouseout", function(data, i){
			d3.select(this)
				.transition()
				.attr("height", function(data){
					//return ((heightCustChart * data.rank) / maxRank);
					return ((heightCustChart * data.score) / maxScore);
				})
				.attr("y", function(data){
					//return heightCustChart - ((heightCustChart * data.rank) / maxRank);
					return heightCustChart - ((heightCustChart * data.score) / maxScore);
				});
			
			giiCountryData.forEach(function(element, index){
				if(element.name.toString() == "Sri Lanka"){
					d3.select("#positionCustChartTooltipCountry").text("Sri Lanka");
					d3.select("#positionCustChartTooltipRank").text(element.rank);
					d3.select("#positionCustChartTooltipScore").text(element.score);
					
					positionCustChartTriangleGroup
						.transition()
						.ease("linear-in-out")
						.attr("transform", "translate(" + slX + "," + 72 + ")");
					
					return;
				}
			});
			
		});
	
	positionCustChartGroup.select("line").remove();
	positionCustChartGroup.append("line")
		.attr("x1", 0)
		.attr("y1", 80)
		.attr("x2", 710)
		.attr("y2", 80)
		.style("stroke-width", 1)
		.style("stroke", "#737373");
	
	positionCustChartTriangleGroup.select("polygon").remove();
	positionCustChartTriangleGroup.append("polygon")
		.attr("points", "7,0 14,8 0,8")
		.style("fill", "#737373")
		.style("stroke-width", 1)
		.style("stroke", "#737373");
	
	// custom chart tooltip group
	//d3.select("#positionCustChartTooltipCountry").remove();
	// remove all previous text
	positionCustChartTooltipGroup.selectAll(".legendText").remove();
	positionCustChartTooltipGroup.append("text")
		.attr("id", "positionCustChartTooltipCountry")
		.attr("class", "legendText")
		.attr("x", 280)
		.attr("y", 10)
		.attr("font-size", "24px")
		.attr("fill", "#00152E")
		.style("font-weight", "bold")
		.style("text-anchor", "end")
		.text("Sri Lanka");
	
	positionCustChartTooltipGroup.append("text")
		.attr("class", "legendText")
		.attr("x", 340)
		.attr("y", 10)
		.attr("font-size", "12px")
		.attr("fill", "#00152E")
		.text("Rank:");
	
	//d3.select("#positionCustChartTooltipRank").remove();
	positionCustChartTooltipGroup.append("text")
		.attr("id", "positionCustChartTooltipRank")
		.attr("class", "legendText")
		.attr("x", 380)
		.attr("y", 10)
		.attr("font-size", "28px")
		.attr("fill", "#00152E")
		.style("font-weight", "bold")
		.text("98");
	
	positionCustChartTooltipGroup.append("text")
		.attr("class", "legendText")
		.attr("x", 460)
		.attr("y", 10)
		.attr("font-size", "12px")
		.attr("fill", "#00152E")
		.text("Score:");
	
	//d3.select("#positionCustChartTooltipScore").remove();
	positionCustChartTooltipGroup.append("text")
		.attr("id", "positionCustChartTooltipScore")
		.attr("class", "legendText")
		.attr("x", 500)
		.attr("y", 10)
		.attr("font-size", "28px")
		.attr("fill", "#00152E")
		.style("font-weight", "bold")
		.text("30.45");
	
	giiCountryData.forEach(function(element, index){
		if(element.name.toString() == "Sri Lanka"){
			d3.select("#positionCustChartTooltipCountry").text("Sri Lanka");
			d3.select("#positionCustChartTooltipRank").text(element.rank);
			d3.select("#positionCustChartTooltipScore").text(element.score);
			return;
		}
	});
}

function changeCustomChartTriangle(countryCode, countryName){
	var countryX = 0;
	var countryRank;
	var countryScore;
	CountriesX.forEach(function(element, index){
		//console.log(element);
		if(countryCode == element.cCode){
			countryX = element.cX;
			countryRank = element.cRank;
			countryScore = element.cScore;
		}
	});
	positionCustChartTriangleGroup
		.transition()
		.ease("linear-in-out")
		.attr("transform", "translate(" + countryX + "," + 72 + ")");
	
	d3.select("#positionCustChartTooltipCountry").text(countryName);
	d3.select("#positionCustChartTooltipRank").text(countryRank);
	d3.select("#positionCustChartTooltipScore").text(countryScore);
}

var sortDescItems = function (a, b) {
        if (a.score > b.score) {
            return -1;
        } else if(a.score < b.score){
        	return 1;
        }
        return 0;
};

var sortAscItems = function (a, b) {
        if (a.score > b.score) {
            return 1;
        } else if(a.score < b.score){
        	return -1;
        }
        return 0;
};

function loadPositionThirdLevel(gii){
	$("#drawarea-position").hide(500);
	$("#radar-chart").hide(500);
	// create position third level
	var tempRand = Math.random() * 5;
	var posThirdLevel = d3.select("#position-third-level");
	posThirdLevel.selectAll("div").remove();
	var panelDefault = posThirdLevel.append("div")
		.attr("class", "panel panel-default");
	panelDefault.append("div")
		.attr("class", "panel-heading")
		.append("h2")
		.attr("class", "panel-title")
		.text(gii);
	var thirdLevelOl = panelDefault.append("ol");
	var subIndicators = getSubIndicatorArray(gii);
	var lineChartOptions = {
		xAxisTitle: "Year",
		yAxisTitle: "",
		lineColor: "brown"
	};

	for (var i = 0; i < subIndicators.length; i++) {
		var thirdLevelLi = thirdLevelOl.append("li")
			.text(subIndicators[i]);
		var str = gii+"-"+i;
		var divId = str.replace(/ /g, "-");
		thirdLevelLi.append("div")
			.attr("id", divId)
			.style("width", "700px")
			.style("height", "150px");
		var lineData = [
			{name: "2010", value: Math.random() * 50},
			{name: "2011", value: Math.random() * 50},
			{name: "2012", value: Math.random() * 50},
			{name: "2013", value: Math.random() * 50}
		];
        var lineChartOptions = {
        	marginTop: 10,
        	marginRight: 10,
        	marginBottom: 40,
        	marginLeft: 20,
			xAxisTitle: "Year",
			yAxisTitle: subIndicators[i],
			lineColor: "brown",
			chartTitleEnabled: false
		};
		var lc = new LineChart(divId, lineData, lineChartOptions);
		lc.draw();
	};
	
	$("#position-third-level").show(500);
	prevPositionSelection = gii;
	
}

// for temporary usage
function getSubIndicatorArray(gii){
	var siArr = new Array();
	if(gii === "ICT access"){
		siArr.push("Fixed Telephone lines (per 100 people)");
		siArr.push("Mobile cellular telephone subscriptions per 100 inhabitants");
		siArr.push("International Internet bandwidth (bit/s)per Internet user");
		siArr.push("Proportion of households with a computer");
		siArr.push("Proportion of households with Internet access at home");
	} else if (gii === "ICT use"){
		siArr.push("Internet users per 100 inhabitants");
		siArr.push("Fixed broadband Internet subscribers per 100 inhabitants");
		siArr.push("Mobile broadband subscriptions per 100 inhabitants");
	}
	return siArr;
}

function getNationalIndicatorArray(gii){
	var niArr = new Array();
	if(gii == "gii"){
		niArr.push("Institutions");
		niArr.push("Human Capital & Research");
		niArr.push("Infrastructure");
		niArr.push("Market sophistication");
		niArr.push("Business sophistication");
		niArr.push("Knowledge & technology outputs");
		niArr.push("Creative outputs");
	} else if(gii == "Institutions"){
		niArr.push("Political environment");
		niArr.push("Political stability");
		niArr.push("Government effectiveness");
		niArr.push("Press freedom");
		niArr.push("Regulatory environment");
		niArr.push("Regulatory quality");
		niArr.push("Rule of law");
		niArr.push("Cost of redundancy dismissal, salary weeks");
		niArr.push("Business environment");
		niArr.push("Ease of starting a business");
		niArr.push("Ease of resolving insolvency");
		niArr.push("Ease of paying taxes");
	} else if (gii == "Human Capital & Research") {
		niArr.push("Education");
		niArr.push("Current expenditure on education, % GNI");
		niArr.push("Public expenditure/pupil, % GDP/cap");
		niArr.push("School life expectancy, years");
		niArr.push("PISA scales in reading, maths & science");
		niArr.push("Pupil-teacher ratio, secondary");
		niArr.push("Tertiary education");
		niArr.push("Tertiary enrolment, % gross");
		niArr.push("Graduates in science & engineering, %");
		niArr.push("Tertiary inbound mobility, %");
		niArr.push("Gross tertiary outbound enrolment, %");
		niArr.push("Research and development (R&D)");
		niArr.push("Researchers, headcounts/mn  pop");
		niArr.push("Gross expenditure on R&D, % GDP");
		niArr.push("QS university ranking, average score top 3");
	} else if(gii == "Infrastructure"){
		niArr.push("Information & communication technologies (ICTs)");
		niArr.push("ICT access");
		niArr.push("ICT use");
		niArr.push("Government’s online service");
		niArr.push("E-participation");
		niArr.push("General infrastructure");
		niArr.push("Electricity output, kWh/cap");
		niArr.push("Electricity consumption, kWh/cap");
		niArr.push("Logistics performance");
		niArr.push("Gross capital formation, % GDP");
		niArr.push("Ecological sustainability");
		niArr.push("GDP/unit of energy use, 2000 PPP$/kg oil eq");
		niArr.push("Environmental performance");
		niArr.push("ISO 14001 environmental certificates/bn PPP$ GDP");
	} else if(gii == "Market sophistication"){
		niArr.push("Credit");
		niArr.push("Ease of getting credit");
		niArr.push("Domestic credit to private sector, % GDP");
		niArr.push("Microfinance gross loans, % GDP");
		niArr.push("Investment");
		niArr.push("Ease of protecting investors");
		niArr.push("Market capitalization, % GDP");
		niArr.push("Total value of stocks traded, % GDP");
		niArr.push("Venture capital deals/tr PPP$ GDP");
		niArr.push("Trade & competition");
		niArr.push("Applied tariff rate, weighted mean, %");
		niArr.push("Non-agricultural mkt access weighted tariff, %");
		niArr.push("Intensity of local competition");
	} else if(gii == "Business sophistication"){
		niArr.push("Knowledge workers");
		niArr.push("Knowledge-intensive employment, %");
		niArr.push("Firms offering formal training, % firms");
		niArr.push("R&D performed by business, % GDP");
		niArr.push("R&D financed by business, %");
		niArr.push("GMAT mean score");
		niArr.push("GMAT test takers/mn pop. 20–34");
		niArr.push("Innovation linkages");
		niArr.push("University/industry research collaboration");
		niArr.push("State of cluster development");
		niArr.push("R&D financed by abroad, %");
		niArr.push("JV–strategic alliance deals/tr PPP$ GDP");
		niArr.push("Patent families filed in 3+ offices/bn PPP$ GDP");
		niArr.push("Knowledge absorption");
		niArr.push("Royalty & license fees payments, % service imports");
		niArr.push("High-tech imports less re-imports, %");
		niArr.push("Comm., computer & info. services imports, %");
		niArr.push("FDI net inflows, % GDP");
		
	} else if(gii == "Knowledge & technology outputs"){
		niArr.push("Knowledge creation");
		niArr.push("Domestic resident patent ap/bn PPP$ GDP");
		niArr.push("PCT resident patent ap/bn PPP$ GDP");
		niArr.push("Domestic res utility model ap/bn PPP$ GDP");
		niArr.push("Scientific & technical articles/bn PPP$ GDP");
		niArr.push("Citable documents H index");
		niArr.push("Knowledge impact");
		niArr.push("Growth rate of PPP$ GDP/worker, %");
		niArr.push("New businesses/th pop. 15–64");
		niArr.push("Computer software spending, % GDP");
		niArr.push("ISO 9001 quality certificates/bn PPP$ GDP");
		niArr.push("High- & medium-high-tech manufactures, %");
		niArr.push("Knowledge diffusion");
		niArr.push("Royalty & license fees receipts, % service exports");
		niArr.push("High-tech exports less re-exports, %");
		niArr.push("Comm., computer & info. services exports, %");
		niArr.push("FDI net outflows, % GDP");
		
	} else if(gii == "Creative outputs"){
		niArr.push("Intangible assets");
		niArr.push("Domestic res trademark reg/bn PPP$ GDP");
		niArr.push("Madrid trademark registrations/bn PPP$ GDP");
		niArr.push("ICT & business model creation");
		niArr.push("ICT & organizational model creation");
		niArr.push("Creative goods & services");
		niArr.push("Audio-visual & related services exports, %");
		niArr.push("National feature films/mn pop. 15–69");
		niArr.push("Paid-for dailies, circulation, % pop. 15–69");
		niArr.push("Printing & publishing manufactures, %");
		niArr.push("Creative goods exports, %");
		niArr.push("Online creativity");
		niArr.push("Generic top-level domains (TLDs)/th pop. 15–69");
		niArr.push("Country-code TLDs/th pop. 15–69");
		niArr.push("Wikipedia monthly edits/mn pop. 15–69");
		niArr.push("Video uploads on YouTube/pop. 15–69");
	}
	return niArr;
}

function getGiiCountryDataArray(){
	var giiCountryData = [
		{"name": "Switzerland", "code": "CH", "rank": "1", "score": "66.59"},
		{"name": "Sweden", "code": "SE", "rank": "2", "score": "61.36"},
		{"name": "United Kingdom", "code": "GB", "rank": "3", "score": "61.25"},
		{"name": "Netherlands", "code": "NL", "rank": "4", "score": "61.14"},
		{"name": "United States of America", "code": "US", "rank": "5", "score": "60.31"},
		{"name": "Finland", "code": "FI", "rank": "6", "score": "59.51"},
		{"name": "Hong Kong (China)", "code": "HK", "rank": "7", "score": "59.43"},
		{"name": "Singapore", "code": "SG", "rank": "8", "score": "59.41"},
		{"name": "Denmark", "code": "DK", "rank": "9", "score": "58.34"},
		{"name": "Ireland", "code": "IE", "rank": "10", "score": "57.91"},
		{"name": "Canada", "code": "CA", "rank": "11", "score": "57.60"},
		{"name": "Luxembourg", "code": "LU", "rank": "12", "score": "56.57"},
		{"name": "Iceland", "code": "IS", "rank": "13", "score": "56.40"},
		{"name": "Israel", "code": "IL", "rank": "14", "score": "55.98"},
		{"name": "Germany", "code": "DE", "rank": "15", "score": "55.83"},
		{"name": "Norway", "code": "NO", "rank": "16", "score": "55.64"},
		{"name": "New Zealand", "code": "NZ", "rank": "17", "score": "54.46"},
		{"name": "Korea, Rep.", "code": "KR", "rank": "18", "score": "53.31"},
		{"name": "Australia", "code": "AU", "rank": "19", "score": "53.07"},
		{"name": "France", "code": "FR", "rank": "20", "score": "52.83"},
		{"name": "Belgium", "code": "BE", "rank": "21", "score": "52.49"},
		{"name": "Japan", "code": "JP", "rank": "22", "score": "52.23"},
		{"name": "Austria", "code": "AT", "rank": "23", "score": "51.87"},
		{"name": "Malta", "code": "MT", "rank": "24", "score": "51.79"},
		{"name": "Estonia", "code": "EE", "rank": "25", "score": "50.60"},
		{"name": "Spain", "code": "ES", "rank": "26", "score": "49.41"},
		{"name": "Cyprus", "code": "CY", "rank": "27", "score": "49.32"},
		{"name": "Czech Republic", "code": "CZ", "rank": "28", "score": "48.36"},
		{"name": "Italy", "code": "IT", "rank": "29", "score": "47.85"},
		{"name": "Slovenia", "code": "SI", "rank": "30", "score": "47.32"},
		{"name": "Hungary", "code": "HU", "rank": "31", "score": "46.93"},
		{"name": "Malaysia", "code": "MY", "rank": "32", "score": "46.92"},
		{"name": "Latvia", "code": "LV", "rank": "33", "score": "45.24"},
		{"name": "Portugal", "code": "PT", "rank": "34", "score": "45.10"},
		{"name": "China", "code": "CN", "rank": "35", "score": "44.66"},
		{"name": "Slovakia", "code": "SK", "rank": "36", "score": "42.25"},
		{"name": "Croatia", "code": "HR", "rank": "37", "score": "41.95"},
		{"name": "United Arab Emirates", "code": "AE", "rank": "38", "score": "41.87"},
		{"name": "Costa Rica", "code": "CR", "rank": "39", "score": "41.54"},
		{"name": "Lithuania", "code": "LT", "rank": "40", "score": "41.39"},
		{"name": "Bulgaria", "code": "BG", "rank": "41", "score": "41.33"},
		{"name": "Saudi Arabia", "code": "SA", "rank": "42", "score": "41.21"},
		{"name": "Qatar", "code": "QA", "rank": "43", "score": "41.00"},
		{"name": "Montenegro", "code": "ME", "rank": "44", "score": "40.95"},
		{"name": "Moldova, Rep.", "code": "MD", "rank": "45", "score": "40.94"},
		{"name": "Chile", "code": "CL", "rank": "46", "score": "40.58"},
		{"name": "Barbados", "code": "BB", "rank": "47", "score": "40.48"},
		{"name": "Romania", "code": "RO", "rank": "48", "score": "40.33"},
		{"name": "Poland", "code": "PL", "rank": "49", "score": "40.12"},
		{"name": "Kuwait", "code": "KW", "rank": "50", "score": "40.02"},
		{"name": "TFYR of Macedonia", "code": "MK", "rank": "51", "score": "38.18"},
		{"name": "Uruguay", "code": "UY", "rank": "52", "score": "38.08"},
		{"name": "Mauritius", "code": "MU", "rank": "53", "score": "38.00"},
		{"name": "Serbia", "code": "RS", "rank": "54", "score": "37.87"},
		{"name": "Greece", "code": "GR", "rank": "55", "score": "37.71"},
		{"name": "Argentina", "code": "AR", "rank": "56", "score": "37.66"},
		{"name": "Thailand", "code": "TH", "rank": "57", "score": "37.63"},
		{"name": "South Africa", "code": "ZA", "rank": "58", "score": "37.60"},
		{"name": "Armenia", "code": "AM", "rank": "59", "score": "37.59"},
		{"name": "Colombia", "code": "CO", "rank": "60", "score": "37.38"},
		{"name": "Jordan", "code": "JO", "rank": "61", "score": "37.30"},
		{"name": "Russian Federation", "code": "RU", "rank": "62", "score": "37.20"},
		{"name": "Mexico", "code": "MX", "rank": "63", "score": "36.82"},
		{"name": "Brazil", "code": "BR", "rank": "64", "score": "36.33"},
		{"name": "Bosnia and Herzegovina", "code": "BA", "rank": "65", "score": "36.24"},
		{"name": "India", "code": "IN", "rank": "66", "score": "36.17"},
		{"name": "Bahrain", "code": "BH", "rank": "67", "score": "36.13"},
		{"name": "Turkey", "code": "TR", "rank": "68", "score": "36.03"},
		{"name": "Peru", "code": "PE", "rank": "69", "score": "35.96"},
		{"name": "Tunisia", "code": "TN", "rank": "70", "score": "35.82"},
		{"name": "Ukraine", "code": "UA", "rank": "71", "score": "35.78"},
		{"name": "Mongolia", "code": "MN", "rank": "72", "score": "35.77"},
		{"name": "Georgia", "code": "GE", "rank": "73", "score": "35.56"},
		{"name": "Brunei Darussalam", "code": "BN", "rank": "74", "score": "35.53"},
		{"name": "Lebanon", "code": "LB", "rank": "75", "score": "35.47"},
		{"name": "Viet Nam", "code": "VN", "rank": "76", "score": "34.82"},
		{"name": "Belarus", "code": "BY", "rank": "77", "score": "34.62"},
		{"name": "Guyana", "code": "GY", "rank": "78", "score": "34.36"},
		{"name": "Dominican Republic", "code": "DO", "rank": "79", "score": "33.28"},
		{"name": "Oman", "code": "OM", "rank": "80", "score": "33.25"},
		{"name": "Trinidad and Tobago", "code": "TT", "rank": "81", "score": "33.17"},
		{"name": "Jamaica", "code": "JM", "rank": "82", "score": "32.89"},
		{"name": "Ecuador", "code": "EC", "rank": "83", "score": "32.83"},
		{"name": "Kazakhstan", "code": "KZ", "rank": "84", "score": "32.73"},
		{"name": "Indonesia", "code": "ID", "rank": "85", "score": "31.95"},
		{"name": "Panama", "code": "PA", "rank": "86", "score": "31.82"},
		{"name": "Guatemala", "code": "GT", "rank": "87", "score": "31.46"},
		{"name": "El Salvador", "code": "SV", "rank": "88", "score": "31.32"},
		{"name": "Uganda", "code": "UG", "rank": "89", "score": "31.21"},
		{"name": "Philippines", "code": "PH", "rank": "90", "score": "31.18"},
		{"name": "Botswana", "code": "BW", "rank": "91", "score": "31.14"},
		{"name": "Morocco", "code": "MA", "rank": "92", "score": "30.89"},
		{"name": "Albania", "code": "AL", "rank": "93", "score": "30.85"},
		{"name": "Ghana", "code": "GH", "rank": "94", "score": "30.60"},
		{"name": "Bolivia, Plurinational St.", "code": "BO", "rank": "95", "score": "30.48"},
		{"name": "Senegal", "code": "SN", "rank": "96", "score": "30.48"},
		{"name": "Fiji", "code": "FJ", "rank": "97", "score": "30.46"},
		{"name": "Sri Lanka", "code": "LK", "rank": "98", "score": "30.45"},
		{"name": "Kenya", "code": "KE", "rank": "99", "score": "30.28"},
		{"name": "Paraguay", "code": "PY", "rank": "100", "score": "30.28"},
		{"name": "Tajikistan", "code": "TJ", "rank": "101", "score": "30.00"},
		{"name": "Belize", "code": "BZ", "rank": "102", "score": "29.98"},
		{"name": "Cape Verde", "code": "CV", "rank": "103", "score": "29.69"},
		{"name": "Swaziland", "code": "SZ", "rank": "104", "score": "29.60"},
		{"name": "Azerbaijan", "code": "AZ", "rank": "105", "score": "28.99"},
		{"name": "Mali", "code": "ML", "rank": "106", "score": "28.84"},
		{"name": "Honduras", "code": "HN", "rank": "107", "score": "28.80"},
		{"name": "Egypt", "code": "EG", "rank": "108", "score": "28.48"},
		{"name": "Namibia", "code": "NA", "rank": "109", "score": "28.36"},
		{"name": "Cambodia", "code": "CO", "rank": "110", "score": "28.07"},
		{"name": "Gabon", "code": "GA", "rank": "111", "score": "28.04"},
		{"name": "Rwanda", "code": "RW", "rank": "112", "score": "27.64"},
		{"name": "Iran, Islamic Rep.", "code": "IR", "rank": "113", "score": "27.30"},
		{"name": "Venezuela, Bolivarian Rep.", "code": "VE", "rank": "114", "score": "27.25"},
		{"name": "Nicaragua", "code": "NI", "rank": "115", "score": "27.10"},
		{"name": "Burkina Faso", "code": "BF", "rank": "116", "score": "27.03"},
		{"name": "Kyrgyzstan", "code": "KG", "rank": "117", "score": "26.98"},
		{"name": "Zambia", "code": "ZM", "rank": "118", "score": "26.79"},
		{"name": "Malawi", "code": "MW", "rank": "119", "score": "26.73"},
		{"name": "Nigeria", "code": "NG", "rank": "120", "score": "26.57"},
		{"name": "Mozambique", "code": "MZ", "rank": "121", "score": "26.50"},
		{"name": "Gambia", "code": "GM", "rank": "122", "score": "26.39"},
		{"name": "Tanzania, United Rep.", "code": "TZ", "rank": "123", "score": "26.35"},
		{"name": "Lesotho", "code": "LS", "rank": "124", "score": "26.29"},
		{"name": "Cameroon", "code": "CM", "rank": "125", "score": "25.71"},
		{"name": "Guinea", "code": "GN", "rank": "126", "score": "25.70"},
		{"name": "Benin", "code": "BJ", "rank": "127", "score": "25.10"},
		{"name": "Nepal", "code": "NP", "rank": "128", "score": "24.97"},
		{"name": "Ethiopia", "code": "ET", "rank": "129", "score": "24.80"},
		{"name": "Bangladesh", "code": "BD", "rank": "130", "score": "24.52"},
		{"name": "Niger", "code": "NE", "rank": "131", "score": "24.03"},
		{"name": "Zimbabwe", "code": "ZW", "rank": "132", "score": "23.98"},
		{"name": "Uzbekistan", "code": "UZ", "rank": "133", "score": "23.87"},
		{"name": "Syrian Arab Republic", "code": "SY", "rank": "134", "score": "23.73"},
		{"name": "Angola", "code": "AO", "rank": "135", "score": "23.46"},
		{"name": "Côte d'Ivoire", "code": "CI", "rank": "136", "score": "23.42"},
		{"name": "Pakistan", "code": "PK", "rank": "137", "score": "23.33"},
		{"name": "Algeria", "code": "DZ", "rank": "138", "score": "23.11"},
		{"name": "Togo", "code": "TG", "rank": "139", "score": "23.04"},
		{"name": "Madagascar", "code": "MG", "rank": "140", "score": "22.95"},
		{"name": "Sudan", "code": "SD", "rank": "141", "score": "19.81"},
		{"name": "Yemen", "code": "YE", "rank": "142", "score": "19.32"}
	];
	return giiCountryData;
}

function getGiiPillarDataArray(){
	var giiPillarData = [
		{"name": "Switzerland", "code": "CH", "rank": "16", "score": "87.3"},
		{"name": "Sweden", "code": "SE", "rank": "10", "score": "89.9"},
		{"name": "United Kingdom", "code": "GB", "rank": "14", "score": "88.4"},
		{"name": "Netherlands", "code": "NL", "rank": "6", "score": "92.8"},
		{"name": "United States of America", "code": "US", "rank": "17", "score": "86.0"},
		{"name": "Finland", "code": "FI", "rank": "2", "score": "95.3"},
		{"name": "Hong Kong (China)", "code": "HK", "rank": "9", "score": "90.8"},
		{"name": "Singapore", "code": "SG", "rank": "7", "score": "92.2"},
		{"name": "Denmark", "code": "DK", "rank": "1", "score": "95.31"},
		{"name": "Ireland", "code": "IE", "rank": "8", "score": "91.9"},
		{"name": "Canada", "code": "CA", "rank": "5", "score": "93.3"},
		{"name": "Luxembourg", "code": "LU", "rank": "19", "score": "83.5"},
		{"name": "Iceland", "code": "IS", "rank": "12", "score": "88.5"},
		{"name": "Israel", "code": "IL", "rank": "56", "score": "65.7"},
		{"name": "Germany", "code": "DE", "rank": "21", "score": "82.5"},
		{"name": "Norway", "code": "NO", "rank": "4", "score": "93.4"},
		{"name": "New Zealand", "code": "NZ", "rank": "3", "score": "95.0"},
		{"name": "Korea, Rep.", "code": "KR", "rank": "32", "score": "76.0"},
		{"name": "Australia", "code": "AU", "rank": "11", "score": "89.4"},
		{"name": "France", "code": "FR", "rank": "24", "score": "79.0"},
		{"name": "Belgium", "code": "BE", "rank": "15", "score": "88.2"},
		{"name": "Japan", "code": "JP", "rank": "20", "score": "83.5"},
		{"name": "Austria", "code": "AT", "rank": "13", "score": "88.5"},
		{"name": "Malta", "code": "MT", "rank": "23", "score": "79.0"},
		{"name": "Estonia", "code": "EE", "rank": "26", "score": "78.2"},
		{"name": "Spain", "code": "ES", "rank": "28", "score": "77.4"},
		{"name": "Cyprus", "code": "CY", "rank": "18", "score": "84.1"},
		{"name": "Czech Republic", "code": "CZ", "rank": "31", "score": "76.1"},
		{"name": "Italy", "code": "IT", "rank": "37", "score": "73.6"},
		{"name": "Slovenia", "code": "SI", "rank": "25", "score": "78.4"},
		{"name": "Hungary", "code": "HU", "rank": "38", "score": "73.5"},
		{"name": "Malaysia", "code": "MY", "rank": "49", "score": "69.0"},
		{"name": "Latvia", "code": "LV", "rank": "29", "score": "77.2"},
		{"name": "Portugal", "code": "PT", "rank": "39", "score": "72.9"},
		{"name": "China", "code": "CN", "rank": "113", "score": "48.3"},
		{"name": "Slovakia", "code": "SK", "rank": "27", "score": "77.4"},
		{"name": "Croatia", "code": "HR", "rank": "48", "score": "69.1"},
		{"name": "United Arab Emirates", "code": "AE", "rank": "33", "score": "75.6"},
		{"name": "Costa Rica", "code": "CR", "rank": "60", "score": "64.3"},
		{"name": "Lithuania", "code": "LT", "rank": "43", "score": "71.4"},
		{"name": "Bulgaria", "code": "BG", "rank": "51", "score": "68.0"},
		{"name": "Saudi Arabia", "code": "SA", "rank": "77", "score": "58.4"},
		{"name": "Qatar", "code": "QA", "rank": "36", "score": "73.8"},
		{"name": "Montenegro", "code": "ME", "rank": "52", "score": "67.9"},
		{"name": "Moldova, Rep.", "code": "MD", "rank": "84", "score": "57.1"},
		{"name": "Chile", "code": "CL", "rank": "40", "score": "72.2"},
		{"name": "Barbados", "code": "BB", "rank": "22", "score": "79.3"},
		{"name": "Romania", "code": "RO", "rank": "55", "score": "66.3"},
		{"name": "Poland", "code": "PL", "rank": "35", "score": "74.4"},
		{"name": "Kuwait", "code": "KW", "rank": "68", "score": "61.4"},
		{"name": "TFYR of Macedonia", "code": "MK", "rank": "58", "score": "65.4"},
		{"name": "Uruguay", "code": "UY", "rank": "45", "score": "70.0"},
		{"name": "Mauritius", "code": "MU", "rank": "53", "score": "38.00"},
		{"name": "Serbia", "code": "RS", "rank": "30", "score": "77.1"},
		{"name": "Greece", "code": "GR", "rank": "53", "score": "67.8"},
		{"name": "Argentina", "code": "AR", "rank": "106", "score": "50.7"},
		{"name": "Thailand", "code": "TH", "rank": "93", "score": "54.1"},
		{"name": "South Africa", "code": "ZA", "rank": "44", "score": "70.1"},
		{"name": "Armenia", "code": "AM", "rank": "57", "score": "65.7"},
		{"name": "Colombia", "code": "CO", "rank": "62", "score": "62.9"},
		{"name": "Jordan", "code": "JO", "rank": "59", "score": "65.0"},
		{"name": "Russian Federation", "code": "RU", "rank": "87", "score": "56.0"},
		{"name": "Mexico", "code": "MX", "rank": "66", "score": "61.8"},
		{"name": "Brazil", "code": "BR", "rank": "95", "score": "53.8"},
		{"name": "Bosnia and Herzegovina", "code": "BA", "rank": "82", "score": "57.2"},
		{"name": "India", "code": "IN", "rank": "102", "score": "51.9"},
		{"name": "Bahrain", "code": "BH", "rank": "46", "score": "69.9"},
		{"name": "Turkey", "code": "TR", "rank": "89", "score": "55.8"},
		{"name": "Peru", "code": "PE", "rank": "67", "score": "61.5"},
		{"name": "Tunisia", "code": "TN", "rank": "61", "score": "63.4"},
		{"name": "Ukraine", "code": "UA", "rank": "105", "score": "51.4"},
		{"name": "Mongolia", "code": "MN", "rank": "63", "score": "62.5"},
		{"name": "Georgia", "code": "GE", "rank": "47", "score": "69.4"},
		{"name": "Brunei Darussalam", "code": "BN", "rank": "34", "score": "74.4"},
		{"name": "Lebanon", "code": "LB", "rank": "79", "score": "57.9"},
		{"name": "Viet Nam", "code": "VN", "rank": "122", "score": "46.6"},
		{"name": "Belarus", "code": "BY", "rank": "107", "score": "50.4"},
		{"name": "Guyana", "code": "GY", "rank": "86", "score": "56.1"},
		{"name": "Dominican Republic", "code": "DO", "rank": "98", "score": "52.8"},
		{"name": "Oman", "code": "OM", "rank": "41", "score": "71.6"}, // edit point
		{"name": "Trinidad and Tobago", "code": "TT", "rank": "69", "score": "61.3"},
		{"name": "Jamaica", "code": "JM", "rank": "54", "score": "67.8"},
		{"name": "Ecuador", "code": "EC", "rank": "131", "score": "43.3"},
		{"name": "Kazakhstan", "code": "KZ", "rank": "64", "score": "62.4"},
		{"name": "Indonesia", "code": "ID", "rank": "138", "score": "37.2"},
		{"name": "Panama", "code": "PA", "rank": "74", "score": "58.8"},
		{"name": "Guatemala", "code": "GT", "rank": "110", "score": "49.0"},
		{"name": "El Salvador", "code": "SV", "rank": "78", "score": "57.9"},
		{"name": "Uganda", "code": "UG", "rank": "85", "score": "56.9"},
		{"name": "Philippines", "code": "PH", "rank": "128", "score": "44.8"},
		{"name": "Botswana", "code": "BW", "rank": "42", "score": "71.5"},
		{"name": "Morocco", "code": "MA", "rank": "81", "score": "57.7"},
		{"name": "Albania", "code": "AL", "rank": "73", "score": "58.9"},
		{"name": "Ghana", "code": "GH", "rank": "100", "score": "52.5"},
		{"name": "Bolivia, Plurinational St.", "code": "BO", "rank": "140", "score": "33.0"},
		{"name": "Senegal", "code": "SN", "rank": "91", "score": "54.7"},
		{"name": "Fiji", "code": "FJ", "rank": "75", "score": "58.6"},
		{"name": "Sri Lanka", "code": "LK", "rank": "134", "score": "42.4"},
		{"name": "Kenya", "code": "KE", "rank": "103", "score": "51.5"},
		{"name": "Paraguay", "code": "PY", "rank": "115", "score": "48.1"},
		{"name": "Tajikistan", "code": "TJ", "rank": "120", "score": "46.8"},
		{"name": "Belize", "code": "BZ", "rank": "65", "score": "62.2"},
		{"name": "Cape Verde", "code": "CV", "rank": "76", "score": "58.4"},
		{"name": "Swaziland", "code": "SZ", "rank": "92", "score": "54.4"},
		{"name": "Azerbaijan", "code": "AZ", "rank": "99", "score": "52.7"},
		{"name": "Mali", "code": "ML", "rank": "101", "score": "51.9"},
		{"name": "Honduras", "code": "HN", "rank": "117", "score": "47.3"},
		{"name": "Egypt", "code": "EG", "rank": "130", "score": "43.9"},
		{"name": "Namibia", "code": "NA", "rank": "50", "score": "68.6"},
		{"name": "Cambodia", "code": "CO", "rank": "116", "score": "48.0"},
		{"name": "Gabon", "code": "GA", "rank": "94", "score": "53.8"},
		{"name": "Rwanda", "code": "RW", "rank": "72", "score": "59.4"},
		{"name": "Iran, Islamic Rep.", "code": "IR", "rank": "132", "score": "42.8"},
		{"name": "Venezuela, Bolivarian Rep.", "code": "VE", "rank": "142", "score": "20.6"},
		{"name": "Nicaragua", "code": "NI", "rank": "97", "score": "53.0"},
		{"name": "Burkina Faso", "code": "BF", "rank": "83", "score": "57.1"},
		{"name": "Kyrgyzstan", "code": "KG", "rank": "109", "score": "49.1"},
		{"name": "Zambia", "code": "ZM", "rank": "111", "score": "48.8"},
		{"name": "Malawi", "code": "MW", "rank": "88", "score": "56.0"},
		{"name": "Nigeria", "code": "NG", "rank": "129", "score": "44.3"},
		{"name": "Mozambique", "code": "MZ", "rank": "108", "score": "49.7"},
		{"name": "Gambia", "code": "GM", "rank": "124", "score": "46.1"},
		{"name": "Tanzania, United Rep.", "code": "TZ", "rank": "80", "score": "57.8"},
		{"name": "Lesotho", "code": "LS", "rank": "70", "score": "61.2"},
		{"name": "Cameroon", "code": "CM", "rank": "119", "score": "46.9"},
		{"name": "Guinea", "code": "GN", "rank": "133", "score": "42.6"},
		{"name": "Benin", "code": "BJ", "rank": "96", "score": "53.3"},
		{"name": "Nepal", "code": "NP", "rank": "125", "score": "45.9"},
		{"name": "Ethiopia", "code": "ET", "rank": "121", "score": "46.6"},
		{"name": "Bangladesh", "code": "BD", "rank": "137", "score": "45.3"},
		{"name": "Niger", "code": "NE", "rank": "104", "score": "51.5"},
		{"name": "Zimbabwe", "code": "ZW", "rank": "141", "score": "24.2"},
		{"name": "Uzbekistan", "code": "UZ", "rank": "126", "score": "45.4"},
		{"name": "Syrian Arab Republic", "code": "SY", "rank": "114", "score": "48.3"},
		{"name": "Angola", "code": "AO", "rank": "136", "score": "40.0"},
		{"name": "Côte d'Ivoire", "code": "CI", "rank": "123", "score": "46.1"},
		{"name": "Pakistan", "code": "PK", "rank": "135", "score": "40.2"},
		{"name": "Algeria", "code": "DZ", "rank": "118", "score": "47.1"},
		{"name": "Togo", "code": "TG", "rank": "112", "score": "48.5"},
		{"name": "Madagascar", "code": "MG", "rank": "90", "score": "55.3"},
		{"name": "Sudan", "code": "SD", "rank": "139", "score": "36.2"},
		{"name": "Yemen", "code": "YE", "rank": "137", "score": "37.3"}
	];
	return giiPillarData;
}

