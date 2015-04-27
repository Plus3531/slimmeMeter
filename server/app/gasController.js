angular.module('kaifa').controller('GasCtrl', ['state', '$http', '$scope',
	function (state, $http, $scope) {
		$scope.meterstanden = [];
		$scope.gas = state.gas;
		$scope.theDateChanged = function(theDate) {
			state.gas.tot = theDate;
			getGrafiek(state.gas.periode, Math.round(state.gas.tot.getTime() / 1000));
		};
		$scope.periodChanged = function() {
			state.gas.periode = $scope.gas.periode;
			getGrafiek(state.gas.periode, Math.round(state.gas.tot.getTime() / 1000));
		};
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
		getGrafiek(state.gas.periode, Math.round(state.gas.tot.getTime() / 1000));
	}]);