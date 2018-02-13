/**
 * A simple jwt token blacklist that's kept in-memory. It includes the mechanism for
 * cleaning the blacklist every 5 minutes.
 * NOTE: For apps that need to scale better a more sophisticated approach should
 * be used, like storing the tokens in a database.
 */

function TokenBlacklist() {
    this.tokenBlacklist = {};
}

/**
 * Adds a token to the token blacklist. 
 * @param {The token to be invalidated.} token 
 */
TokenBlacklist.prototype.invalidateToken = function(token) {
    this.tokenBlacklist[token] = true;
};

/**
 * Returns whether the token is currently valid.
 * @param {The token to check.} token 
 */
TokenBlacklist.prototype.isTokenValid = function(token) {
    return !this.tokenBlacklist[token];
};

/**
 * Cleans the token blacklist.
 */
TokenBlacklist.prototype.clean = async function() {
    this.tokenBlacklist = {};
    return Promise.resolve(true);
};

/**
 * Schedules a periodic cleanup of the token blacklist.
 * @param {The time period on which to clean the blacklist expressed in minutes.} cleanupPeriodMinutes 
 */
TokenBlacklist.prototype.scheduleCleanup = function(cleanupPeriodMinutes) {
    var self = this;

    // Clean the token blacklist every 5 minutes.
    setInterval(function() {
        self.clean().then(console.log('Cleaned the token blacklist'))
    }, cleanupPeriodMinutes * 60 * 1000);
};

module.exports.TokenBlacklist = TokenBlacklist;