//cap for http server
var express = require("express");
var httpapp = express();
///

var app = require('./app/app')();
var fs = require('fs');
var config = require("./config");
var privateKey = fs.readFileSync(config.server_key, 'utf8');
var publicKey = fs.readFileSync(config.public_key, 'utf8');

var credentials = {
    key: privateKey, cert: publicKey
};

var http = require('http').createServer(httpapp);
var https = require('https').createServer(credentials, app);

var io = require('socket.io')(https);

//redirect all http queries to https server
httpapp.get('*',function(req,res){
    res.redirect('https://localhost:'+config.sslPort+req.url);
});

//init socket.io
app.init(io);

http.listen(config.port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening http on port " + config.port);
    }
});

https.listen(config.sslPort, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening https on port " + config.sslPort);
    }
});

