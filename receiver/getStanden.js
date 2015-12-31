//commentaar
var getSerialData = function() {
	try {
		var fs = require("fs");
		var data = fs.readFileSync('kaifaOutput.txt', 'utf8');
		return filterStanden(data);
	} catch (e) {
		console.log(e);
	}
}

var filterStanden = function(data) {
	
	var asd181, asp182,tsd282,tsp282,as170,ts270,gas,verbruik
	asd181 = getValue(/1-0:1\.8\.1\(([^)]+)\*kW/, data);
	asp182 = getValue(/1-0:1\.8\.2\(([^)]+)\*kW/, data);
	tsd281 = getValue(/1-0:2\.8\.1\(([^)]+)\*kW/, data);
	tsp282 = getValue(/1-0:2\.8\.2\(([^)]+)\*kW/, data);
	as170 = getValue(/1-0:1\.7\.0\(([^)]+)\*kW/, data);
	ts270 = getValue(/1-0:2\.7\.0\(([^)]+)\*kW/, data);
	verbruik = Math.round((as170 - ts270) * 1000);
	gas = getValue(/\(([^)]+)\*m3/, data);
	return [asd181, asp182, tsd281, tsp282, gas, verbruik];
}

var getValue = function(regExp, data) {
	var m = regExp.exec(data);
	if (m) {
		return m[1];
	}
}
module.exports = {
  getSerialData: getSerialData,
  filterStanden: filterStanden
}
