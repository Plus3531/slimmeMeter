var fs = require("fs");
var file = "kaifa.db";
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database(file);
db.serialize(function() {
	db.run("CREATE INDEX [standenDtIdx] ON [standen]([datetime]  ASC)");
	db.run("CREATE INDEX [verbruikDtIdx] ON [verbruik]([datetime]  ASC)");
	db.run("CREATE VIEW [vwgasverbruik] AS "+
			"SELECT "+
			"   [current].datetime tijdstip, "+
			"   [current].gas meterstand, "+
			"   round((([next].gas - [current].gas)*1000)) verbruik "+
			"FROM "+
			"   standen       as [current] "+
			"LEFT JOIN "+
			"   standen       as [next] "+
			"     ON [next].datetime = (SELECT MIN(standen.datetime) FROM standen WHERE standen.datetime > [current].datetime) "+
			"WHERE verbruik > 0");
});