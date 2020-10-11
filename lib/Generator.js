'use strict';

const { EventEmitter } = require('events');

/**
 * Snwoflake-JS Generator
 * @class
 * @extends EventEmitter
 * @property {Object} config
 * @property {Number} startTime
 * @property {BigInt} sequence
 * @property {BigInt} maxWorkerId
 * @property {BigInt} maxDatacenterId
 * @property {BigInt} workerIdShift
 * @property {BigInt} datacenterIdShift
 * @property {BigInt} timestampLeftShift
 * @property {BigInt} sequenceMask
 * @property {BigInt} lastTimestamp
 * @property {Number} count
 */
class Generator extends EventEmitter {
    /**
     * @function constructor
     * @param {Object} [setup]
     * @param {Number} [setup.epoch]
     * @param {Number} [setup.workerId]
     * @param {Number} [setup.datacenterId]
     * @param {Number} [setup.workerIdBits]
     * @param {Number} [setup.datacenterIdBits]
     * @param {Number} [setup.sequence]
     * @param {Number} [setup.sequenceBits]
     */
    constructor(setup = {}) {
        super();
        this.config = {
            epoch: this.hydrate(setup.epoch, 1577836800000n),
            workerId: this.hydrate(setup.workerId, 0n),
            datacenterId: this.hydrate(setup.datacenterId, 0n),
            workerIdBits: this.hydrate(setup.workerIdBits, 0n),
            datacenterIdBits: this.hydrate(setup.datacenterIdBits, 0n),
            sequence: this.hydrate(setup.sequence, 0n),
            sequenceBits: this.hydrate(setup.sequenceBits, 0n),
        };
        this.startTime = 0;
        this.count = 0;
        this.sequence = this.config.sequence;
        this.maxWorkerId = -1n ^ (-1n << this.config.workerIdBits);
        this.maxDatacenterId = -1n ^ (-1n << this.config.datacenterIdBits);
        this.workerIdShift = this.config.sequenceBits;
        this.datacenterIdShift = this.config.sequenceBits + this.config.workerIdBits;
        this.timestampLeftShift = this.config.sequenceBits + this.config.workerIdBits + this.config.datacenterIdBits;
        this.sequenceMask = -1n ^ (-1n << this.config.sequenceBits);
        this.lastTimestamp = -1n;
        this.validate();
    }

    /**
     * @function hydrate
     * @param {any} value
     * @param {bigint} defaultValue
     * @returns {bigint}
     */
    hydrate(value, defaultValue) {
        if (typeof value === 'bigint') {
            return value;
        } else {
            if (typeof value === 'number') {
                return BigInt(value);
            } else {
                console.error('setup values must be a number or a bigint');
                return defaultValue;
            }
        }
    }

    /**
     * @function validate
     */
    validate() {
        if (this.config.workerId > this.maxWorkerId || this.config.workerId < 0) {
            throw new Error("worker Id can't be greater than " + this.maxWorkerId + ' or less than 0');
        }
        if (this.config.datacenterId > this.maxDatacenterId || this.config.datacenterId < 0) {
            throw new Error("datacenter Id can't be greater than " + this.maxDatacenterId + ' or less than 0');
        }
        this.emit('ready');
        this.startTime = Date.now();
    }

    /**
     * @function getId
     * @returns {bigint}
     */
    getId() {
        let timestamp = this.timeGen();
        if (timestamp < this.lastTimestamp) {
            this.emit('error', new Error('Clock moved backwards. Refusing to generate id for ' + (this.lastTimestamp - timestamp) + ' milliseconds'));
        }
        if (this.lastTimestamp === timestamp) {
            this.sequence = (this.sequence + 1n) & this.sequenceMask;
            if (this.sequence === 0n) {
                timestamp = this.tilNextMillis(this.lastTimestamp);
            }
        } else {
            this.sequence = 0n;
        }
        this.lastTimestamp = timestamp;
        this.count++;
        return (
            ((timestamp - this.config.epoch) << this.timestampLeftShift) |
            (this.config.datacenterId << this.datacenterIdShift) |
            (this.config.workerId << this.workerIdShift) |
            this.sequence
        );
    }

    /**
     * @function tilNextMillis
     * @param {bigint} lastTimestamp
     * @returns {bigint}
     */
    tilNextMillis(lastTimestamp) {
        let timestamp = this.timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = this.timeGen();
        }
        return timestamp;
    }

    /**
     * @function timeGen
     * @returns {bigint}
     */
    timeGen() {
        return BigInt(Date.now());
    }

    /**
     * @type {bigint}
     */
    get workerId() {
        return this.config.workerId;
    }

    /**
     * @type {bigint}
     */
    get datacenterId() {
        return this.config.datacenterId;
    }

    /**
     * @type {bigint}
     */
    get timestamp() {
        return this.timeGen();
    }

    /**
     * @type {Number}
     */
    get uptime() {
        return this.startTime ? Date.now() - this.startTime : 0;
    }
}

module.exports = Generator;
