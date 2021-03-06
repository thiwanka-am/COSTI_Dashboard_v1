var RadarChart = {
  draw: function(id, d, options){
  var cfg = {
	 radius: 5,
	 w: 600,
	 h: 600,
	 factor: 1,
	 factorLegend: .85,
	 levels: 3,
	 maxValue: 0,
	 radians: 2 * Math.PI,
	 opacityArea: 0.5,
	 ToRight: 5,
	 TranslateX: 80,
	 TranslateY: 30,
	 ExtraWidthX: 100,
	 ExtraWidthY: 100,
	 color: d3.scale.category10(),
	 lineTitles: [] // lsf edit
	};
	
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){
		  cfg[i] = options[i];
		}
	  }
	}
	cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}));}));
	var allAxis = (d[0].map(function(i, j){return i.axis;}));
	var total = allAxis.length;
	var radius = cfg.factor * Math.min(cfg.w/2, cfg.h/2);
	var Format = d3.format(''); // var Format = d3.format('%');
	d3.select(id).select("svg").remove();
	
	var g = d3.select(id)
			.append("svg")
			.attr("width", cfg.w+cfg.ExtraWidthX)
			.attr("height", cfg.h+cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

	//var tooltip;
	
	//Circular segments
	for(var j = 0; j < cfg.levels; j++){ // removed -1 at j<cfg.levels - 1
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data(allAxis)
	   .enter()
	   .append("svg:line")
	   .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
	   .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
	   .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
	   .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
	   .attr("class", "line")
	   .style("stroke", "grey")
	   .style("stroke-opacity", "0.75")
	   .style("stroke-width", "0.3px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
	}

	//Text indicating at what % each level is
	for(var j = 0; j < cfg.levels; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data([1]) //dummy data
	   .enter()
	   .append("svg:text")
	   .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
	   .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
	   .attr("class", "legend")
	   .style("font-family", "sans-serif")
	   .style("font-size", "10px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
	   .attr("fill", "#737373")
	   .text(Format((j+1)*cfg.maxValue/cfg.levels));
	}
	
	series = 0;

	var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

	axis.append("line")
		.attr("x1", cfg.w/2)
		.attr("y1", cfg.h/2)
		.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		.attr("class", "line")
		.style("stroke", "grey")
		.style("stroke-width", "1px");

	axis.append("text")
		.attr("class", "legend")
		.text(function(d){
			return d;
		})
		.style("font-family", "sans-serif")
		.style("font-size", "11px")
		.attr("text-anchor", function(data, i){
			if(i == 0){
				return "middle";
			} else {
				var rmndr = d[0].length % 2;
				if(rmndr == 0){
					if(i < (d[0].length / 2)){
						return "end";
					} else if (i == (d[0].length / 2)){
						return "middle";
					} else {
						return "start";
					}
				} else {
					if(i <= (d[0].length / 2)){
						return "end";
					} else {
						return "start";
					}
				}
			}
		})
		.attr("dy", "1.5em")
		.attr("transform", function(d, i){return "translate(0, -10)";})
		.attr("x", function(d, i){
			return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-5*Math.sin(i*cfg.radians/total);
			//return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);
		})
		.attr("y", function(d, i){
			return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);
		});

 
	d.forEach(function(y, x){
	  dataValues = [];
	  g.selectAll(".nodes")
		.data(y, function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		  ]);
		});
	  dataValues.push(dataValues[0]);
	  g.selectAll(".area")
					 .data([dataValues])
					 .enter()
					 .append("polygon")
					 .attr("class", "radar-chart-serie"+series)
					 .style("stroke-width", "3px")
					 .style("stroke", cfg.color(series))
					 .attr("points",function(d) {
						 var str="";
						 for(var pti=0;pti<d.length;pti++){
							 str=str+d[pti][0]+","+d[pti][1]+" ";
						 }
						 return str;
					  })
					 .style("fill", function(j, i){return cfg.color(series);})
					 .style("fill-opacity", cfg.opacityArea)
					 .on('mouseover', function (d){
										// z = "polygon."+d3.select(this).attr("class");
										// g.selectAll("polygon")
										 // .transition(200)
										 // .style("fill-opacity", 0.1); 
										// g.selectAll(z)
										 // .transition(200)
										 // .style("fill-opacity", .7);
									  })
					 .on('mouseout', function(){
										// g.selectAll("polygon")
										 // .transition(200)
										 // .style("fill-opacity", cfg.opacityArea);
					 });
	  series++;
	});
	series=0;


	d.forEach(function(y, x){
	  g.selectAll(".nodes")
		.data(y).enter()
		.append("svg:circle")
		.attr("class", "radar-chart-serie"+series)
		.attr('r', cfg.radius)
		.attr("alt", function(j){
			return Math.max(j.value, 0);
		})
		.attr("cx", function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		]);
		return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
		})
		.attr("cy", function(j, i){
		  return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
		})
		.attr("data-id", function(j){return j.axis;})
		.style("fill", cfg.color(series))
		//.style("fill-opacity", .9)
		.style("fill-opacity", 0)
		.style("stroke-opacity", 0)
		.style("stroke-width", 20 + "px")
		.on('mouseover', function (d, axisIndex){
			//newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			//newY =  parseFloat(d3.select(this).attr('cy')) - 5;
			
			//tooltip.attr('x', newX).attr('y', newY).text(Format(d.value)).transition(200).style('opacity', 1);
			// lsf edit
			d3.select(this)
				.transition()
				.duration(500)
				.attr("r", 10)
				.style("fill-opacity", 0.8)
				.style("stroke-width", 10 + "px");
			
			tooltipPositionX = d3.event.pageX - d3.mouse(this)[0] + Number(d3.select(this).attr("cx"));
			tooltipPositionY = d3.event.pageY - d3.mouse(this)[1] + Number(d3.select(this).attr("cy")) - 95 - 10;
			d3.select("#tooltip-title").text(cfg.lineTitles[x]);
			d3.select("#tooltip-value").text(Format(d.value));
			d3.select("#tooltip-desc").text(d.axis);
			d3.select("#tooltip2")
				.transition()
				.delay(500)
				.style("display", "block")
				.style("left", tooltipPositionX + "px")
				.style("top", tooltipPositionY + "px");
			// lsf edit --
				
			// z = "polygon."+d3.select(this).attr("class");
			// g.selectAll("polygon")
				// .transition(200)
				// .style("fill-opacity", 0.1); 
			// g.selectAll(z)
				// .transition(200)
				// .style("fill-opacity", .7);
		  })
		.on('mouseout', function(){
			//tooltip.transition(200).style('opacity', 0);
			// lsf edit
			d3.select(this)
				.transition()
				.duration(500)
				.attr("r", cfg.radius)
				.style("fill-opacity", 0)
				.style("stroke-width", 20 + "px");
			
			d3.select("#tooltip2")
				.transition()
				.style("display", "none");
			// lsf edit --
			
			// g.selectAll("polygon")
				// .transition(200)
				// .style("fill-opacity", cfg.opacityArea);
		
		})
		.on('click', function(data, axisIndex){
			console.log(data.axis + " : " + data.value + ", axisIndex: " + axisIndex);
		})
		//.append("svg:title")
		.text(function(j){
			return Math.max(j.value, 0);
		});

	  series++;
	});
	//Tooltip
	//tooltip = g.append('text').style('opacity', 0).style('font-family', 'sans-serif').style('font-size', '13px');
	
  }
};