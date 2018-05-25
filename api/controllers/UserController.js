'use strict';

const mongoose = require('mongoose');
const express = require('express');
const User = mongoose.model('Users');
const jwt = require('jwt-simple');
const passport = require('passport');
const config = require('../config/database');
let app = express();

exports.getAllUsers = function (req, res) {
    User.find({}, function (err, user) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).json(user);
        }
    })
};

exports.createNewUser = function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({
            success: false,
            message: 'Please enter username and password.'
        });
    } else {
        let newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
        // save the user
        newUser.save(function (err, user) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already exists.'
                });
            }
            res.status(201).json({
                success: true,
                message: 'Successfully created new user.',
                user: user
            });
        });
    }
};

exports.deleteUser = function (req, res) {
    User.remove({
        _id: req.params.userId
    }, function (err, user) {
        if (user === null || err) {
            res.status(400).send(err);
        } else {
            res.status(204).json();
        }
    });
};

exports.updateUser = function (req, res) {
    User.findOneAndUpdate({
        _id: req.params.userId
    }, req.body, {
        new: true
    }, function (err, user) {
        if (user === null || err) {
            res.status(400).send(err);
        } else {
            res.status(200).json({
                success: true,
                message: 'User successfully updated!',
                user: user
            });
        }
    });
};

exports.getUser = function (req, res) {
    User.findById(req.params.userId, function (err, user) {
        if (user === null || err) {
            res.status(404).send({
                success: false,
                message: 'User not found.'
            });
        } else {
            res.status(200).json(user);
        }
    });
};

exports.authenticate = function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) {
            res.send(err);
        }
        if (!user) {
            res.send({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    app.locals.token = token;
                    res.status(200).json({
                        success: true,
                        token: 'JWT ' + token
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                }
            });
        }
    });
};

exports.loginRequired = function (req, res, next) {
    if (req.user) {
        res.locals.user = req.user;
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user!'
        });
    };
};

/*exports.getSecretRoute = function (req, res) {
    passport.authenticate('jwt', {
        session: false
    });
    var token = null;
    // get token from header
    if (req.headers && req.headers.authorization) {
        var parted = req.headers.authorization.split(' ');
        if (parted.length === 2) {
            token = parted[1];
        } else {
            token = null;
        }
    } else {
        token = null;
    }
    if (token) {
        let decoded = {};
        try {
            decoded = jwt.decode(token, config.secret);
            User.findOne({
                username: decoded.username
            }, function (err, user) {
                if (err) {
                    res.status(404).send(err);
                }
                if (!user) {
                    return res.status(403).send({
                        success: false,
                        message: 'Authentication failed. User not found.'
                    });
                } else {
                    res.json({
                        success: true,
                        message: 'Welcome to the secret place ' + user.username + '!'
                    });
                }
            });
        } catch (err) {
            res.status(403).send({
                success: false,
                message: 'Authentication failed. Wrong token.'
            });
        }
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};*/