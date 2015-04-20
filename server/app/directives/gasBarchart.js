angular.module('kaifa').directive('gasBarchart', function ($parse) {
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

// Parse the date / time
			var	parseDate = d3.time.format("%m %d");

			var x = d3.time.scale();
			//var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
			var y = d3.scale.linear().range([height, 0]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
			.tickFormat(d3.time.format("%H:%M"));

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(5);

			//createBars(scope.data);
			function createBars(cData){
				cData.forEach(function (d) {
					d.interval = new Date(d.interval * 1000);
					d.m3 = +d.m3;
				});
				var svg = d3.select("#gasChart").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				x.domain([cData[0].interval, cData[cData.length - 1].interval]).rangeRound([0, width - margin.left - margin.right]);
				y.domain([0, d3.max(cData, function(d) { return d.m3; })]);

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);


				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				svg.selectAll("bar")
					.data(cData)
					.enter().append("rect")
					.attr("class", "rectBar")
					.style("fill", "steelblue")
					.attr("x", function(d) { return x(d.interval); })
					.attr("width", 3)
					.attr("y", function(d) { return y(d.m3); })
					.attr("height", function(d) { return height - y(d.m3); });
				svg.append("text")
					.attr("class", "x label")
					.attr("text-anchor", "end")
					.attr("x", width)
					.attr("y", height - 6)
					.text(parseDate(cData[0].interval) +" - " + parseDate(cData[cData.length - 1].interval ));
			}

			scope.$watch('data', function(newValue) {
				if (!newValue) return;
				var svg = d3.select("#gasChart").select("svg");
				svg.remove();
				createBars(newValue);
			});
		}
	};
});