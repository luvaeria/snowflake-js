'use strict';

const http = require('http');
const url = require('url');

const Generator = require('../lib/Generator');

/**
 * @class
 * @classdesc Snowflake Server
 */
class SnowflakeServer {
    /**
     * @function constructor
     * @param {Object} setup
     * @param {Number} [setup.serverPort]
     * @param {String} [setup.serverHostname]
     * @param {Boolean} [setup.listen]
     * @param {Object} [setup.snowflakeOptions]
     */
    constructor(setup) {
        this.config = Object.assign(
            {
                serverPort: 8080,
                serverHostname: 'localhost',
                listen: true,
                snowflakeOptions: {},
            },
            setup
        );
        this.generator = new Generator(setup.snowflakeOptions);
        this.server = http.createServer(this.requestHandler.bind(this));
        if (this.config.listen === true) {
            this.listen();
        }
    }

    nextId() {
        let id;
        try {
            id = this.generator.getId().toString();
        } catch (err) {
            console.error(err);
            id = false;
        } finally {
            return id;
        }
    }

    listen() {
        this.server.on('error', (err) => {
            console.error(err);
        });
        this.server.listen(this.config.serverPort, this.config.serverHostname, () => {
            console.info('Snowflake Server started', this.config.serverHostname + ':' + this.config.serverPort);
        });
    }

    /**
     * @function requestHandler
     * @param {http.IncomingMessage} request
     * @param {http.ServerResponse} response
     */
    requestHandler(request, response) {
        if (request.method === 'GET') {
            const parse = url.parse(request.url);
            switch (parse.pathname) {
                case '/id': {
                    response.setHeader('Content-Type', 'application/json;charset=utf-8');
                    response.end(JSON.stringify({ id: this.nextId() }));
                    break;
                }
                case '/datacenter': {
                    response.setHeader('Content-Type', 'application/json;charset=utf-8');
                    response.end(JSON.stringify({ datacenter: this.generator.datacenterId.toString() }));
                    break;
                }
                case '/worker': {
                    response.setHeader('Content-Type', 'application/json;charset=utf-8');
                    response.end(JSON.stringify({ worker: this.generator.workerId.toString() }));
                    break;
                }
                default: {
                    response.statusCode = 404;
                    response.end(JSON.stringify({ error: http.STATUS_CODES[404] }));
                }
            }
        }
    }
}

const Server = new SnowflakeServer({
    serverPort: 8080,
    serverHostname: 'localhost',
    listen: false,
    snowflakeOptions: {
        workerId: 0,
        datacenterId: 0,
        workerIdBits: 5,
        datacenterIdBits: 5,
        sequence: 0,
        sequenceBits: 12,
    },
});

Server.listen();
