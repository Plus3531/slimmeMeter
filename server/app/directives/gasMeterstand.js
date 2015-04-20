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