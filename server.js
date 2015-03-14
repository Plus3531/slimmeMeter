var http = require('http');
var express = require('express');
//var bodyParser = require('body-parser');
var port = process.env.port || 3001;
var app = express();

var fs = require("fs");
var file = __dirname + "/" + "test.db";
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
//app.use(bodyParser());
//app.use(express.static('.'));

app.get('/', function (request, response) {
    //response.send('begin pagina');	
	var responseString = file+':\n';
	//try {
		
		console.log(db);
		var rowss = [];
		db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
			console.log(row.id + ": " + row.thing+ err +'\n');
			rowss.push({"id":row.id, "thing":row.thing});
		}, function() {
			response.send(rowss);
		});
		//response.send(responseString);
		//db.get("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
		//	response.json({"id":row.id, "thing":row.thing})
		//});
			// responseString += row.id + ": " + row.thing+ err +'\n';
		
		// responseString += 'endLoop\n';
		// });
		// responseString += 'end\n';
	// } catch(e) {
		// responseString+='fout:\n'+e;
	// } finally {
		// db.close();
	// }
	//response.send(responseString);
});

app.get('/test', function(request, response) {
	var file = __dirname + "/" + "test.db";
	var exists = fs.existsSync(file);
	response.send(file+ ' ' + exists);
});
app.get('*', function(req, res) {
        res.sendfile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
app.listen(port);

module.exports=app;