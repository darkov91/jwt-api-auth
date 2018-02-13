/**
 * Gets the JWT token from the request header.
 * Returns undefined if no token is present.
 */
module.exports.getJwtTokenFromRequestHeader = function(req) {
    if (!req.headers || !req.headers.authorization)
        return undefined; // No authorization data in the header.

    var authSplit = req.headers.authorization.split(' ');
    if (authSplit[0] !== 'JWT')
        return undefined; // No JWT token sent.
    
    return authSplit[1];
}