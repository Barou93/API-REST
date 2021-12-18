//Imports
const express = require('express');
const userCtrl = require('./routes/userCtrl');
const messageCtrl = require('./routes/messageCtrl');
const likesCtrl = require('./routes/likesCtrl');

//Router
exports.router = (() => {
    const apiRouter = express.Router();

    //UserRoutes
    apiRouter.route('/users/register/').post(userCtrl.register);
    apiRouter.route('/users/login/').post(userCtrl.login);
    apiRouter.route('/users/me/').get(userCtrl.getUserProfile);
    apiRouter.route('/users/me/').put(userCtrl.updateUserProfile);

    //MessagesRoutes
    apiRouter.route('/messages/new/').post(messageCtrl.createMessage);
    apiRouter.route('/messages/').get(messageCtrl.listMessages);

    //LikesRoutes
    apiRouter.route('/messages/:messageId/vote/like').post(likesCtrl.likePost);
    apiRouter.route('/messages/:messageId/vote/dislike').post(likesCtrl.dislikePost);
    return apiRouter;
})();

