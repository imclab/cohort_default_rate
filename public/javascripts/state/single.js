
var jsonFile = (window.location.href.charAt(window.location.href.length-1) == '/') ? window.location.href + 'json' : window.location.href + '/json';
console.log(jsonFile);

var	label = 300,
		w = 620;

d3.json(jsonFile, function(data){

	var unit = w / 100;
	var getBarValue = function(d){
				return d.DRATE_1 * unit;
			},
			getY = function(d, i){
					return i * 25;
			};

	var	svg = d3.select("#chart")
				.append('svg')
				.attr('class', 'bars')
				.attr('width', 940)
				.attr('height', 25 * data.length);

			svg.selectAll('text')
				.data(data)
				.enter()
				.append('text')
				.text(function(d){
					return d.NAME;
				})
				.attr('x',0)
				.attr('y',function(d,i){
						return getY(d,i) + 15;
				});

			svg.selectAll('rect.bounds')
				.data(data)
				.enter()
				.append('rect')
				.attr('class','bounds')
				.attr('x', label)
				.attr('y', getY)
				.attr('height',24)
				.attr('width', w);

			svg.selectAll('rect.bar')
				.data(data)
				.enter()
				.append('rect')
				.attr('class','bar')
				.attr('y', getY)
				.attr('x', function(d){
						return label;
				})
				.attr('height',24)
				.transition().duration(1000)
					.attr('width', function(d){
						return d.DRATE_1 * unit;
					});
		
			svg.selectAll('text.percent')
				.data(data)
				.enter()
				.append('text')
				.text(function(d){
					return d.DRATE_1 + '%';
				})
				.attr('x', label + 5)
				.attr('y', function(d,i){
					return getY(d,i) + 17;
				});

				
			/*svg.selectAll('rect.bar2')
				.data(data)
				.enter()
				.append('rect')
					.attr('class','bar2')
					.attr('y', getY)
					.attr('x', function(d){
							return label;
					})
					.attr('height',24)
					.transition().duration(1000)
						.attr('width', function(d){
							return d.DRATE_2 * unit;
						});


			svg.selectAll('rect.bar2')
				.data(data)
				.enter()
				.append('rect')
					.attr('class','bar3')
					.attr('y', getY)
					.attr('x', function(d){
							return label;
					})
					.attr('height',24)
					.transition().delay(1000).duration(1000)
						.attr('width', function(d){
							return d.DRATE_3 * unit;
						});*/

					


});

