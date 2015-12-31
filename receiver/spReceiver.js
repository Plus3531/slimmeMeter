var sp = require("serialport");
var SerialPort = sp.SerialPort;
var serialPort = new SerialPort("COM4", {
	baudrate: 115200,
	parser: sp.parsers.readline('!')
});

var standenModule = require('./getStanden');
	
var fs = require("fs");
var file = "../data/Kaifa.db";
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database(file);
var insertStanden = db.prepare("INSERT INTO standen (datetime, asd181, asp182, tsd281, tsp282, gas) VALUES (?, ?, ?, ?, ?, ?)");
var insertVerbruik = db.prepare("INSERT INTO verbruik (datetime, watt) VALUES (?, ?)");
var collector = {
	datetime:Math.round((new Date()).getTime() / 1000),
	verbruikDatetime: Math.round((new Date()).getTime() / 1000),
	values:[]
}
	
serialPort.on("open", function () {
	console.log('open');
	serialPort.on('data', function(data) {
		var standenArray = standenModule.filterStanden(data);
		collector.values.push(standenArray[5]);
		console.log('data received: ' + standenArray);
		var currentTime = Math.round((new Date()).getTime() / 1000)
		if (collector.verbruikDatetime + 60 < currentTime)
		{
			collector.verbruikDatetime = currentTime;
			console.log('verbruik opslaan');
			var arrayLength = collector.values.length;
			var total = 0;
			for (var i in collector.values) { total += collector.values[i]; }
			insertVerbruik.run(currentTime, Math.round(total / arrayLength));
			collector.values = [];
		}
		if (collector.datetime + 600 < currentTime)
		{
			console.log('standen opslaan');
			collector.datetime = currentTime;
			insertStanden.run(currentTime, standenArray[0], standenArray[1], standenArray[2], standenArray[3], standenArray[4]);
		}
	});
});
