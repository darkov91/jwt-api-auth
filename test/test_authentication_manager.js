var expect = require('chai').expect;
var sinon = require('sinon');
var jsonwebtoken = require('jsonwebtoken');
var AuthenticationManager = require('../src/authentication_manager').AuthenticationManager;

describe('AuthenticationManager', function () {
    describe('checkJWTHeader(req, res, next)', function () {
        it('calls next and sets user to undefined when request has no token', function() {
            var req = {};
            var manager = new AuthenticationManager({
                secret: 'secret'
            });

            var nextSpy = sinon.spy();
            var req = {};
            var res = {};
            manager.checkJWTHeader(req, res, nextSpy);

            sinon.assert.calledOnce(nextSpy);
            expect(req.user).to.be.equal(undefined);
        });

        it('verifies the JWT token when there is a token in the request headers', function() {
            
            var manager = new AuthenticationManager({
                secret: 'secret'
            });

            var verifySpy = sinon.spy(jsonwebtoken, 'verify');
            var req = {
                headers: {
                    authorization: 'JWT sometoken123'
                }
            };
            var res = {};

            manager.checkJWTHeader(req, res, function () {});

            sinon.assert.calledOnce(verifySpy);
        });
    });
});