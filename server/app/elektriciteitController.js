angular.module('kaifa').controller('ElektriciteitCtrl', ['unixEpochService', 'state', '$http', '$scope', '$routeParams',
	function (unixEpochService, state, $http, $scope) {
		$scope.elektriciteit = state.elektriciteit;
		$scope.theDateChanged = function(theDate) {
			state.elektriciteit.tot = theDate;
			getGrafiek(state.elektriciteit.periode, Math.round(state.elektriciteit.tot.getTime() / 1000));
		};
		$scope.periodChanged = function() {
			state.elektriciteit.periode = $scope.elektriciteit.periode;
			getGrafiek(state.elektriciteit.periode, Math.round(state.elektriciteit.tot.getTime() / 1000));
		};
		getGrafiek(state.elektriciteit.periode, Math.round(state.elektriciteit.tot.getTime() / 1000));

		function getGrafiek(periode, tot) {
			$http.get('/elektriciteit?periode=' + periode + '&tot=' + tot)//http://localhost:3001/grafiek?periode=dag&tot=1425773728
			.success(function (data) {
				if (!data || data.length === 0) return;
				$scope.data = data;
					$scope.data2 = data;
					return;
				var minInterval = Math.min.apply(Math, data.map(function (o) {
					return o.interval;
				}));
				var theLabel = unixEpochService.formatUnixTimestampDate(minInterval);
				var maxInterval = Math.max.apply(Math, data.map(function (o) {
					return o.interval;
				}));
				$scope.options = {
					axes: {
						x: {
							key: 'interval',
							labelFunction: (maxInterval - minInterval) > 86400 ? unixEpochService.formatUnixTimestampDate: unixEpochService.formatUnixTimestamp,
							type: 'date',
							//min: minInterval,
							//max: maxInterval,
							ticks: 10
						},
						y: {
							type: 'linear', ticks: 6, labelFunction: function (value) {
								return value;
							}
						}
					},
					series: [{
							y: 'watt',
							color: 'red',
							thickness: '1px',
							label: theLabel,
							type: 'linear',
							striped: true
						}],
					lineMode: 'linear',
					tension: 0.7,
					tooltip: { mode: 'scrubber', formatter: toolTip },
					drawLegend: true,
					drawDots: false
					//columnsHGap: 5
				};
			})
			.error(function (data) {
				$scope.hello = data;
			});
		}
		function toolTip(x, y, series) {
			var dt = unixEpochService.formatUnixTimestamp(x);
			return y + ' ' + dt;
		}
	}]);