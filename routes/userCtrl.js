//Imports
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');
const asynLib = require('async');

//Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
//Routes

module.exports = {
    register: (req, res, next) => {
        //TODO to implements

        //Params
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const bio = req.body.bio;
        if (email == null || username == null || password == null) {
            return res.status(400).json({ 'error': 'Missing parameters !' })
        }

        //TODO verify pseudo length , email,  regex password etc

        if (username.length <= 4 || username.length >= 13) {
            return res.status(400).json({ 'error': 'wrong username (must be length 5-12)' });
        }

        //Regex
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'email is not valid' });
        }
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'password invalid (must be length 4-8 and include 1 number 1 special charactere)' });
        }
        asynLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: email },
                })
                    .then((userFound) => {
                        done(null, userFound);
                    })
                    .catch((error) => {
                        return res.status(500).json({ 'error': 'unable to verify user !' })
                    });
            },
            function (userFound, done) {
                if (!userFound) {
                    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                        done(null, userFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'user already exist' });
                }
            },
            function (userFound, bcryptedPassword, done) {
                const newUser = models.User.create({
                    email: email,
                    username: username,
                    password: bcryptedPassword,
                    bio: bio,
                    isAdmin: 0
                })
                    .then((newUser) => {
                        done(newUser)

                    })
                    .catch(error => {
                        return res.status(500).json({ 'error': 'cannot add user' });
                    })
            }
        ], function (newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({ 'error': 'cannot add user' });
            }
        });
    },
    login: (req, res, next) => {
        //TODO to implements
        //Params
        const email = req.body.email;
        const password = req.body.password;
        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters !' });
        }
        asynLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: { email: email }
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                        done(null, userFound, resBycrypt);
                    });
                } else {
                    return res.status(404).json({ 'error': 'user not exist in DB' });
                }
            },
            function (userFound, resBycrypt, done) {
                if (resBycrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({ 'error': 'invalid password' });
                }
            }
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json({
                    'userId': userFound.id,
                    'token': jwtUtils.generateTokenForUser(userFound)
                });
            } else {
                return res.status(500).json({ 'error': 'cannot log on user' });
            }
        });
    },
    getUserProfile: function (req, res) {
        //Gettin Auth  header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        //Todo to get user profile
        if (userId < 0) {
            return res.status(400).json({ 'error': 'wrong token' });

        }
        models.User.findOne({
            attributes: ['id', 'email', 'username', 'bio'],
            where: { id: userId }
        }).then(function (user) {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        }).catch((err) => {
            res.status(500).json({ 'error': 'cannot fetch user' + err });
        });
    },
    updateUserProfile: function (req, res) {
        //Gettin Auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        //Todo to update user profil
        const bio = req.body.bio;
        asynLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['id', 'bio'],
                    where: { id: userId }
                }).then((userFound) => {
                    done(null, userFound)
                })
                    .catch((err) => {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    userFound.update({
                        bio: (bio ? bio : userFound.bio)
                    }).then(() => {
                        done(userFound);
                    }).catch((err) => {
                        res.status(500).json({ 'error': 'cannot update user' });
                    });
                } else {
                    return res.status(400).json({ 'error': 'user not found' });
                }
            },
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'cannot update user' });
            }
        });


    }
}
