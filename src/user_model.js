var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

// The user schema.
var UserSchema = new Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
      },
      email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
      },
      hash_password: {
        type: String
      },
      created: {
        type: Date,
        default: Date.now
      }
});

/**
 * Returns whether the given password matches the hashed password for the user.
 */
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash_password);
}

var User = mongoose.model('User', UserSchema);
module.exports = User;