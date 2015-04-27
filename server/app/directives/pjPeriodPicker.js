angular.module('kaifa').directive('pjPeriodPicker', function () {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			periodChanged: '&',
			periode: '='
		},
		controller: function($scope, $element){
			$scope.updatePeriod = function() {
				$scope.periodChanged({periode: $scope.periode});
			}
		},
		link: function (scope, element, attrs) {
		},
		template:
		'<div>'
		+'	<label for="r1"><input id="r1" class="pr" type="radio" ng-change="updatePeriod()" ng-model="periode" value="uur"/> Uur </label>'
		+'	<label for="r2"><input id="r2" class="pr" type="radio" ng-change="updatePeriod()" ng-model="periode" value="3uur"/> 3 Uur </label>'
		+'	<label for="r3"><input id="r3" class="pr" type="radio" ng-change="updatePeriod()" ng-model="periode" value="6uur"/> 6 Uur </label>'
		+'	<label for="r4"><input id="r4" class="pr" type="radio" ng-change="updatePeriod()" ng-model="periode" value="12uur"/> 12 Uur </label>'
		+'	<label for="r5"><input id="r5" class="pr" type="radio" ng-change="updatePeriod()" ng-model="periode" value="dag"/> Dag </label>'
		+'	<label for="r6"><input id="r6" class="pr" type="radio" ng-change="updatePeriod()" ng-model="periode" value="week"/> Week </label>'
		+'	<label for="r7"><input id="r7" class="pr" type="radio" ng-change="updatePeriod()" ng-model="periode" value="maand"/> Maand </label>'
		+'	<label for="r8"><input id="r8" class="pr" type="radio" ng-change="updatePeriod()" ng-model="periode" value="6maand"/> 6 Maanden </label>'
		+'	<label for="r9"><input id="r9" class="pr" type="radio" ng-change="updatePeriod()" ng-model="periode" value="jaar"/> Jaar </label>'
		+'</div>'
	};
});