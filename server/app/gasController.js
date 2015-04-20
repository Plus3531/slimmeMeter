angular.module('kaifa').controller('GasCtrl', ['state', '$http', '$scope',
	function (state, $http, $scope) {
		$scope.meterstanden = [];
		//$scope.gasStanden = [{"interval": 1429260333, "m3":900}, {"interval": 1429261333, "m3":400}
		//	, {"interval": 1429262333, "m3":500}, {"interval": 1429264333, "m3":800}];
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

		function getGrafiek(periode, tot) {
			var van = tot - (60 * 60 * 24 * 30);
			getMeterstanden(van, tot);
			function getMeterstanden(van, tot)
			{
				$http.get('/gasmeterstand?van=' + van + '&tot=' + tot)
				.success(function (data) {
					$scope.meterstanden = data;
					})
				.error(function (data) {
					console.log(data);
				})
			}

			$http.get('/gas?periode=' + periode + '&tot=' + tot)
			.success(function (data) {
				if (!data || data.length === 0) return;
				$scope.data = data;
				$scope.gasStanden = data;

			})
			.error(function (data) {
				$scope.hello = data;
			});
		}
	}]);