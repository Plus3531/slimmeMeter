angular.module('kaifa').directive('pjDatePicker', function () {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			dateChanged: '&',
			datum: '='
		},
		controller: function($scope, $element){
			$scope.jaren = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
			$scope.maanden = [{name:"jan", id:1}, {name:"feb",id:2}, {name:"mrt",id:3}, {name:"apr",id:4},{name:"mei",id:5},{name:"jun",id:6},{name:"jul",id:7},{name:"aug",id:8},{name:"sep",id:9},{name:"okt",id:10},{name:"nov",id:11}, {name:"dec",id:12}];
			$scope.uren = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
			$scope.updateDate= function() {
				$scope.datum = new Date($scope.jaar, $scope.maand.id-1, $scope.dag, $scope.uur);
				$scope.dateChanged({theDate: $scope.datum});
			}
		},
		link: function (scope, element, attrs) {
			var theYear = scope.datum.getFullYear();
			var theMonth = scope.datum.getMonth() + 1;

			for (var i = 0; i < scope.jaren.length; i++) {
				if (scope.jaren[i] == theYear) {
					scope.jaar = theYear;
					break;
				}
			}

			for (var i = 0; i < scope.maanden.length; i++) {
				if (scope.maanden[i].id == theMonth) {
					scope.maand = scope.maanden[i];
					break;
				}
			}
			var daysInMonth = new Date(scope.jaar, scope.maand.id, 0).getDate();
			scope.dagen = [];
			for (var i = 1; i <= daysInMonth; i++) {
				scope.dagen.push(i);
			}
			scope.dag = scope.datum.getDate();
			scope.uur = scope.datum.getHours();
		},
		template:
		'<div class="datePicker">'+
		'	<span>datum</span><select ng-model="dag" ng-change="updateDate()" ng-options="dag as dag for dag in dagen"><option>--</option></select>' +
		'	<select ng-model="maand" ng-change="updateDate()" ng-options="maand as maand.name for maand in maanden"><option>--</option></select>'+
		'	<select ng-model="jaar" ng-change="updateDate()" ng-options="jaar as jaar for jaar in jaren"><option>--</option></select>'+
		'	<span>uur</span><select ng-model="uur" ng-change="updateDate()" ng-options="uur as uur for uur in uren"><option>--</option></select>'+
		'</div>'
	};
});