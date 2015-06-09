var supertest = require('supertest'),
    app = require('./helpers/app'),
    homeController = require('../app/routes/homeCtrl'),
    assert = require('assert'),
    User = require('../app/models/user'),
    Note = require('../app/models/note');


var testData = {
    user: {
        name: 'TestName',
        username: 'TestUsername',
        password: '123456'
    },
    note: {
        data: "testdata",
        translation: "testtranslation",
        description: "testdescription",
        tags: ["testTag1", "testTag2"]
    },
    userNote: {}
};

//clear Users and Notes before testing
before(function (done) {
    User.find().remove({}).exec();
    Note.find().remove({}).exec();
    addUser(testData.user, function (user) {
        testData.user = user;
        testData.token = homeController.createToken(user);
        addNote(testData.user, testData.note, function (note) {
            testData.userNote = note;
            done();
        });
    });
});

var addUser = function (user, next) {
    User.findOne(user, function (err, data) {
        if (err) {
            assert(err);
        }
        if (data) {
            next(data);
        } else {
            (new User(user)).save(function (err, data) {
                if (err) {
                    assert(err);
                }
                next(data);
            });
        }
    });
};

var addNote = function (user, note, next) {
    note.creator = user._id;
    Note.findOne(note, function (err, data) {
        if (err) {
            assert(err);
        }
        if (data) {
            next(data);
        } else {
            (new Note(note).save(function (err, data) {
                if (err) assert(err);
                next(data);
            }));
        }
    });
};


describe('CRUD for notes', function () {

    describe('POST /api/notes', function () {
        it("should create new note", function (done) {
            supertest(app)
                .post('/api/notes')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-access-token', testData.token)
                .send(testData.note)
                .expect(200)
                .expect(hasSuccessAndData)
                .expect(checkData)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });

            //check if response has success and data fields
            function hasSuccessAndData(res) {
                assert(res.body.success, "response should have success field");
                assert(res.body.data, "response should have data field");
            }

            //check if request and response data are equal
            function checkData(res) {
                assert.equal(res.body.success, "true", "success should be true");
                assert.equal(res.body.data, testData.note.data, "request and response data should be equal");
            }
        });

    });

    describe('GET /api/notes', function () {
        it("should return all user notes", function (done) {
            supertest(app)
                .get("/api/notes")
                .set('Content-Type', 'application/json')
                .set('x-access-token', testData.token)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('GET /api/notes/noteId', function () {
        it("should get user note by id", function (done) {
            supertest(app)
                .get("/api/notes/" + testData.userNote._id)
                .set('Content-Type', 'application/json')
                .set('x-access-token', testData.token)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('PUT /api/notes/noteId', function () {
        it("should update user note by id", function (done) {
            supertest(app)
                .put("/api/notes/" + testData.userNote._id)
                .set('Content-Type', 'application/json')
                .set('x-access-token', testData.token)
                .expect(200)
                .end(function (err, res) {
                    assert.equal(res.body.success, "true", "success should be true");
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('DELETE /api/notes/noteId', function () {
        it("should delete user note by id and return {success:'true'}", function (done) {
            supertest(app)
                .del("/api/notes/" + testData.userNote._id)
                .set('Content-Type', 'application/json')
                .set('x-access-token', testData.token)
                .expect(200)
                .end(function (err, res) {
                    assert.equal(res.body.success, "true", "success should be true");
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('DELETE /api/notes/', function () {
        it("should delete all user notes", function (done) {
            supertest(app)
                .del("/api/notes/")
                .set('Content-Type', 'application/json')
                .set('x-access-token', testData.token)
                .expect(200)
                .end(function (err, res) {
                    assert.equal(res.body.success, "true", "success should be true");
                    if (err) return done(err);
                    done();
                });
        });
    });
});
