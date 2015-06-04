var should = require('should'),
    supertest = require('supertest'),
    app = require('./helpers/app'),
    homeController = require('../app/routes/homeCtrl');

//describe('homeCtrl', function () {
//    it("should get all stories", function (done) {
//        supertest(app)
//            .get('/api/all_stories')
//            .set('Accept', 'application/json')
//            .expect(200)
//            .end(function (err, res) {
//                if (err) return done(err);
//                done();
//            });
//    });
//});

describe('storiesCtrl', function () {
    it('should create new story', function (done) {

        var token = homeController.createToken({_id: 1, name: 'TestName', username: 'TestUsername'});
        supertest(app)
            .post('/api/stories')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should forbid to create new story without authentication', function (done) {
        supertest(app)
            .post('/api/stories')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(403)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});