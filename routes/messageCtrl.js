//Imports

const models = require('../models');
const asynLib = require('async');

const jwtUtils = require('../utils/jwt.utils');

//Constants

const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 4;

//Create Messages Routes

module.exports = {
    createMessage: (req, res) => {
        //Gettin header auth
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        // Gettin messages params
        let title = req.body.title;
        let content = req.body.content;

        if (title == null || content == null) {
            return res.status(400).json({ 'error': 'message not found' });
        }
        if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
            return res.status(400).json({ "error": "invalid parameters" })
        }
        asynLib.waterfall([
            (done) => {
                models.User.findOne({
                    where: { id: userId }
                }).then((userFound) => {
                    done(null, userFound);
                })
                    .catch((err) => {
                        res.status(500).json({ 'error': 'unable to verify user' } + err)
                    });
            },
            (userFound, done) => {
                if (userFound) {
                    models.Message.create({
                        title: title,
                        content: content,
                        attachment: '',
                        likes: 0,
                        UserId: userFound.id
                    }).then(function (newMessage) {
                        done(newMessage);
                    });

                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function (newMessage) {
            if (newMessage) {
                return res.status(201).json(newMessage);

            } else {
                return res.json(500).json({ 'error': 'cannot post  message' });
            }

        });

    },
    listMessages: (req, res) => {
        //Params
        const fields = req.body.fields;
        const limit = parseInt(req.body.limit);
        const offset = parseInt(req.body.offset);
        const order = req.body.order;

        models.Message.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: models.User,
                attributes: ['username']
            }]
        }).then((messages) => {
            if (messages) {
                return res.status(200).json(messages);
            } else {
                return res.status(400).json({ 'err': 'no messages  found !' })
            }

        }).catch((err) => {
            res.status(500).json({ 'err': 'invalid fields' })
        })
    }
}
