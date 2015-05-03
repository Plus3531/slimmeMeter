angular.module('kaifa').controller('StandCtrl', ['state', '$http', '$scope', '$routeParams',
	function (state, $http, $scope) {
		$scope.stand = state.stand;
		$scope.theDateChanged = function(theDate) {
			state.stand.tot = theDate;
			getGrafiek(Math.round(state.stand.tot.getTime() / 1000));
		};
		getGrafiek(Math.round(state.stand.tot.getTime() / 1000));

		function getGrafiek(tot) {
			$http.get('/stand?tot=' + tot)
			.success(function (data) {
				if (!data || data.length === 0) return;
					$scope.data = data;
			})
			.error(function (data) {
				$scope.hello = data;
			});
		}
	}]);