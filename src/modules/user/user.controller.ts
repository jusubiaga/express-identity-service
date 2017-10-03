import * as express from 'express';
import * as Jwt from 'jsonwebtoken';
import { config } from '../../config/config';
import { User, IUserModel }  from './user.model';

export class UserController {

    constructor(){
        // TBD
    }

    getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.json({ message: 'List all users!' });
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
                        token: Jwt.sign(tokenData, config.secret)
                    };
                    return res.json({ message: 'User matched!', tokenData: result});
                } else {
                    return res.json({ message: 'User does not match!'});
                }
            })
            .catch((err: any) => {
                return res.json({ message: 'User does not match' });
            })
            
        })
        .catch(err => {
            return res.json({ message: err });
        })
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
            })
         })
         .catch(err => {
             return next(err);
         })        
    }

    profile(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.json({ message: 'User Profile API!' });
    }

    authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {

        const tokenData = {
            username: 'jusubiaga',
            scope: ['admin'],
            id: 1234
        };
        var result = {
            username: tokenData.username,
            scope: tokenData.scope,
            token: Jwt.sign(tokenData, config.secret)
        };

	    return res.json(result);
    }
}