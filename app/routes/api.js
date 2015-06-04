var User = require('../models/user'),
    Story = require('../models/story'),
    authToken = require('../modules/authentication');


module.exports = function (app, express, io) {

    var api = express.Router();

    var homeController = require('./homeCtrl');
    //home controller//
    //GET List all stories
    //api.get('/all_stories', homeController.getAllStories);

    //POST signup user
    api.post('/signup', homeController.signup);

    //POST Login user
    api.post('/login', homeController.login);
    //END of homeController//

    //Middleware for check login token
    api.use(authToken);
    //Bellow here authorized methods only


    //storiesController//
    var storiesController = require('./storiesCtrl')(io);
    api.route('/stories')
        //POST /api/stories add new story
        .post(storiesController.createUserStory)
        //GET /api/stories get all user's stories
        .get(storiesController.getUserStories)
        //PUT /api/stories update all stories from req.body.stories
        //TODO implement PUT method
        .put(storiesController.updateUserStories);

    api.route('/stories/:story_id')
        //GET /api/stories/{id} post by _id
        //TODO implement method
        .get(storiesController.getStory)
        //DELETE /api/stories/{id} delete story by _id
        .delete(storiesController.deleteUserStory)
        //POST /api/stories/{id} return method not allowed
        .post(storiesController.notAllowed);
    //END of storiesController//

    //
    var notesController = require('./notesCtrl')(io);
    api.route('/notes')
        //POST /api/notes create new note
        .post(notesController.createNewNote);
    //
    api.route('/notes/:noteId')
        .delete(notesController.deleteUserNote);

    api.get('/me', function (req, res) {
        res.json(req.decoded);
    });


    return api;
};