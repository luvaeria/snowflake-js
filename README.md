# Snowflake-JS

[Twitter's Snowflake](https://github.com/twitter-archive/snowflake/tree/snowflake-2010) implementation for NodeJS.

> Snowflake is a network service for generating unique ID numbers at high scale with some simple guarantees.

> As we at Twitter move away from Mysql towards Cassandra, we've needed a new way to generate id numbers. There is no sequential id generation facility in Cassandra, nor should there be.

## Installing

You will need NodeJS 10.4+. Refer to [BigInt Compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) for more details.

```
npm install snowflake-js
```

## Snowflake Generator Example

```js
const Snowflake = require('snowflake-js');

const options = {
    epoch: 1577833200000,
    workerId: 0,
    datacenterId: 0,
    workerIdBits: 5,
    datacenterIdBits: 5,
    sequence: 0,
    sequenceBits: 12,
};

const Generator = new Snowflake(options); // new Snowflake.Generator(options);

console.log(Generator.getId());
```

## Snowflake Server example

Refer to [example/snowflake-server.js](example/snowflake-server.js)

## Snowflake Generator Options

| Property         | Description                                                                                                                   | Optional? | Default Value |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------- | ------------- |
| epoch            | Custom epoch for timestamp generation. By default, the number of milliseconds since the first second of 2020                  | Yes       | 1577833200000 |
| workerId         | Worker ID for this generator                                                                                                  | Yes       | 0             |
| workerIdBits     | Number of usable bits for Worker Id. 5 by default, allows up to 31 Workers                                                    | Yes       | 5             | Worker ID for this generator |
| datacenterId     | Datacenter ID for this generator                                                                                              | Yes       | 0             |
| datacenterIdBits | Number of usable bits for Datacenter Id. 5 by default, allows up to 31 Datacenters                                            | Yes       | 5             |
| sequence         | For every ID that is generated on that process, this number is incremented                                                    | Yes       | 0             |
| sequenceBits     | Number of usable bits for Sequence Id. 12 by default, allows up to 4095 generations per millisecond per Worker per Datacenter | Yes       | 12            |

## Useful Links

-   [The original Twitter's Snowflake repository](https://github.com/twitter-archive/snowflake/tree/snowflake-2010)
-   [Announcing Snowflake](https://blog.twitter.com/engineering/en_us/a/2010/announcing-snowflake.html)
-   [Twitter Ids](https://developer.twitter.com/en/docs/twitter-ids)
-   [The GitHub repo](https://github.com/luvaeria/snowflake-js)
-   [The NPM package](https://npmjs.com/package/snowflake-js)

## License

Refer to the [LICENSE](LICENSE) file.
