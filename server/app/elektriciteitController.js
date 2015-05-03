angular.module('kaifa').controller('ElektriciteitCtrl', ['state', '$http', '$scope', '$routeParams',
	function (state, $http, $scope) {
		$scope.elektriciteit = state.elektriciteit;
		$scope.theDateChanged = function(theDate) {
			state.elektriciteit.tot = theDate;
			getGrafiek(state.elektriciteit.periode, Math.round(state.elektriciteit.tot.getTime() / 1000));
		};
		$scope.thePeriodChanged = function(periode) {
			state.elektriciteit.periode = periode;
			getGrafiek(state.elektriciteit.periode, Math.round(state.elektriciteit.tot.getTime() / 1000));
		};
		getGrafiek(state.elektriciteit.periode, Math.round(state.elektriciteit.tot.getTime() / 1000));

		function getGrafiek(periode, tot) {
			$http.get('/elektriciteit?periode=' + periode + '&tot=' + tot)//http://localhost:3001/grafiek?periode=dag&tot=1425773728
			.success(function (data) {
				if (!data || data.length === 0) return;
					$scope.data2 = data;
			})
			.error(function (data) {
				$scope.hello = data;
			});
		}
	}]);