'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
    },
    username: {
        type: String,
        unique: true,
        required: 'Enter your username.'
    },
    password: {
        type: String,
        required: true
    },
    full_name: {
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', function (next) {
    let user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

autoIncrement.initialize(mongoose);
UserSchema.plugin(autoIncrement.plugin, 'Users');
module.exports = mongoose.model('Users', UserSchema);