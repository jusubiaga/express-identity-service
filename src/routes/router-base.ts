import * as express from 'express';

export abstract class RouterBase {

    static readonly VERSION = {
        'NONE': '',
        'V1': 'v1',
        'V2': 'v2',
        'V3': 'v3',
        'V4': 'v4',
        'V5': 'v5',
    };

    protected routers: { [key: string]: express.Router } = {};
    protected abstract routes(): void;

    constructor () {
        this.routers[RouterBase.VERSION.NONE] = express.Router();
        this.routes();
    }

    // public create(version: string = '') {
    //     if (version) {
    //         this.routers[version] = express.Router();
    //     } else {
    //         if (!this.routers[RouterBase.VERSION.NONE]) {
    //             this.routers[RouterBase.VERSION.NONE] = express.Router();
    //         }
    //     }
    // }

    public getRouter(version: string = '') {
        return version ? this.routers[version] : this.routers[RouterBase.VERSION.NONE];
    }
}