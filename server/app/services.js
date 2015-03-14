angular.module('kaifa').service('unixEpochService', function () {
	this.test = function () { return "Hello pj" };
	this.formatUnixTimestamp = function(unix_timestamp) {
		var date = new Date(unix_timestamp * 1000);
		// hours part from the timestamp
		var hours = date.getHours();
		// minutes part from the timestamp
		var minutes = "0" + date.getMinutes();
		// seconds part from the timestamp
		var seconds = "0" + date.getSeconds();
		
		// will display time in 10:30:23 format
		return hours + ':' + minutes.substr(minutes.length - 2) + ':' + seconds.substr(seconds.length - 2);
	}
	this.formatUnixTimestampDate = function(unix_timestamp) {
		//return new Date(unix_timestamp * 1000);
		var date = new Date(unix_timestamp * 1000);
		var maand = date.getUTCMonth() + 1; //months from 1-12
		var dag = date.getUTCDate();
		var jaar = date.getUTCFullYear();
		return dag + '-' + maand + '-' + jaar;
	}
}).factory('state', function () {
	var state = {
		gas: {
			tot: new Date(), periode: 'dag'
		},
		elektriciteit: {
			periode: 'dag', tot: new Date()
		}
	};
	return state;
});