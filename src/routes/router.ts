import * as express from 'express';

const API_PREFIX = 'api';
/**
 * Class represent the API Router
 * @export
 * @class ApiRouter
 */
export class ApiRouter {
    private router: express.Router = express.Router();

    public getRouter() {
        return this.router;
    }

    public addRoute(version: string, path: string, router: express.Router, defaultRoute: boolean = false) {
        this.router.use(`/${API_PREFIX}/${version}/${path}`, router);
        if (defaultRoute) {
            this.router.use(`/${API_PREFIX}/${path}`, router);
        }
    }
}