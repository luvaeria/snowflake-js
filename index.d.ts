import Snowflake from './lib/Generator';

import { EventEmitter } from 'events';

declare function Snowflake(setup: Snowflake.Setup): Snowflake.Generator;

declare namespace Snowflake {
    interface Setup {
        epoch?: bigint;
        workerId?: bigint;
        datacenterId?: bigint;
        workerIdBits?: bigint;
        datacenterIdBits?: bigint;
        sequence?: bigint;
        sequenceBits?: bigint;
    }

    export class Generator extends EventEmitter {
        constructor(setup: Snowflake.Setup);
        hydrate(setup: Snowflake.Setup): Snowflake.Setup;
        validate(): void;
        getId(): bigint;
        tilNextMillis(): bigint;
        timeGen(): bigint;
        workerId(): bigint;
        datacenterId(): bigint;
        timestamp(): bigint;
        config: Snowflake.Setup;
        sequence: bigint;
        maxWorkerId: bigint;
        workerIdShift: bigint;
        maxDatacenterId: bigint;
        datacenterIdShift: bigint;
        timestampLeftShift: bigint;
        sequenceMask: bigint;
        lastTimestamp: bigint;
        uptime: number;
        count:number;
    }
}

export = Snowflake;
