import express, { Response } from 'express'
import passport from 'passport'
import { StreamService } from '../Services/StreamService';

const TwitchRouter = express.Router()
const streamService = new StreamService()

// automatically asks you to log in, and if logged in, will connect to twitch chat
TwitchRouter.get('/twitch', function (req: any, res: Response) {
    if (req.session && req.session.passport && req.session.passport.user) {

        streamService.StartChatBots()

        res.render('twitch')
    } else {
        res.redirect('/auth/twitch');
    }
});

// user scopes necessary for reading and writing chat messages and getting followers
TwitchRouter.get('/auth/twitch', passport.authenticate('twitch', { scope: ['user_read', 'user:bot', 'user:read:chat', "user:write:chat", "moderator:read:followers"] }));

TwitchRouter.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/twitch', failureRedirect: '/twitch-fail' }));

export { TwitchRouter }