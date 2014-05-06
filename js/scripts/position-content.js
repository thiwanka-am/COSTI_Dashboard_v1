
var svgPositionWidth = 780;
var svgPositionHeight = 540;
var isPositionVisited = false;
var svgPosition;

// general chart details
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width = svgPositionWidth - margin.left - margin.right;
var height = 200 - margin.top - margin.bottom;

// line chart data
var positionDatasetLine, positionXDomainLine;
var positionLineChartGroup, positionPath, positionSLLine, positionSALine, positionGALine, positionXScaleLine,
	positionYScaleLine, positionYAxisLine, positionXAxisLine, positionPointsLine;

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
				
				initPositionLineChart();
				drawPositionLineChart("Score");
     			drawRegionMap();
     			drawRadarChart("gii");
     		}
     		isPositionVisited = true;
     	}
	});
	
});

function drawRegionMap(){
	// create AmMap object
    var map = new AmCharts.AmMap();
    // set path to images
    map.pathToImages = "ammap/images/";

    map.balloon.color = "#000000";
    
    map.zoomControl.panControlEnabled = false;
    map.zoomControl.zoomControlEnabled = false;
    
    /* create areas settings
     * autoZoom set to true means that the map will zoom-in when clicked on the area
     * selectedColor indicates color of the clicked area.
     */
    map.areasSettings = {
    	unlistedAreasColor: "#F2F2F2",
    	unlistedAreasOutlineColor: "#F2F2F2",
        autoZoom: false, // not allowing zoom countrys, when click on them
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
        zoomLevel: 10,
        zoomLongitude: 80,
		zoomLatitude: 22
    };
    
    dataProvider.areas = [
	    {
		    title: "Sri Lanka",
		    id: "LK",
		    color: "#1F77B4",
		    customData: "<em>Rank</em>: <strong>98</strong>, Score: <strong>30.45</strong>",
		    groupId: "sl"
	    },{
		    title: "India",
		    id: "IN",
		    color: "#E4CD5C",
		    customData: "Rank: <strong>66</strong>, Score: <strong>36.17</strong>",
		    groupId: "in"
	    },{
		    title: "Nepal",
		    id: "NP",
		    color: "#DA6161",
		    customData: "Rank: <strong>128</strong>, Score: <strong>24.97</strong>",
		    groupId: "np"
	    },{
		    title: "Bangladesh",
		    id: "BD",
		    color: "#34C490",
		    customData: "Rank: <strong>130</strong>, Score: <strong>24.52</strong>",
		    groupId: "bd"
	    },{
		    title: "Pakistan",
		    id: "PK",
		    color: "#56A54B",
		    customData: "Rank: <strong>137</strong>, Score: <strong>23.33</strong>",
		    groupId: "pk"
	    },{
		    title: "Bhutan",
		    id: "BT",
		    color: "#CC7D42",
		    customData: "Rank: <strong>N/A</strong>, Score: <strong>N/A</strong>",
		    groupId: "bt"
	    }
	];
    
    // pass data provider to the map object
    map.dataProvider = dataProvider;

    // write the map to container div
    map.write("region-map-area");
}

function drawRadarChart(gii){
	var colorscale = d3.scale.category10();
	var positionRadarLegendTitles = ['Sri Lanka', 'South Asia', 'Global Average'];
	var dataRadar  = new Array();
	
	var legsArray = getNationalIndicatorArray(gii);
	var legsAndValues = new Array();
	
	if(gii !== "gii"){
		for(var i = 0; i < positionRadarLegendTitles.length; i++){
			for (var j = 0; j < legsArray.length; j++) {
				var obj = {"axis":legsArray[j], "value": getRandomValue(20, 50)};
				legsAndValues.push(obj);
			}
			dataRadar.push(legsAndValues);
			legsAndValues = [];
		}
	} else {
		dataRadar = [
			[
				{axis:"Institutions",value:42.4},
				{axis:"Human Capital & Research",value:19.7},
				{axis:"Infrastructure",value:28.2},
				{axis:"Market sophistication",value:40.6},
				{axis:"Business sophistication",value:22.1},
				{axis:"Knowledge & technology outputs", value:26.4},
				{axis:"Creative outputs",value:34.2}
			],
			[
				{axis:"Institutions",value:45.14},
				{axis:"Human Capital & Research",value:14.8},
				{axis:"Infrastructure",value:23.48},
				{axis:"Market sophistication",value:38.24},
				{axis:"Business sophistication",value:23.34},
				{axis:"Knowledge & technology outputs",value:23.7},
				{axis:"Creative outputs",value:29.84}
			],
			[
				{axis:"Institutions",value:55},
				{axis:"Human Capital & Research",value:46},
				{axis:"Infrastructure",value:47},
				{axis:"Market sophistication",value:59},
				{axis:"Business sophistication",value:42},
				{axis:"Knowledge & technology outputs",value:51},
				{axis:"Creative outputs",value:45}
			]
		];
	}
	
	//Options for the Radar chart, other than default
	var radarCnfg = {
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
	
	RadarChart.draw("#radar-chart", dataRadar, radarCnfg);
	
	// radar chart legend group
	var radarLegendGroup = svgPosition.append("g")
		.attr("id", "radarLegendGroup");
		
	//Initiate Legend
	var legendRadar = radarLegendGroup.append("g")
		.attr('transform', 'translate(90, -10)');
	
	//Create colour squares
	legendRadar.selectAll('rect')
		.data(positionRadarLegendTitles)
		.enter()
		.append("rect")
		.attr("x", function(d, i){
			return 60 + (i * 200); //svgPositionWidth - 300
		})
		.attr("y", 10) //function(d, i){ return i * 20;}
		.attr("width", 16)
		.attr("height", 28)
		.attr("rx", 6)
		.attr("ry", 6)
		.style("fill", function(d, i){
			return colorscale(i);
		});

	//Create text next to squares
	legendRadar.selectAll('text')
		.data(positionRadarLegendTitles)
		.enter()
		.append("text")
		.attr("x", function(d, i){
			return 80 + (i * 200); // svgWidth - 280
		})
		.attr("y", 30) // function(d, i){ return i * 20 + 9;}
		.attr("font-size", "18px")
		.attr("fill", "#737373")
		.attr("font-weight", "bold")
		.text(function(d) {
			return d;
		});
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

// for temporary usage
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
		niArr.push("");
		
	} else if(gii == "Creative outputs"){
		niArr.push("");
		
	}
	return niArr;
}
