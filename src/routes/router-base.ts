import * as express from 'express';

export abstract class RouterBase {

    static readonly VERSION = {
        'V1': 'v1',
        'V2': 'v2',
        'V3': 'v3',
        'V4': 'v4',
        'V5': 'v5',
    };

    constructor () {
        this.routes();
    }

    protected routers: { [key: string]: express.Router } = {};

    protected abstract routes(): void;

    public getRouter(version: string) {
        return this.routers[version];
    }

}