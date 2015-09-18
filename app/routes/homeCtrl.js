var Story = require('../models/story');
var User = require('../models/user');
var jsonwebtoken = require('jsonwebtoken');
var config = require('../../config');
var secretKey = config.secretKey;

//Exported functions
var homeController = {
    createToken: createToken,
    getAllStories: getAllStories,
    signup: signup,
    login: login
};

module.exports = homeController;

//Create authorization token
function createToken(user) {
    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expiresInMinutes: 1440
    });
    return token;
}


//GET /api/all_stories List all stories
function getAllStories(req, res) {
    Story.find({}, function (err, stories) {
        if (err) {
            res.send(err);
            return;
        }
        res.json(stories);
    });
}

//POST /api/signup signup user
function signup(req, res) {
    var user = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });

    var token = createToken(user);

    user.save(function (err) {
        if (err) {
            res.send(err);
            return;
        }
        res.json({
            success: true,
            message: 'User ' + user.name + ' has been created',
            token: token
        });
    });
}

//POST /api/login Login user
function login(req, res) {
    User.findOne({
        username: req.body.username
    }).select('name username password').exec(function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(404).send({message: "User doesn't exist"});
        } else if (user) {
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.status(404).send({message: "Invalid password"});
            } else {
                //Create token here
                var token = createToken(user);
                res.json({
                    success: true,
                    message: "Successfuly login",
                    token: token
                });
            }
        }
    });
}