var User = require('../models/user');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonWebToken = require('jsonwebtoken');


var createToken = function (user) {
    var token = jsonWebToken.sign({
        _id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expiresInMinutes: 1440
    });
    return token;
};

module.exports = function (app, express) {

    var api = express.Router();
    api.post('/signup', function (req, res) {

        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });

        user.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({message: 'User ' + user.name + ' has been created'});
        });
    });

    api.get('/users', function (req, res) {
        User.find({}, function (err, users) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(users);
        });
    });

    api.post('/login', function (req, res) {
        User.findOne({
            username: req.body.username
        }).select('password').exec(function (err, user) {
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
    });

    return api;
};