var io = {emit:function(story, newStory){console.log("emit socket.io from test")}};
var app = require('../../app/app')();
app.init(io);
module.exports = app;
