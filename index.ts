import express, { Request, Response } from 'express'
import session from 'express-session'
import { engine } from 'express-handlebars'
import passport from 'passport'
import request from 'request'
import mongoose from 'mongoose'
import { OverlayInfoRouter } from './routes/overlayInfoRoutes'
import { TwitchRouter } from './routes/twitchRoutes'
import OAuth2Strategy from 'passport-oauth2'
import * as Settings from './settings.json'
import { TokenService } from './Services/TokenService'
import { Tokens } from './models/Tokens'
import { ChatterRouter } from './routes/chatterRoutes'

const tokenService = new TokenService();

var app = express()

app.set('view engine', 'hbs')

app.engine('hbs', engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'default',
    partialsDir: __dirname + '/views/partials'
}))

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: Settings.sessionSecret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

OAuth2Strategy.prototype.userProfile = function (accessToken, done) {
    var options = {
        url: 'https://api.twitch.tv/helix/users',
        method: 'GET',
        headers: {
            'Client-ID': Settings.clientId,
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Authorization': 'Bearer ' + accessToken
        }
    };

    request(options, function (error, response, body) {
        if (response && response.statusCode == 200) {
            done(null, JSON.parse(body));
        } else {
            console.log(error)
            done(JSON.parse(body));
        }
    })
}

passport.serializeUser(function (user: any, done) {
    done(null, user);
})

passport.deserializeUser(function (user: any, done) {
    done(null, user);
})

passport.use('twitch', new OAuth2Strategy({
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    clientID: Settings.clientId,
    clientSecret: Settings.clientSecret,
    callbackURL: Settings.callbackUrl,
    state: true
},
    async function (accessToken: string, refreshToken: string, profile: any, done: any) {
        profile.accessToken = accessToken
        profile.refreshToken = refreshToken

        await tokenService.SetTokens({
            AccessToken: accessToken,
            RefreshToken: refreshToken
        } as Tokens)

        done(null, profile);
    }
));

app.use(TwitchRouter)
app.use(OverlayInfoRouter)
app.use(ChatterRouter)

app.use((req: Request, res: Response) => {
    res.status(404).render('404')
})

// connect to mongo db
mongoose.connect(Settings.dbUri)
    .then(() => app.listen(3000, () => {
        console.log('Twitch auth sample listening on http://localhost:3000!')
    }))
    .catch((err) => console.log(err)) 