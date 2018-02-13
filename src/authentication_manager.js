var jwtHelper = require('./jwt_helper');
var jsonwebtoken = require('jsonwebtoken');
var User = require('./user_model');
var routes = require('./authentication_routes');
var userController = require('./user_controller');

function AuthenticationManager(configuration) {
    this.secret = configuration.secret;
}

/**
 * A middleware to be used to check the authorization part of the request headers
 * for the JWT token.
 * If the token exists, the method checks whether the token is valid and if it is,
 * sets the decoded user data to the request before passing the execution. 
 * @param {The request to check.} req 
 * @param {The response.} res 
 * @param {The next function.} next 
 */
AuthenticationManager.prototype.checkJWTHeader = function(req, res, next) {
    var jwtToken = jwtHelper.getJwtTokenFromRequestHeader(req);
    if (jwtToken) {
      jsonwebtoken.verify(jwtToken, this.secret, function(err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      });
    } else {
      req.user = undefined;
      next();
    }
  };

/**
 * Sets up the express app so it can use the jwt authentication.
 */
AuthenticationManager.prototype.setupApp = function(app) {
  var self = this;
  app.use(function(req, res, next) {
    self.checkJWTHeader(req, res, next);
  });

  routes.setupRoutes(app);
}

/**
 * Checks whether the login is required for the given request.
 */
AuthenticationManager.prototype.loginRequired = function(req, res, next) {
  return userController.loginRequired(req, res, next);
}

module.exports.AuthenticationManager = AuthenticationManager;