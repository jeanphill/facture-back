require('dotenv').load();

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var login = process.env.DB_USER;
var password = process.env.DB_PASSWORD;

var options = {
	user: login,
	pass: password
};

var con = mongoose.connect(process.env.DB_HOST, options, function(err) {
	if(err) {
		console.log(err);
		return;
	}
});

app.use(bodyParser.urlencoded({ extended: true } ));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, PATCH");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
	next();
});

var port = process.env.PORT || 8000;

var router = require('./router')(express.Router());

app.use('/api', router);

app.listen(port);
console.log('Listenning on port ' + port);
