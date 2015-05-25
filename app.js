var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var config = require("./config");
var mongoose = require("mongoose");

mongoose.connect(config.db, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("connected to " + config.db);
    }
});

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

//for browsing static files in public directory
app.use(express.static(__dirname + '/public'));

var api = require('./app/routes/api')(app, express);
app.use('/api', api);

app.get('*', function (req, res) {
    console.log("get func "+ __dirname);
    res.sendFile(__dirname + '/public/views/index.html');
});

app.listen(config.port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on port " + config.port);
    }
});