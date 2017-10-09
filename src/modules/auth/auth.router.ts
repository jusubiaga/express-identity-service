import * as express from 'express';
import * as passport from 'passport';

// API
import { AuthController } from './auth.controller';
import { RouterBase } from '../../routes/router-base';

export class AuthRouter extends RouterBase {

    constructor() {
        super();
    }

    protected routes() {

        let authController = new AuthController();
        this.routers[RouterBase.VERSION.NONE] = express.Router();

        this.routers[RouterBase.VERSION.NONE].post('/login', authController.login.bind(authController.login));
        this.routers[RouterBase.VERSION.NONE].post('/signup', authController.signUp.bind(authController.signUp));

        this.routers[RouterBase.VERSION.NONE].get('/auth', authController.authenticate.bind(authController.authenticate));
        this.routers[RouterBase.VERSION.NONE].get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
        this.routers[RouterBase.VERSION.NONE].get('/auth/facebook/callback',  passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
            console.log('FACEBOOK CALLBACK');
            res.redirect('/redirect');
        });
    }
}