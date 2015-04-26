angular.module('kaifa').controller('GasCtrl', ['state', '$http', '$scope',
	function (state, $http, $scope) {
		$scope.jaren = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
		$scope.maanden = [{name:"jan", id:1}, {name:"feb",id:2}, {name:"mrt",id:3}, {name:"apr",id:4},{name:"mei",id:5},{name:"jun",id:6},{name:"jul",id:7},{name:"aug",id:8},{name:"sep",id:9},{name:"okt",id:10},{name:"nov",id:11}, {name:"dec",id:12}];
		$scope.uren = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
		$scope.meterstanden = [];
		//$scope.gasStanden = [{"interval": 1429260333, "m3":900}, {"interval": 1429261333, "m3":400}
		//	, {"interval": 1429262333, "m3":500}, {"interval": 1429264333, "m3":800}];
		$scope.gas = state.gas;
		$scope.theDateChanged = function(theDate) {
			state.gas.tot = theDate;
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