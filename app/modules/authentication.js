var config = require('../../config'),
    secretKey = config.secretKey,
    jsonwebtoken = require('jsonwebtoken');

module.exports = function (req, res, next) {
    var token = req.body.token || req.params.token || req.headers['x-access-token'];

    //check if token exist
    if (token) {
        jsonwebtoken.verify(token, secretKey, function (err, decoded) {
            if (err) {
                res.status(403).send({success: false, message: "Failed to authenticate user"});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).send({success: false, message: "No token provided"});
    }
};
