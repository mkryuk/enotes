var Note = require("../models/note");
var notesController = function (io) {
    var controller = {
        createNewNote: createNewNote,
        deleteUserNote: deleteUserNote,
        deleteAllUserNotes: deleteAllUserNotes,
        getAllUserNotes: getAllUserNotes,
        getUserNoteById: getUserNoteById,
        updateUserNoteById: updateUserNoteById,
        notAllowed: notAllowed
    };

    //POST /api/notes create new note
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

    //GET /api/notes get all user notes
    function getAllUserNotes(req, res) {
        Note.find({creator: req.decoded.id}, function (err, data) {
            if (err) {
                res.send(err);
                return;
            }
            var notes = [];
            data.forEach(function (item) {
                var note = {
                    id: item._id,
                    creator: item.creator,
                    data: item.data,
                    translation: item.translation,
                    description: item.description,
                    tags: item.tags,
                    href: "/api/notes/" + item._id
                };
                notes.push(note);
            });
            res.json(notes);
        });
    }

    //DELETE /api/notes delete all user notes
    function deleteAllUserNotes(req, res) {

        Note.remove({creator: req.decoded.id}, function (err, data) {
            if (err) {
                res.status(400);
                res.send(err);
                return;
            }
            res.status(200);
            res.json({success: 'true', message: "all items deleted", deleted: data});

        });
    }

    //DELETE /api/notes/noteId delete user note by id
    function deleteUserNote(req, res) {

        Note.findOne({_id: req.params.noteId, creator: req.decoded.id}, function (err, data) {
            if (err) {
                res.send(err);
                return;
            }
            //if we found the item
            if (data) {
                data.remove();
                res.json({success: "true", message: "item " + req.params.noteId + " removed"});
                io.emit('noteDeleted', req.params.noteId);
            }
            else {
                res.status(404);
                res.json({message: "item not found"});
            }
        });
    }

    //GET /api/notes/noteId get user note by id
    function getUserNoteById(req, res) {
        Note.findOne({_id: req.params.noteId, creator: req.decoded.id}, function (err, item) {
            if (err) {
                res.send(err);
                return;
            }
            //if we found the item
            if (item) {
                var note = {
                    id: item._id,
                    data: item.data,
                    translation: item.translation,
                    description: item.description,
                    tags: item.tags
                };
                res.json(note);
                //io.emit('noteDeleted', req.params.noteId);
            }
            else {
                res.status(404);
                res.json({message: "item not found"});
            }
        });
    }

    //PUT /api/notes/noteId update user note by id
    function updateUserNoteById(req, res) {
        Note.update({_id: req.params.noteId},
            {
                $set: {
                    data: req.body.data,
                    translation: req.body.translation,
                    description: req.body.description,
                    tags: req.body.tags
                }
            },
            function (err, response) {
                if (err) {
                    console.log(err);
                    res.send(err);
                    return;
                }
                res.json({
                    success: 'true',
                    data: response,
                    message: 'Note ' + req.params.noteId + ' updated'
                });
            });
    }

    function notAllowed(req, res) {
        res.status(405);
        res.json({message: "Method not allowed"});
    }

    return controller;
};

module.exports = notesController;
