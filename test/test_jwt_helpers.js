var expect = require('chai').expect;
var jwtHelper = require('../src/jwt_helper');

describe('jwt_helpers', function () {
    describe('getJwtTokenFromRequestHeader(req)', function () {
        it('returns undefined if no headers on request', function() {
            var req = {};
            expect(jwtHelper.getJwtTokenFromRequestHeader(req)).to.be.an('undefined');
        });
        it('returns undefined undefined if no authorization part in header', function() {
            var req = {headers: {}};
            expect(jwtHelper.getJwtTokenFromRequestHeader(req)).to.be.an('undefined');
        });
        it('returns undefined if not using JWT authorization', function() {
            var req = { 
                headers: {
                    authorization: 'ABC asdfg123tds'
            }};
            expect(jwtHelper.getJwtTokenFromRequestHeader(req)).to.be.an('undefined');
        });
        it('returns the JWT token from a valid header', function() {
            var expectedToken = 'some.jwt.token';
            var req = { 
                headers: {
                    authorization: 'JWT ' + expectedToken
            }};
            expect(jwtHelper.getJwtTokenFromRequestHeader(req)).to.equal(expectedToken);
        });
    });
});