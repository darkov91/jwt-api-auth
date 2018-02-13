var jwtHelper = require('./jwt_helper');
var jsonwebtoken = require('jsonwebtoken');
var routes = require('./authentication_routes');
var User = require('./user_model');

function AuthenticationManager(configuration) {
    this.secret = configuration.secret;
}

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

AuthenticationManager.prototype.setupApp = function(app) {
  var self = this;
  app.use(function(req, res, next) {
    self.checkJWTHeader(req, res, next);
  });

  routes.setupRoutes(app);
}

module.exports.AuthenticationManager = AuthenticationManager;