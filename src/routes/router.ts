import * as express from 'express';
import { config } from '../config/config';
import * as Jwt from 'jsonwebtoken';

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

    public addSecureRoute(path: string, router: express.Router, version: string = '') {
        let routePath = this.getRoutePath(path, version);
        this.router.use(routePath, this.isAuthenticated, router);
    }

    public addRoute(path: string, router: express.Router, version: string = '') {
        let routePath = this.getRoutePath(path, version);
        this.router.use(routePath, router);
    }

    private getRoutePath(path: string, version: string = '') {
        let routePath;

        // Use versioning
        if (version) {
            routePath = `/${API_PREFIX}/${version}/${path}`;
        } else {
            routePath = `/${path}`;
        }

        return routePath;
    }

    private isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
        // check header or url parameters or post parameters for token
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            Jwt.verify(token, config.secret, {maxAge: '2 days'}, function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    }
}