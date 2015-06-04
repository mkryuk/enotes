var Story = require('../models/story');
var storiesController = function (io) {

    //Exported functions
    var controller = {
        createUserStory: createUserStory,
        getUserStories: getUserStories,
        updateUserStories: updateUserStories,
        getStory: getStory,
        deleteUserStory: deleteUserStory,
        notAllowed: notAllowed

    };

    //POST /api/stories add new user's story
    function createUserStory(req, res) {
        var story = new Story({
            creator: req.decoded.id,
            content: req.body.content
        });
        story.save(function (err, newStory) {
            if (err) {
                res.send(err);
                return;
            }
            //emit socket.io event here
            io.emit('story', newStory);
            res.json({message: 'New story created'});
        });
    }

    //GET /api/stories get all user's stories
    function getUserStories(req, res) {
        Story.find({creator: req.decoded.id}, function (err, stories) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(stories);
        });
    }

    //PUT /api/stories update all stories from req.body.stories
    function updateUserStories(req, res) {
        res.json({message: "Not implemented"});
    }

    //GET /api/stories/{id} post by _id
    function getStory(req, res) {
        res.json({message: "not implemented"});
    }

    //DELETE /api/stories/{id} delete story by _id
    function deleteUserStory(req, res) {
        var item = Story.findOne({_id: req.params.story_id}, function (err, data) {
            if (err) {
                res.send(err);
                return;
            }
            //if we found the item
            if (data) {
                data.remove();
                res.json({message: "item " + req.params.story_id + " removed"});
                io.emit('story_deleted', req.params.story_id);
            }
            else {
                res.json({message: "item not found"});
            }
        });
    }

    //POST /api/stories/{id} return method not allowed
    function notAllowed(req, res) {
        res.status(405);
        res.json({message: "Method not allowed"});
    }

    return controller;
};

module.exports = storiesController;
