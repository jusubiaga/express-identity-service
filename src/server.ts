import * as express from 'express';
import * as winston from 'winston';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as logger from 'morgan';
import {Express, Request, Response} from 'express';

// Routers
import { ApiRouter } from './routes/router';
import { RouterBase } from './routes/router-base';
import { ServiceSampleRouter } from './routes/service-sample.router';

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
    }

    private routes(): void {
        const serviceSampleRouter = new ServiceSampleRouter();

        let apiRouter: ApiRouter = new ApiRouter();

        // Sample
        apiRouter.addRoute('v1', 'sample', serviceSampleRouter.getRouter(RouterBase.VERSION.V1), true);
        apiRouter.addRoute('v2', 'sample', serviceSampleRouter.getRouter(RouterBase.VERSION.V2));

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