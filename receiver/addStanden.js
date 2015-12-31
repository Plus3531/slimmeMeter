try {
	var fs = require("fs");
	var file = "Kaifa.db";
	var sqlite3 = require("sqlite3");
	var db = new sqlite3.Database(file);
	var bla = require('./getStanden');
	var standenArray = bla.getSerialData();
	var collector = {
		datetime:Math.round((new Date()).getTime() / 1000),
		verbruikDatetime: Math.round((new Date()).getTime() / 1000),
		values:[]
	}
	
	db.serialize(function() {
		var insertStanden = db.prepare("INSERT INTO standen (datetime, asd181, asp182, tsd281, tsp282, gas) VALUES (?, ?, ?, ?, ?, ?)");
		var insertVerbruik = db.prepare("INSERT INTO verbruik (datetime, watt) VALUES (?, ?)");
		//Insert random data
		var rnd;
		
			rnd = Math.random();
			setInterval(function(){
				collector.values.push(standenArray[5]);
				var currentTime = Math.round((new Date()).getTime() / 1000)
				if (collector.verbruikDatetime + 10 < currentTime)
				{
					collector.verbruikDatetime = currentTime;
					console.log('verbruik opslaan');
					var arrayLength = collector.values.length;
					var total = 0;
					for (var i in collector.values) { total += collector.values[i]; }
					insertVerbruik.run(currentTime, Math.round(total / arrayLength));
					collector.values = [];
				}
				if (collector.datetime + 30 < currentTime)
				{
					console.log('standen opslaan');
					collector.datetime = currentTime;
					insertStanden.run(currentTime, standenArray[0], standenArray[1], standenArray[2], standenArray[3], standenArray[4]);
				}
			}, 1000);
		
		console.log('final');
		//insertStanden.finalize();
	});
} catch (e) {
	console.log(e);
}