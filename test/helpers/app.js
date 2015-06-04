var io = {emit:function(story, newStory){}};
var app = require('../../app/app')();
var config = require('../../config');
app.init(config.testDb, io);
module.exports = app;
