var app = angular.module('kaifa', ['ngRoute'])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
		$routeProvider.when('/Elektra', {
			templateUrl: 'elektriciteit.html',
			controller: 'ElektriciteitCtrl',
			controllerAs: 'elektra'
		}).when('/Gasverbruik', {
			templateUrl: 'gas.html',
			controller: 'GasCtrl'
		}).when('/Standen', {
			templateUrl: 'stand.html',
			controller: 'StandCtrl'
		});
		$locationProvider.html5Mode(true);
	}])
.controller('MainCtrl', ['$scope','$route', '$routeParams', '$location',
	function ($scope, $route, $routeParams, $location) {
		this.$route = $route;
		this.$location = $location;
		this.$routeParams = $routeParams;
		$scope.getActiveIndex = function() {
			if ($location.path().indexOf('Gas') > -1) return 1;
			if ($location.path().indexOf('Elek') > -1) return 0;
			if ($location.path().indexOf('Stand') > -1) return 2;
			return -1;
		}
		$scope.gasIsActive = function() {
			return $location.path().indexOf('Gas') > -1;
		}
		$scope.elektriciteitIsActive = function() {
			return $location.path().indexOf('Elek') > -1;
		}
	}]);
