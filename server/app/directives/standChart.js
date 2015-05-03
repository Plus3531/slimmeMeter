angular.module('kaifa').directive('standChart', function () {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			data: '=chartData'
		},
		template: '<form class="info">'+
		'<label  for="datum">datum </label><label class="floatRight" id="datum">{{datumA}}</label>'+
		'<br/><br/>'+
		'<label for="gas">gasmeterstand </label><label class="floatRight" id="gas">{{gas}}</label>'+
		'<br/>'+
		'<label for="asp">afgenomen stroom in piektarief </label><label class="floatRight" id="asp">{{asp}}</label>'+
		'<br/>'+
		'<label for="asd">afgenomen stroom in daltarief </label><label class="floatRight" id="asd">{{asd}}</label>'+
		'<br/>'+
		'<label for="tsp">teruggeleverd stroom in piektarief </label><label class="floatRight" id="tsp">{{tsp}}</label>'+
		'<br/>'+
		'<label for="tsd">teruggeleverd stroom in daltarief</label><label class="floatRight" id="tsd">{{tsd}}</label>'+
		'</form>',

		link: function (scope, element, attrs) {
			var focus;
			var max;
			var bisectDate = d3.bisector(function (d) {return d.dag;}).left;
			var formatDate = d3.time.format("%d-%m");
			var margin = {top: 20, right: 50, bottom: 30, left: 50},
				width = 960 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

			var parseDate = d3.time.format("%Y%m%d").parse;
			var x = d3.time.scale().range([0, width]);
			var y = d3.scale.linear().range([height, 0]);

			var color = d3.scale.category10();

			var xAxis = d3.svg.axis().scale(x).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left");

			var line = d3.svg.line().interpolate("basis")
				.x(function(d) { return x(d.dag); })
				.y(function(d) { return y(d.stand); });

			function createStandLine(cData){
				var svg = d3.select("#standChart").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				color.domain(d3.keys(cData[0]).filter(function(key) { return key !== "dag"; }));
				cData.forEach(function(d) {
					d.dag = new Date(d.dag * 1000);
				});

				var standen = color.domain().map(function(name) {
					return {
						name: name,
						values: cData.map(function(d) {
							return {dag: d.dag, stand: +d[name]};
						})
					};
				});

				x.domain(d3.extent(cData, function(d) { return d.dag; }));
				max =d3.max(standen, function(c) { return d3.max(c.values, function(v) { return v.stand; }); });
				y.domain([
					d3.min(standen, function(c) { return d3.min(c.values, function(v) { return v.stand; }); }),
					max
				]);

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("stand");

				var city = svg.selectAll(".city")
					.data(standen)
					.enter().append("g")
					.attr("class", "city");

				city.append("path")
					.attr("class", "line")
					.attr("d", function(d) { return line(d.values); })
					.style("stroke", function(d) { return color(d.name); });

				city.append("text")
					.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
					.attr("transform", function(d) { return "translate(" + x(d.value.dag) + "," + y(d.value.stand) + ")"; })
					.attr("x", 3)
					.attr("dy", ".35em")
					.text(function(d) { return d.name; });

						// append the rectangle to capture mouse
				svg.append("rect")
					.attr("width", width)
					.attr("height", height)
					.style("fill", "none")
					.style("pointer-events", "all")
					.on("mouseover", function() { focus.style("display", null); })
					.on("mouseout", function() { focus.style("display", "none"); })
					.on("mousemove", mousemove);
				focus = svg.append("g")
					.style("display", "none");
				// append the position line
				focus.append("line")
					.attr("class", "x")
					.style("stroke", "blue")
					.style("stroke-dasharray", "3,3")
					.style("opacity", 0.5)
					.attr("y1", 0)
					.attr("y2", height);
			}
			function mousemove() {
				var x0 = x.invert(d3.mouse(this)[0]),
					index = bisectDate(scope.data, x0, 1),
					d0 = scope.data[index - 1],
					d1 = scope.data[index],
					d = x0 - d0.dag > d1.dag - x0 ? d1 : d0;
				focus.select(".x")
					.attr("transform",
					"translate(" + x(d.dag) + "," +
					y(max) + ")")
					.attr("y2", height);
				scope.$apply(function(){
					scope.datumA = formatDate(d.dag);
					scope.asd = (Math.round(d.asd * 10)/10).toFixed(1);
					scope.asp = (Math.round(d.asp* 10)/10).toFixed(1);
					scope.tsd = (Math.round(d.tsd * 10)/10).toFixed(1);
					scope.tsp = (Math.round(d.tsp * 10)/10).toFixed(1);
					scope.gas = (Math.round(d.gas * 10)/10).toFixed(1);
				});
			}
			scope.$watch('data', function(newValue) {
				if (!newValue) return;
				//prepare the data again
				var svg = d3.select("#standChart").select("svg");
				svg.remove();
				createStandLine(newValue);
			});
		}
	};
});