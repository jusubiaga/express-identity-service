import * as express from 'express';
import * as winston from 'winston';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as logger from 'morgan';
import {Express, Request, Response} from 'express';
import { config } from './config/config';
import * as mongoose from 'mongoose';
import * as Jwt from 'jsonwebtoken';
import * as passport from 'passport';
// import * as passportFacebook from "passport-facebook";

// import { User } from "./modules/user/user.model";

// const FacebookStrategy = passportFacebook.Strategy;

import * as passportConfig from './config/passport';

// Routers
import { ApiRouter } from './routes/router';
import { RouterBase } from './routes/router-base';
import { ServiceSampleRouter } from './routes/service-sample.router';
import { UserRouter } from './modules/user/user.router';
import { AuthRouter } from './modules/auth/auth.router';

export class Server {

    private app: Express;

    constructor(port: number) {
        // Create express application
        this.app = express();

        // configure server
        this.config();

        // configure routes
        this.routes();

        // Start server
        this.start(port);
    }

    public static bootstrap(port: number ): Server {
        return new Server(port);
    }

    private config() {
        this.app.use(logger('combined'));

        this.app.use(bodyParser.json());

        // mount query string parser
        this.app.use(bodyParser.urlencoded({ extended: true }));

        // add static paths
        this.app.use(express.static(__dirname + '/public', {index: 'index.html'}));

        // Enable CORS
        // WARNING THIS IS NOT PRODUCTION READY
        this.app.use(function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Transaction-Id, Accept-Language, X-Requested-With, Content-Type, Accept');
            next();
        });

        // catch 404 and forward to error handler
        this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            let error = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        /**
         * Connect to MongoDB.
         */
        //mongoose.Promise = global.Promise;
        mongoose.connect(config.mongodb);

        mongoose.connection.on('error', () => {
            console.log('MongoDB connection error. Please make sure MongoDB is running.');
            process.exit();
        });



// /**
//  * Sign in with Facebook.
//  */
// passport.use(new FacebookStrategy({
//   clientID: '123',
//   clientSecret: '123',
//   callbackURL: "/auth/facebook/callback",
//   profileFields: ["name", "email", "link", "locale", "timezone"],
//   passReqToCallback: true
// }, (req: any, accessToken, refreshToken, profile, done) => {
//   if (req.user) {
//     User.findOne({ facebook: profile.id }, (err, existingUser) => {
//       if (err) { return done(err); }
//       if (existingUser) {
//         req.flash("errors", { msg: "There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account." });
//         done(err);
//       } else {
//         User.findById(req.user.id, (err, user: any) => {
//           if (err) { return done(err); }
//           user.facebook = profile.id;
//           user.tokens.push({ kind: "facebook", accessToken });
//           user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
//           user.profile.gender = user.profile.gender || profile._json.gender;
//           user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
//           user.save((err: Error) => {
//             req.flash("info", { msg: "Facebook account has been linked." });
//             done(err, user);
//           });
//         });
//       }
//     });
//   } else {
//     User.findOne({ facebook: profile.id }, (err, existingUser) => {
//       if (err) { return done(err); }
//       if (existingUser) {
//         return done(undefined, existingUser);
//       }
//       User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
//         if (err) { return done(err); }
//         if (existingEmailUser) {
//           req.flash("errors", { msg: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings." });
//           done(err);
//         } else {
//           const user: any = new User();
//           user.email = profile._json.email;
//           user.facebook = profile.id;
//           user.tokens.push({ kind: "facebook", accessToken });
//           user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
//           user.profile.gender = profile._json.gender;
//           user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
//           user.profile.location = (profile._json.location) ? profile._json.location.name : "";
//           user.save((err: Error) => {
//             done(err, user);
//           });
//         }
//       });
//     });
//   }
// }));


        this.app.use(passport.initialize());
        console.log(passportConfig.test);

        /**
         * OAuth authentication routes. (Sign in)
         */
        // this.app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
        // this.app.get('/auth/oauth', passport.authenticate('oauth2'));
        // this.app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
        //     res.redirect('/redirect');
        // });
    }

    private routes(): void {
        const serviceSampleRouter = new ServiceSampleRouter();
        const userRouter = new UserRouter();
        const authRouter = new AuthRouter();

        let apiRouter: ApiRouter = new ApiRouter();

        // Sample
        apiRouter.addSecureRoute('sample', serviceSampleRouter.getRouter(RouterBase.VERSION.V1), 'v1');
        apiRouter.addSecureRoute('sample', serviceSampleRouter.getRouter(RouterBase.VERSION.V2), 'v2');

        // Auth
        apiRouter.addRoute('', authRouter.getRouter());

        // Users
        apiRouter.addRoute('users', userRouter.getRouter(RouterBase.VERSION.V1), 'v1');

        // Adding middleware routers
        this.app.use(apiRouter.getRouter());
    }

    private start(port: number) {
        this.app.listen(port, () => {
            winston.log('info', '--> Server successfully started at port %d', port);
        });
    }
 
}

Server.bootstrap(3000);