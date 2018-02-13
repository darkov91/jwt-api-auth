var expect = require('chai').expect;
var TokenBlacklist = require('../src/jwt_token_blacklist').TokenBlacklist;

describe('TokenBlacklist', function () {
    describe('invalidateToken(token)', function () {
        it('puts the given token to the blacklist', function() {
            var token = "jwt_token_1";
            var blacklist = new TokenBlacklist();
            
            blacklist.invalidateToken(token);
            expect(blacklist.tokenBlacklist).to.have.own.property(token, true);
        });
    });

    describe('isTokenValid(token)', function () {
        it('returns false when blacklist contains the token', function() {
            var token = "jwt_token_1";
            var blacklist = new TokenBlacklist();
            blacklist.invalidateToken(token);
            
            expect(blacklist.isTokenValid(token)).to.equal(false);
        });
        it('returns true when blacklist doesn\'t contain the token', function() {
            var blacklist = new TokenBlacklist();
            
            expect(blacklist.isTokenValid('jwt_token')).to.equal(true);
        });
    });

    describe('clean()', function () {
        it('sets the token blacklist to an empty object', function() {
            var blacklist = new TokenBlacklist();
            blacklist.invalidateToken('token1');
            blacklist.invalidateToken('token2');
            blacklist.invalidateToken('token3');
            
            blacklist.clean();

            expect(blacklist.tokenBlacklist).to.deep.equal({});
        });
    });
});