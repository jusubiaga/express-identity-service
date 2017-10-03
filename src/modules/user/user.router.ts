import * as express from 'express';

// API
import { UserController } from './user.controller';
import { RouterBase } from '../../routes/router-base';

export class UserRouter extends RouterBase {

    constructor() {
        super();
    }

    protected routes() {

        // Adding router for different version

        let userController= new UserController();
        this.routers[RouterBase.VERSION.V1] = express.Router();

        this.routers[RouterBase.VERSION.V1].get('/', userController.getAll.bind(userController.getAll));
        this.routers[RouterBase.VERSION.V1].post('/login', userController.login.bind(userController.login));
        this.routers[RouterBase.VERSION.V1].post('/signup', userController.signUp.bind(userController.signUp));
        this.routers[RouterBase.VERSION.V1].get('/profile', userController.profile.bind(userController.profile));

        this.routers[RouterBase.VERSION.V1].get('/auth', userController.authenticate.bind(userController.authenticate));

    }

    public getRouter(version: string) {
        return this.routers[version];
    }
}