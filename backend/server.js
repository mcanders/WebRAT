var express = require('express');
var mysql   = require('mysql');
var path    = require('path');

var app = express();

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.bodyParser());

app.get('/', function(req, res){
	res.sendfile(path.resolve('../frontend/html/index.html'));
});
app.post('/Connect', function(req, res){
	var address = req.body.address;
	var port = req.body.port;
	var user = req.body.user;
	var password = req.body.password;
	var database = req.body.database;

	var connection = mysql.createConnection({
		host     : address,
		user     : user,
		password : password,
		database : database,
		port     : port
	});

	connection.connect(function(err) {
		if(err) {
			console.log(err);
			res.send("failure");
		}
		else {
			connection.query("select * from information_schema.columns where table_schema = ? order by table_name,ordinal_position", [database],function(err, rows) {
				if(err) {
					console.log(err);
					res.send("failure");
				}
				else {
					res.send(JSON.stringify(rows));
				}
				connection.end(function(err) {
				});
			});
		}
	});
});
app.post('/Query', function(req, res){
	var address = req.body.address;
	var port = req.body.port;
	var user = req.body.user;
	var password = req.body.password;
	var database = req.body.database;
	var query = req.body.query;

	var connection = mysql.createConnection({
		host     : address,
		user     : user,
		password : password,
		database : database,
		port     : port
	});

	connection.connect(function(err) {
		if(err) {
			console.log(err);
			res.send("failure");
		}
		else {
			connection.query(query, function(err, rows) {
				if(err) {
					console.log(err.message);
					res.send(JSON.stringify(err.message));
				}
				else {
					res.send(JSON.stringify(rows));
				}
				connection.end(function(err) {
				});
			});
		}
	});
});
app.listen(80);
console.log("Listening on port 80");
