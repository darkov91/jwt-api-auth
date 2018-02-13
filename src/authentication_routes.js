module.exports.setupRoutes = function(app) {
	var userController = require('./user_controller.js');

    // The route for registering.
	app.route('/auth/register')
		.post(userController.register);

    // The route for signing in.
	app.route('/auth/signin') 
		.post(userController.signIn);

	// The route for logging out.
	app.route('/auth/logout') 
		.post(userController.loginRequired, userController.logOut);
};