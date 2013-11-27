var express = require('express');
var mysql   = require('mysql');
var path    = require('path');

var app = express();

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.bodyParser());

app.get('/', function(req, res){
	res.sendfile(path.resolve('../frontend/html/index.html'));
});

app.listen(80);
console.log("Listening on port 80");
