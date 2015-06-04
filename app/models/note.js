var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var noteSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User',  required: true},
    data: {type: String, required: true},
    translation: {type: String, required: true},
    description: {type: String, required: false},
    tags: [{type: String, required: false}]
});

//noteSchema.methods.deleteNote =  function(userId, next){
//    var note = this;
//    if (note.creator !== userId) {
//        next({success:"false", message:"permission denied"});
//    } else{
//        note.remove({})
//    }
//};


module.exports = mongoose.model('Note', noteSchema);