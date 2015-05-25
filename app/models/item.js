var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var itemSchema = new Schema({
    data: {type: String, required: true},
    translation: {type: String, required: true},
    description: {type: String, required: false},
    tags: [{type: String, required: false}]
});

module.exports = mongoose.model('Item', itemSchema);