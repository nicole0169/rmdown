/**
 * 重置REDIS HASH
 *
 * @type {*}
 */
var redis = require("redis");
var md5 = require("md5");
var client = redis.createClient("6379", "127.0.0.1");

var rhash = "mywife";

// Start redis client
client.on("connect", function () {
    console.log("Redis client connected.");

    redisreset(rhash, function () {
        client.end();
    });
});

var redisreset = function (rhash, cb) {
    client.hgetall(rhash, function (err, reply) {
        if (!err) {
            console.info('Reset before: ');
            console.dir(reply);

            client.del(rhash,function (err, reply) {
                if (!err) {
                    client.hgetall(rhash, function (err, reply) {
                        if (!err) {
                            console.info('Reset after: ');
                            console.dir(reply);
                            cb();
                        } else {
                            console.info(err);
                            cb();
                        }
                    });
                } else {
                    console.info(err);
                    cb();
                }
            });
        } else {
            cb();
        }
    });
};