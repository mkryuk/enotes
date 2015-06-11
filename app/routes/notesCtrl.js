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
    //GET /api/notes?tags=1&tags=2 get all user notes where tags contains 1 or 2
    //GET /api/notes?tags=1&tags=2&offset=1&limit=2 get all user notes where tags contains 1 or 2 skip 1 limit 2
    function getAllUserNotes(req, res) {
        var query = {creator: req.decoded.id};
        //Math.abs to prevent the negative values
        var offset = Math.abs(parseInt(req.query.offset, 10)) || 0;//default offset is 0
        var limit = Math.abs(parseInt(req.query.limit, 10)) || 20;//default limit is 20
        var tags = [];
        if (req.query.tags) {
            if (Array.isArray(req.query.tags))
                tags = req.query.tags;
            else
                tags.push(req.query.tags);
            query = {creator: req.decoded.id, $and: [{"tags": {$in: tags}}]};
        }

        Note.find(query)
            .skip(offset)
            .limit(limit)
            .exec(function (err, data) {
                if (err) {
                    res.send(err);
                    return;
                }
                Note.count(query, function (err, totalCount) {
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

                    function createLinks() {
                        var qs = require('querystring'),
                            baseUrl = '/api/notes';

                        var tagsString = qs.stringify({tags: tags});

                        var first = null,
                            prev = null,
                            next = null,
                            last = null;

                        if (offset > 0) {
                            first = baseUrl + "?" + qs.stringify({tags: tags, offset: 0, limit: limit});
                            prev = baseUrl + "?" + qs.stringify({
                                tags: tags,
                                offset: ((offset - limit) > 0 ? offset - limit : 0),
                                limit: limit
                            });
                        }

                        if (offset + limit < totalCount) {
                            next = baseUrl + "?" + qs.stringify({tags: tags, offset: (offset + limit), limit: limit});
                            last = baseUrl + "?" + qs.stringify({
                                tags: tags,
                                offset: (totalCount - limit),
                                limit: limit
                            });
                        }

                        return {
                            first: first,
                            prev: prev,
                            next: next,
                            last: last
                        };
                    }

                    //Adding X-Total-Count of notes
                    res.append('X-Total-Count', totalCount);

                    var result = {
                        links: createLinks(),
                        notes: notes
                    };

                    res.json(result);
                });
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
