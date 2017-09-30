import * as express from 'express';

import { ServiceApiBase } from './service-sample-base';

export class ServiceSampleV2 extends ServiceApiBase {

    constructor() {
        super();
    }

    public getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send('ServiceSampleV2');
    }
}

