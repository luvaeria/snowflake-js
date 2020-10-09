'use strict';

const Generator = require('./lib/Generator');

function Snowflake(setup) {
    return new Generator(setup);
}

Snowflake.Generator = Generator;

module.exports = Snowflake;
