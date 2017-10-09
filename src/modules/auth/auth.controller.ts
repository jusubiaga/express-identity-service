import * as express from 'express';
import * as Jwt from 'jsonwebtoken';
import { config } from '../../config/config';
import * as passport from 'passport';
import { User, IUserModel }  from '../user/user.model';


export class AuthController {

    constructor() {
        // TBD
    }

    login(req: express.Request, res: express.Response, next: express.NextFunction) {
        let userPassword: string = req.body.password;
        User.findOne({ email: req.body.email })
        .then((user: IUserModel) => {
            user.comparePassword(userPassword)
            .then((isMatch: Boolean) => {
                if (isMatch) {
                    const tokenData = {
                        username: user.email,
                        scope: ['admin'],
                    };
                    const result = {
                        username: tokenData.username,
                        scope: tokenData.scope,
                        token: Jwt.sign(tokenData, config.secret, { expiresIn: '1h' })
                    };
                    return res.json({ message: 'User matched!', tokenData: result});
                } else {
                    return res.json({ message: 'User does not match!'});
                }
            })
            .catch((err: any) => {
                return res.json({ message: 'User does not match' });
            });

        })
        .catch(err => {
            console.log('Error getting user');
            return res.json({ message: err });
        });
    }

    signUp(req: express.Request, res: express.Response, next: express.NextFunction) {

         User.findOne({ email: req.body.email })
         .then(existingUser => {
            if (existingUser) {
                res.json({ message: 'User already exists!' });
            }
            const user = new User({
                email: req.body.email,
                password: req.body.password
            });

            user.save()
            .then(user => {
                res.json({ message: 'User saved!' });
            })
            .catch(err => {
                res.json({ message: 'Unable to save user!' });
            });
         })
         .catch(err => {
             return next(err);
         });
    }

    authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {

        const tokenData = {
            username: 'jusubiaga',
            scope: ['admin'],
            id: 1234
        };
        let result = {
            username: tokenData.username,
            scope: tokenData.scope,
            token: Jwt.sign(tokenData, config.secret)
        };

        return res.json(result);
    }

    authenticateFacebook(req: express.Request, res: express.Response, next: express.NextFunction) {
        console.log('FACEBOOK');
        return passport.authenticate('facebooks', { scope: ['email', 'public_profile'] });
    }

    authenticateFacebookCallback(req: express.Request, res: express.Response, next: express.NextFunction) {
        return passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: true });
    }
}