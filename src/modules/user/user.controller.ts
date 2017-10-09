import * as express from 'express';

export class UserController {

    constructor() {
        // TBD
    }

    getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.json({ message: 'List all users!' });
    }

    profile(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.json({ message: 'User Profile API!' });
    }
}