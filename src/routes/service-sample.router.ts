import * as express from 'express';

// API
import { ServiceSampleV1 } from '../controllers/service-sample/service-sample-v1';
import { ServiceSampleV2 } from '../controllers/service-sample/service-sample-v2';
import { RouterBase } from './router-base';

export class ServiceSampleRouter extends RouterBase {

    constructor() {
        super();
    }

    protected routes() {

        // Adding router for different version

        let serviceSampleV1 = new ServiceSampleV1();
        this.routers[RouterBase.VERSION.V1] = express.Router();
        this.routers[RouterBase.VERSION.V1].get('/', serviceSampleV1.getAll.bind(serviceSampleV1.getAll));

        let serviceSampleV2 = new ServiceSampleV2();
        this.routers[RouterBase.VERSION.V2] = express.Router();
        this.routers[RouterBase.VERSION.V2].get('/', serviceSampleV2.getAll.bind(serviceSampleV2.getAll));

    }

    public getRouter(version: string) {
        return this.routers[version];
    }
}