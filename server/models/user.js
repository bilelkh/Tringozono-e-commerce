const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// libraries to encrypt passwords
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    name: String,
    password: String,
    picture: String,
    // all users are set to not be seller
    isSeller: { type: Boolean, default: false },
    address: {
        addr1: String,
        addr2: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    created: { type: Date, default: Date.now }
});

//encrypt password
UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});

//compare passwords
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

//generate a img everytime a user signup
UserSchema.methods.gravatar = function(size) {
    if(!this.size) size = 200;
    if(!this.email) {
        return 'http://gravatar.com/avatar/?s' + size + '&d=retro';
    } else {
        let md5 = crypto.createHash('md5').update(this.email).digest('hex');

        return 'http://gravatar.com/avatar/' + md5 + '?s' + size + '&d=retro';
    }
}

module.exports = mongoose.model('User', UserSchema);
