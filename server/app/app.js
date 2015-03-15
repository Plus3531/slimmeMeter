var app = angular.module('kaifa', ['n3-line-chart', 'ngRoute'])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
		$routeProvider.when('/Elektra', {
			templateUrl: 'elektriciteit.html',
			controller: 'ElektriciteitCtrl',
			controllerAs: 'elektra'
		}).when('/Gass', {
			templateUrl: 'gas.html',
			controller: 'GasCtrl'
		});
		
		$locationProvider.html5Mode(true);
	}])
.controller('MainCtrl', ['$scope','$route', '$routeParams', '$location',
	function ($route, $routeParams, $location) {
		this.$route = $route;
		this.$location = $location;
		this.$routeParams = $routeParams;
	}]);
