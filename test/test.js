var should = require('should'),
    supertest = require('supertest');

describe('some_test', function () {
    it('should pass', function (done) {
        done();
    });

    it('should not pass', function (done) {
        throw "test dont pass";
        done();
    });
});

