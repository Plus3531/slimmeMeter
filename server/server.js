/// <reference path="typings/node/node.d.ts"/>
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.port || 3001;
var app = express();

//var fs = require("fs");
var file = "../data/Kaifa.db";
//var file = "c:/Users/paulusj/Documents/kaifa/data/Kaifa.db";
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database(file);
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse applicati
app.use(express.static('.'));

//app.get('/', function (req, res) {
//	var responseString = file+':\n';
//	console.log(db);
//	var rowss = [];
//	db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
//		console.log(row.id + ": " + row.thing+ err +'\n');
//		rowss.push({"id":row.id, "thing":row.thing});
//	}, function() {
//		res.send(rowss);
//	});
//});

//url rewrite
//app.use(function(req, res, next) {
// req.url = req.url.replace('/stand', '/elektriciteit');
//  next();
//});

app.get('/stand', function(req, res) {
	if (!req.query.tot || req.query.tot === 0) {
		req.query.tot = new Date().getTime() / 1000;
	}
	var sql = getStanden(req.query.tot - 31536000, req.query.tot);
	var result = [];
	db.each(sql, function(err, row) {
		result.push({ "dag": row.dag, "asd": row.asd, "asp": row.asp, "tsd": row.tsd, "tsp": row.tsp, "gas": row.gas});
	}, function() {
		res.send(result);
	});
});

app.get('/elektriciteit', function (req, res) {
	if (!req.query.periode || req.query.periode === 0) {
		res.status(404).send('Not found');
		return;
	}
	if (!req.query.tot || req.query.tot === 0) {
		res.status(404).send('Not found');
		return;
	}
	var result = [];
	var sql;
	switch (req.query.periode) {
		case 'uur'://stappen van 3 min
			sql = getVerbruik(180, req.query.tot - 3600, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				console.log(row.interval, Math.round(row.watt));
				result.push({ "interval": row.interval, "watt": Math.round(row.watt) });
			}, function () {
				res.send(result);
			});
			break;

		case '3uur'://stappen van 5 min
			sql = getVerbruik(300, req.query.tot - 10800, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				console.log(row.interval, Math.round(row.watt));
				result.push({ "interval": row.interval, "watt": Math.round(row.watt) });
			}, function () {
				res.send(result);
			});
			break;
		case '6uur'://stappen van 10 min
			sql = getVerbruik(600, req.query.tot - 21600, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				console.log(row.interval, Math.round(row.watt));
				result.push({ "interval": row.interval, "watt": Math.round(row.watt) });
			}, function () {
				res.send(result);
			});
			break;
		case '12uur':
			//stappen van kwartier
			sql = getVerbruik(900, req.query.tot - 43200, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				console.log(row.interval, Math.round(row.watt));
				result.push({ "interval": row.interval, "watt": Math.round(row.watt) });
			}, function () {
				res.send(result);
			});
			break;
		case 'dag':
			//stappen van half uur
			sql = getVerbruik(1800, req.query.tot - 86400, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				console.log(row.interval, Math.round(row.watt));
				result.push({ "interval": row.interval, "watt": Math.round(row.watt) });
			}, function () {
				res.send(result);
			});
			break;
		case 'week':
			//stappen van 4 uur
			sql = getVerbruik(14400, req.query.tot - 604800, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				console.log(row.interval, Math.round(row.watt));
				result.push({ "interval": row.interval, "watt": Math.round(row.watt) });
			}, function () {
				res.send(result);
			}); break;
		case 'maand': break;
		case '6maand': break;
		case 'jaar': break;
		default: break;
	}
});
app.get('/gasperdag', function(req, res) {
	if (!req.query.tot || req.query.tot === 0) {
		res.status(404).send('Not found');
		return;
	}
	if (!req.query.van || req.query.van === 0) {
		res.status(404).send('Not found');
		return;
	}
	var result = [];
	var sql = getGasPerDag(req.query.van, req.query.tot);
	db.each(sql, function (err, row) {
		result.push({ "dag": row.dag, "meterstand": row.meterstand, "verbruik": row.verbruik });
	}, function () {
		res.send(result);
	});
});
app.get('/gasmeterstand', function(req, res) {
	if (!req.query.tot || req.query.tot === 0) {
		res.status(404).send('Not found');
		return;
	}
	if (!req.query.van || req.query.van === 0) {
		res.status(404).send('Not found');
		return;
	}
	var result = [];
	var sql = getGasMeterstand(req.query.van, req.query.tot);
	db.each(sql, function (err, row) {
		result.push({ "tijdstip": row.tijdstip, "meterstand": row.meterstand, "verbruik": row.verbruik });
	}, function () {
		res.send(result);
	});
});
app.get('/gas', function (req, res) {
	if (!req.query.periode || req.query.periode === 0) {
		res.status(404).send('Not found');
		return;
	}
	if (!req.query.tot || req.query.tot === 0) {
		res.status(404).send('Not found');
		return;
	}
	var result = [];
	var sql;
	switch (req.query.periode) {
		case 'uur'://stappen van 3 min
			sql = getGasVerbruik(180, req.query.tot - 3600, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				result.push({ "interval": row.interval, "m3": row.m3 });
			}, function () {
				res.send(result);
			});
			break;

		case '3uur'://stappen van 5 min
			sql = getGasVerbruik(300, req.query.tot - 10800, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				result.push({ "interval": row.interval, "m3": row.m3 });
			}, function () {
				res.send(result);
			});
			break;
		case '6uur'://stappen van 10 min
			sql = getGasVerbruik(600, req.query.tot - 21600, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				result.push({ "interval": row.interval, "m3": row.m3 });
			}, function () {
				res.send(result);
			});
			break;
		case '12uur':
			//stappen van kwartier
			sql = getGasVerbruik(900, req.query.tot - 43200, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				result.push({ "interval": row.interval, "m3": row.m3 });
			}, function () {
				res.send(result);
			});
			break;
		case 'dag':
			//stappen van half uur
			sql = getGasVerbruik(1800, req.query.tot - 86400, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				result.push({ "interval": row.interval, "m3": row.m3 });
			}, function () {
				res.send(result);
			});
			break;
		case 'week':
			//stappen van 4 uur
			sql = getGasVerbruik(14400, req.query.tot - 604800, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				result.push({ "interval": row.interval, "m3": row.m3 });
			}, function () {
				res.send(result);
			}); break;
		case 'maand'://stappen van 24 uur
			sql = getGasVerbruik(86400, req.query.tot - 2592000, req.query.tot);
			//var sql = getVerbruik(3600, 1425735891,1425773728);
			db.each(sql, function (err, row) {
				result.push({ "interval": row.interval, "m3": row.m3 });
			}, function () {
				res.send(result);
			}); break;
		case '6maand': break;
		case 'jaar': break;
		default: break;
	}

	//res.send(req.query.periode+' -- '+req.query.tot);
});

