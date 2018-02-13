var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var TokenBlacklist = require('./jwt_token_blacklist').TokenBlacklist;
var jwtHelper = require('./jwt_helper');
var User = mongoose.model('User');

// Create the token blacklist and schedule its cleanup.
var tokenBlacklist = new TokenBlacklist();
tokenBlacklist.scheduleCleanup(5);

/**
 * Registers a new user.
 */
exports.register = function(req, res) {
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function(err, user) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            user.hash_password = undefined;
            return res.json(user);
        }
    });
};

/**
 * Handles a sign in request.
 * If the user can be authenticated, returns an authentication token.
 */
exports.signIn = function(req, res) {
    console.log('Attempting sign in');
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).json({
                message: 'Authentication failed - user not found.'
            });
        } else {
            if (!user.comparePassword(req.body.password)) {
                res.status(401).json({
                    message: 'Authentication failed - wrong password.'
                });
            } else {
                return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'secret') });
            }
        }
        
    });
};

/**
 * Handles a logout request.
 * Addes the jwt token to the token blacklist. 
 */
exports.logOut = function(req, res) {
    var jwtToken = jwtHelper.getJwtTokenFromRequestHeader(req);
    if (jwtToken) {
        tokenBlacklist.invalidateToken(jwtToken);
        return res.json({
            message: 'Successfuly logged out.'
        });
    } else {
        res.status(401).json({
            message: 'Logout failed - no jwt token..'
        });
    }
}

/**
 * Cheks whether the user that made the request is authenticated.
 * To be used as middleware to authenticate all the requests.
 */
exports.loginRequired = function(req, res, next) {
    var jwtToken = jwtHelper.getJwtTokenFromRequestHeader(req);
    if (req.user && jwtToken && tokenBlacklist.isTokenValid(jwtToken))
    {
        next();
    }
    else
        return res.status(401).json({ message: 'Unauthorized user.' });
};