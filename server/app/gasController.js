angular.module('kaifa').controller('GasCtrl', ['unixEpochService', 'state', '$http', '$scope',
	function (unixEpochService, state, $http, $scope) {
		$scope.gas = state.gas;
		var cd = new Date();
		//go 30 days back in time
		$scope.gas.standVan = new Date(Math.round((cd.getTime() - 30*24*60*60*1000)/100000) * 100000);
		$scope.gas.standTot = new Date(Math.round(cd.getTime()/10000000) * 10000000);

		$scope.open = function($event,opened) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope[opened] = true;
		};
		$scope.datetimeChange = function () {
			state.gas.tot = $scope.gas.tot;
			getGrafiek(state.gas.periode, Math.round(state.gas.tot.getTime() / 1000));
		};
		$scope.$watch(function (scope) { return scope.gas.periode; },
		function (newValue) {
			state.gas.periode = newValue;
			getGrafiek(newValue, Math.round(state.gas.tot.getTime() / 1000));
		});
		$scope.getDagGrafiek = function(van, tot) {
			$scope.optionsDag = {
				axes: {
					x: {
						key: 'dag',
						type: 'date',
						ticks: 10
					},
					y: {
						type: 'linear', labelFunction: function (value) {
							return value;
						}
					}
				},
				series: [{
					y: 'm3',
					color: 'red',
					thickness: '1px',
					label: 'testLabel',
					type: 'linear',
					striped: false
				}],
				lineMode: 'linear',
				tension: 0.7,
				//tooltip: { mode: 'scrubber', formatter: toolTip },
				drawLegend: true,
				drawDots: false,
				columnsHGap: 50
			};
			$scope.dataDag = [{ "dag": '2015/03/22', "m3": 5432 },{ "dag": '2015/03/23', "m3": 5932 },{ "dag": '2015/03/24', "m3": 5032 }];
		}

		function getGrafiek(periode, tot) {
			$http.get('/gas?periode=' + periode + '&tot=' + tot)
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
							type: 'linear', labelFunction: function (value) {
								return value;
							}
						}
					},
					series: [{
							y: 'm3',
							color: 'red',
							thickness: '1px',
							label: theLabel,
							type: 'column',
							striped: false
						}],
					lineMode: 'linear',
					tension: 0.7,
					tooltip: { mode: 'scrubber', formatter: toolTip },
					drawLegend: true,
					drawDots: false,
					columnsHGap: 50
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