app.get('*', function (req, res) {
	res.sendFile('index.html', { root: __dirname }); // load the single view file (angular will handle the page changes on the front-end)
});
app.listen(port);

module.exports = app;

function getVerbruik(interval, van, tot) {
	//return "select datetime(round(verbruik.datetime / " + interval + ") * " + interval + ", 'unixepoch') interval, avg(watt) watt "+
	//	"from verbruik " +
	//	"where verbruik.datetime <= " + tot + " and verbruik.datetime >= " + van + " group by interval";
	return "select ((verbruik.datetime / " + interval + ") * " + interval + ")  interval, avg(watt) watt " +
		"from verbruik " +
		"where verbruik.datetime <= " + tot + " and verbruik.datetime >= " + van + " group by interval";
}
function getGasVerbruik(interval, van, tot) {
	return "select ((tijdstip / " + interval + ") *  " + interval + ") interval, avg(verbruik) m3 " +
	"from vwgasverbruik " +
	"where tijdstip <= " + tot + " and tijdstip >= " + van + " group by interval";
}
function getGasPerDag(van, tot) {
	//var s = "SELECT dag, meterstand, verbruik FROM gasPerDag where dag <= '2015-03-23' and dag >= '2015-03-10'"
	return "SELECT dag, meterstand, verbruik FROM gasPerDag where dag <= '" + tot + "' and dag >= '" + van + "'";
}
function getGasMeterstand(van, tot) {
	return "SELECT tijdstip, meterstand, verbruik FROM vwgasverbruik where tijdstip <= " + tot + " and tijdstip >= " + van;
}
function getStanden(van, tot) {
	return "select ((standen.datetime / 86400) * 86400) dag, " +
		"max(asd181) asd,  max(asp182) asp , max(tsd281) tsd, max(tsp282) tsp,  gas " +
		"from standen where standen.datetime <= " + tot + " and standen.datetime >= " + van + " group by dag";
}