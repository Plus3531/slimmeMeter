angular.module('kaifa').directive('gasMeterstand', function () {
	return {
		restrict: 'E',
		replace: false,
		scope: {
			data: '=chartData'
		},
		link: function (scope, element, attrs) {

			var margin = {top: 20, right: 50, bottom: 30, left: 50},
				width = 960 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

			var x = d3.time.scale().range([0, width]);
			var y = d3.scale.linear().range([height, 0]);

			var xAxis = d3.svg.axis().scale(x).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);
			var valueline = d3.svg.line()
				.x(function (d) {return x(d.tijdstip);})
				.y(function (d) {return y(d.meterstand);});

			var bisectDate = d3.bisector(function (d) {return d.tijdstip;}).left,
				formatValue = d3.format(",.1f"),
				formatDate = d3.time.format("%H:%M");

			//createBars(scope.data);
			function createIncrementalLevel(cData){
				var svg = d3.select("#gasMeterstand").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				var lineSvg = svg.append("g");
				cData.forEach(function (d) {
					d.tijdstip = new Date(d.tijdstip * 1000);
					d.meterstand = +d.meterstand;
				});

				// Scale the range of the data
				x.domain([cData[0].tijdstip, cData[cData.length - 1].tijdstip]);
				y.domain(d3.extent(cData, function (d) {
					return d.meterstand;
				}));
				// Add the valueline path.
				lineSvg.append("path")
					.attr("class", "line")
					.attr("d", valueline(cData));
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);
				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				svg.attr("width", width + margin.left + margin.right);
				svg.attr("height", height + margin.top + margin.bottom);
				svg.append("g");
				svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				var focus = svg.append("g")
					.style("display", "none");

				// append the x line
				focus.append("line")
					.attr("class", "x")
					.style("stroke", "blue")
					.style("stroke-dasharray", "3,3")
					.style("opacity", 0.5)
					.attr("y1", 0)
					.attr("y2", height);

				// append the circle at the intersection
				focus.append("circle")
					.attr("class", "y")
					.style("fill", "none")
					.style("stroke", "blue")
					.attr("r", 4);

				focus.append("text")
					.attr("class", "y2")
					.attr("dx", 8)
					.attr("dy", "-.5em");

				focus.append("text")
					.attr("class", "y4")
					.attr("dx", 8)
					.attr("dy", ".5em");

				// append the rectangle to capture mouse
				svg.append("rect")
					.attr("width", width)
					.attr("height", height)
					.style("fill", "none")
					.style("pointer-events", "all")
					.on("mouseover", function() { focus.style("display", null); })
					.on("mouseout", function() { focus.style("display", "none"); })
					.on("mousemove", mousemove);

				function mousemove() {
					var x0 = x.invert(d3.mouse(this)[0]),
						i = bisectDate(cData, x0, 1),
						d0 = cData[i - 1],
						d1 = cData[i],
						d = x0 - d0.tijdstip > d1.tijdstip - x0 ? d1 : d0;

					focus.select("circle.y")
						.attr("transform",
						"translate(" + x(d.tijdstip) + "," +
						y(d.meterstand) + ")");

					focus.select("text.y2")
						.attr("transform",
						"translate(" + x(d.tijdstip) + "," +
						y(d.meterstand) + ")")
						.text(formatValue(d.meterstand));

					focus.select("text.y4")
						.attr("transform",
						"translate(" + x(d.tijdstip) + "," +
						y(d.meterstand) + ")")
						.text(formatDate(d.tijdstip));

					focus.select(".x")
						.attr("transform",
						"translate(" + x(d.tijdstip) + "," +
						y(d.meterstand) + ")")
						.attr("y2", height - y(d.meterstand));

				}
			}

			scope.$watch('data', function(newValue) {
				if (!newValue || newValue.length < 1) return;
				var svg = d3.select("#gasMeterstand").select("svg");
				svg.remove();
				createIncrementalLevel(newValue);
			});
		}
	};
});