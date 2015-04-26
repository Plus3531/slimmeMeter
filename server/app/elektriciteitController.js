angular.module('kaifa').controller('ElektriciteitCtrl', ['unixEpochService', 'state', '$http', '$scope', '$routeParams',
	function (unixEpochService, state, $http, $scope) {
		$scope.jaren = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
		$scope.maanden = [{name:"jan", id:1}, {name:"feb",id:2}, {name:"mrt",id:3}, {name:"apr",id:4},{name:"mei",id:5},{name:"jun",id:6},{name:"jul",id:7},{name:"aug",id:8},{name:"sep",id:9},{name:"okt",id:10},{name:"nov",id:11}, {name:"dec",id:12}];
		$scope.uren = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
		prepareControls();
		function prepareControls() {
			var theYear = state.elektriciteit.tot.getFullYear();
			var theMonth = state.elektriciteit.tot.getMonth() + 1;

			for (var i = 0; i < $scope.jaren.length; i++) {
				if ($scope.jaren[i] == theYear) {
					$scope.jaar = theYear;
					break;
				}
			}

			for (var i = 0; i < $scope.maanden.length; i++) {
				if ($scope.maanden[i].id == theMonth) {
					$scope.maand = $scope.maanden[i];
					break;
				}
			}
			var daysInMonth = new Date($scope.jaar, $scope.maand.id, 0).getDate();
			$scope.dagen = [];
			for (var i = 1; i <= daysInMonth; i++) {
				$scope.dagen.push(i);
			}
			$scope.dag = state.elektriciteit.tot.getDate();
			$scope.uur = state.elektriciteit.tot.getHours();
		}
		$scope.updateDate = function() {
			state.elektriciteit.tot = new Date($scope.jaar, $scope.maand.id-1, $scope.dag, $scope.uur);
			prepareControls();
			getGrafiek(state.elektriciteit.periode, Math.round(state.elektriciteit.tot.getTime() / 1000));
		};
		getGrafiek(state.elektriciteit.periode, Math.round(state.elektriciteit.tot.getTime() / 1000));
		$scope.elektriciteit = state.elektriciteit;

		$scope.$watch(function (scope) { return scope.elektriciteit.periode; },
		function (newValue) {
			state.elektriciteit.periode = newValue;
			getGrafiek(newValue, Math.round(state.elektriciteit.tot.getTime() / 1000));
		});
		//getGrafiek('dag', 1425773728);
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