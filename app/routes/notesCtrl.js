var Note = require("../models/note");
var notesController = function (io) {
    var controller = {
        createNewNote: createNewNote,
        deleteUserNote: deleteUserNote
    };

    function createNewNote(req, res) {
        var note = new Note({
            creator: req.decoded.id,
            data: req.body.data,
            translation: req.body.translation,
            description: req.body.description,
            tags: req.body.tags
        });

        note.save(function (err, newNote) {
            if (err) {
                res.send(err);
                return;
            }
            //emit socket.io event here
            io.emit('newNote', newNote);
            res.json({
                success: 'true',
                data: newNote.data,
                message: 'New story created'
            });
        });
    }

    function deleteUserNote(req, res) {

        var item = Note.findOne({_id: req.params.noteId, creator: req.decoded.id}, function (err, data) {
            if (err) {
                res.send(err);
                return;
            }
            //if we found the item
            if (data) {
                data.remove();
                res.json({success:"true", message: "item " + req.params.noteId + " removed"});
                io.emit('noteDeleted', req.params.noteId);
            }
            else {
                res.status(404);
                res.json({message: "item not found"});
            }
        });

    }

    return controller;
};

module.exports = notesController;
