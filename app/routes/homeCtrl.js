var Story = require('../models/story');
var User = require('../models/user');
var jsonwebtoken = require('jsonwebtoken');
var config = require('../../config');
var secretKey = config.secretKey;

//Create authorization token
createToken = function (user) {
    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expiresInMinutes: 1440
    });
    return token;
};

var homeController = {};

//GET /api/all_stories List all stories
homeController.getAllStories = function (req, res) {
    Story.find({}, function (err, stories) {
        if (err) {
            res.send(err);
            return;
        }
        res.json(stories);
    });
};

//POST /api/signup signup user
homeController.signup = function (req, res) {
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
};

//POST /api/login Login user
homeController.login = function (req, res) {
    User.findOne({
        username: req.body.username
    }).select('name username password').exec(function (err, user) {
        if (err) throw err;
        if (!user) {
            res.send({message: "User doesn't exist"});
        } else if (user) {
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.send({message: "Invalid password"});
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
};

module.exports = homeController;