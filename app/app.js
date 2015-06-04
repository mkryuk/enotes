var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");
var config = require("../config");
var path = require("path");
var app = express();

module.exports = function () {

    app.init = function(db, io){
        mongoose.connect(db, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("connected to " + db);
            }
        });
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        //for browsing static files in ../public directory
        app.use(express.static(path.dirname(__dirname) + '/public'));
        app.use(morgan('dev'));
        var api = require('./routes/api')(app, express, io);
        app.use('/api', api);

        //route any other requests to index.html
        app.get('*', function (req, res) {
            res.sendFile(path.dirname(__dirname) + '/public/app/views/index.html');
        });
    };

    return app;
};