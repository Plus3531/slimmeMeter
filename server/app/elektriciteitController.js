﻿angular.module('kaifa').controller('ElektriciteitCtrl', ['unixEpochService', 'state', '$http', '$scope', '$routeParams',
	function (unixEpochService, state, $http, $scope, $routeParams) {
		this.name = state.elektriciteit.periode;
		$scope.elektriciteit = state.elektriciteit;
		$scope.datetimeChange = function () {
			state.elektriciteit.tot = $scope.elektriciteit.tot;
			getGrafiek(state.elektriciteit.periode, Math.round(state.elektriciteit.tot.getTime() / 1000));
		};

		$scope.$watch(function (scope) { return scope.elektriciteit.periode; },
		function (newValue) {
			state.elektriciteit.periode = newValue;
			getGrafiek(newValue, Math.round(state.elektriciteit.tot.getTime() / 1000));
		});
		//getGrafiek('dag', 1425773728);
		function getGrafiek(periode, tot) {
			$http.get('/grafiek?periode=' + periode + '&tot=' + tot)//http://localhost:3001/grafiek?periode=dag&tot=1425773728
			.success(function (data) {
				if (!data || data.length === 0) return;
				$scope.data = data;
				var minInterval = Math.min.apply(Math, data.map(function (o) {
					return o.interval;
				}));
				var theLabel = unixEpochService.formatUnixTimestampDate(minInterval);
				var maxInterval = Math.max.apply(Math, data.map(function (o) {
					return o.interval;
				}));
				var minWatt = Math.min.apply(Math, data.map(function (o) {
					return o.watt;
				}));
				var maxWatt = Math.max.apply(Math, data.map(function (o) {
					return o.watt;
				}));
				$scope.options = {
					axes: {
						x: {
							key: 'interval',
							labelFunction: (maxInterval - minInterval) > 86400 ? unixEpochService.formatUnixTimestampDate: unixEpochService.formatUnixTimestamp,
							type: 'date',
							min: minInterval,
							max: maxInterval,
							ticks: 10
						},
						y: {
							type: 'linear', min: minWatt, max: maxWatt, ticks: 6, labelFunction: function (value) {
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
				}
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