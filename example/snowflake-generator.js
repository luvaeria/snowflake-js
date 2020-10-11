'use strict';

const Generator = require('../lib/Generator');

const Snowflake = new Generator({
    epoch: 1577836800000,
    workerId: 0,
    datacenterId: 0,
    workerIdBits: 5,
    datacenterIdBits: 5,
    sequence: 0,
    sequenceBits: 12,
});

for (let i = 0; i < 50; i++) {
    console.log(Snowflake.getId().toString());
}