/*

var w = 960,
		h = 50,
		m = [5, 40, 20, 120]; // top right bottom left

var chart = bulletChart()
		.width(w - m[1] - m[3])
		.height(h - m[0] - m[2]);

d3.json(jsonFile, function(data) {

	console.log(data);

	var vis = d3.select("#chart").selectAll("svg")
			.data(data)
		.enter().append("svg")
			.attr("class", "bullet")
			.attr("width", w)
			.attr("height", h)
		.append("g")
			.attr("transform", "translate(" + m[3] + "," + m[0] + ")")
			.call(chart);

	var title = vis.append("g")
			.attr("text-anchor", "end")
			.attr("transform", "translate(-6," + (h - m[0] - m[2]) / 2 + ")");

	title.append("text")
			.attr("class", "title")
			.text(function(d) { return d.NAME; });

	title.append("text")
			.attr("class", "subtitle")
			.attr("dy", "1em")
			.text(function(d) { return d.ADDR; });

	chart.duration(1000);
	window.transition = function() {
		vis.datum(randomize).call(chart);
	};
});

function randomize(d) {
	if (!d.randomizer) d.randomizer = randomizer(d);
	d.ranges = d.ranges.map(d.randomizer);
	d.markers = d.markers.map(d.randomizer);
	d.measures = d.measures.map(d.randomizer);
	return d;
}

function randomizer(d) {
	var k = d3.max(d.ranges) * .2;
	return function(d) {
		return Math.max(0, d + k * (Math.random() - .5));
	};
}

// Chart design based on the recommendations of Stephen Few. Implementation
// based on the work of Clint Ivy, Jamie Love, and Jason Davies.
// http://projects.instantcognition.com/protovis/bulletchart/
function bulletChart() {
	var orient = "left", // TODO top & bottom
			reverse = false,
			duration = 0,
			ranges = bulletRanges,
			markers = bulletMarkers,
			measures = bulletMeasures,
			width = 380,
			height = 30,
			tickFormat = null;

	// For each small multipleâ€¦
	function bullet(g) {
		g.each(function(d, i) {
			var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
					markerz = markers.call(this, d, i).slice().sort(d3.descending),
					measurez = measures.call(this, d, i).slice().sort(d3.descending),
					g = d3.select(this);

			// Compute the new x-scale.
			var x1 = d3.scale.linear()
					.domain([0, Math.max(rangez[0], markerz[0], measurez[0])])
					.range(reverse ? [width, 0] : [0, width]);

			// Retrieve the old x-scale, if this is an update.
			var x0 = this.__chart__ || d3.scale.linear()
					.domain([0, Infinity])
					.range(x1.range());

			// Stash the new scale.
			this.__chart__ = x1;

			// Derive width-scales from the x-scales.
			var w0 = bulletWidth(x0),
					w1 = bulletWidth(x1);

			// Update the range rects.
			var range = g.selectAll("rect.range")
					.data(rangez);

			range.enter().append("svg:rect")
					.attr("class", function(d, i) { return "range s" + i; })
					.attr("width", w0)
					.attr("height", height)
					.attr("x", reverse ? x0 : 0)
				.transition()
					.duration(duration)
					.attr("width", w1)
					.attr("x", reverse ? x1 : 0);

			range.transition()
					.duration(duration)
					.attr("x", reverse ? x1 : 0)
					.attr("width", w1)
					.attr("height", height);

			// Update the measure rects.
			var measure = g.selectAll("rect.measure")
					.data(measurez);

			measure.enter().append("svg:rect")
					.attr("class", function(d, i) { return "measure s" + i; })
					.attr("width", w0)
					.attr("height", height / 3)
					.attr("x", reverse ? x0 : 0)
					.attr("y", height / 3)
				.transition()
					.duration(duration)
					.attr("width", w1)
					.attr("x", reverse ? x1 : 0);

			measure.transition()
					.duration(duration)
					.attr("width", w1)
					.attr("height", height / 3)
					.attr("x", reverse ? x1 : 0)
					.attr("y", height / 3);

			// Update the marker lines.
			var marker = g.selectAll("line.marker")
					.data(markerz);

			marker.enter().append("svg:line")
					.attr("class", "marker")
					.attr("x1", x0)
					.attr("x2", x0)
					.attr("y1", height / 6)
					.attr("y2", height * 5 / 6)
				.transition()
					.duration(duration)
					.attr("x1", x1)
					.attr("x2", x1);

			marker.transition()
					.duration(duration)
					.attr("x1", x1)
					.attr("x2", x1)
					.attr("y1", height / 6)
					.attr("y2", height * 5 / 6);

			// Compute the tick format.
			var format = tickFormat || x1.tickFormat(8);

			// Update the tick groups.
			var tick = g.selectAll("g.tick")
					.data(x1.ticks(8), function(d) {
						return this.textContent || format(d);
					});

			// Initialize the ticks with the old scale, x0.
			var tickEnter = tick.enter().append("svg:g")
					.attr("class", "tick")
					.attr("transform", bulletTranslate(x0))
					.style("opacity", 1e-6);

			tickEnter.append("svg:line")
					.attr("y1", height)
					.attr("y2", height * 7 / 6);

			tickEnter.append("svg:text")
					.attr("text-anchor", "middle")
					.attr("dy", "1em")
					.attr("y", height * 7 / 6)
					.text(format);

			// Transition the entering ticks to the new scale, x1.
			tickEnter.transition()
					.duration(duration)
					.attr("transform", bulletTranslate(x1))
					.style("opacity", 1);

			// Transition the updating ticks to the new scale, x1.
			var tickUpdate = tick.transition()
					.duration(duration)
					.attr("transform", bulletTranslate(x1))
					.style("opacity", 1);

			tickUpdate.select("line")
					.attr("y1", height)
					.attr("y2", height * 7 / 6);

			tickUpdate.select("text")
					.attr("y", height * 7 / 6);

			// Transition the exiting ticks to the new scale, x1.
			tick.exit().transition()
					.duration(duration)
					.attr("transform", bulletTranslate(x1))
					.style("opacity", 1e-6)
					.remove();
		});
		d3.timer.flush();
	}

	// left, right, top, bottom
	bullet.orient = function(x) {
		if (!arguments.length) return orient;
		orient = x;
		reverse = orient == "right" || orient == "bottom";
		return bullet;
	};

	// ranges (bad, satisfactory, good)
	bullet.ranges = function(x) {
		if (!arguments.length) return ranges;
		ranges = x;
		return bullet;
	};

	// markers (previous, goal)
	bullet.markers = function(x) {
		if (!arguments.length) return markers;
		markers = x;
		return bullet;
	};

	// measures (actual, forecast)
	bullet.measures = function(x) {
		if (!arguments.length) return measures;
		measures = x;
		return bullet;
	};

	bullet.width = function(x) {
		if (!arguments.length) return width;
		width = x;
		return bullet;
	};

	bullet.height = function(x) {
		if (!arguments.length) return height;
		height = x;
		return bullet;
	};

	bullet.tickFormat = function(x) {
		if (!arguments.length) return tickFormat;
		tickFormat = x;
		return bullet;
	};

	bullet.duration = function(x) {
		if (!arguments.length) return duration;
		duration = x;
		return bullet;
	};

	return bullet;
};

function bulletRanges(d) {
	return [0.0, 25.0,50.0];
}

function bulletMarkers(d) {
	return [0];
}

function bulletMeasures(d) {
	return [d.DRATE_1, d.DRATE_2, d.DRATE_3];
}

function bulletTranslate(x) {
	return function(d) {
		return "translate(" + x(d) + ",0)";
	};
}

function bulletWidth(x) {
	var x0 = x(0);
	return function(d) {
		return Math.abs(x(d) - x0);
	};
}
*/