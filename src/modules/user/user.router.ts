import * as express from 'express';

// API
import { UserController } from './user.controller';
import { RouterBase } from '../../routes/router-base';
import * as passport from 'passport';

export class UserRouter extends RouterBase {

    constructor() {
        super();
    }

    protected routes() {

        // Adding router for different version

        let userController = new UserController();
        this.routers[RouterBase.VERSION.V1] = express.Router();

        this.routers[RouterBase.VERSION.V1].get('/', userController.getAll.bind(userController.getAll));
        this.routers[RouterBase.VERSION.V1].get('/:id/profile', userController.profile.bind(userController.profile));
    }
}