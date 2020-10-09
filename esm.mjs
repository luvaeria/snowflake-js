import Snowflake from './index.js';

export default function (setup) {
    return new Snowflake.Generator(setup);
}

export const { Generator } = Snowflake;
