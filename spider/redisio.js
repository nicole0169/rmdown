/**
 * Created by minmiao on 15/10/25.
 */
var redis = require("redis");
var md5 = require("md5");
var client = redis.createClient("6379", "127.0.0.1");

var rhash = "mywife";
var rkey = process.argv[2];
var rval = process.argv[3];

if (!rkey || !rval) {
    console.log('You must input the title and url.');
    process.exit();
}
var md5rkey = md5(rkey);

// Start redis client
client.on("connect", function () {
    console.log("Redis client connected.");
});

client.hexists(rhash, md5rkey, function (err, reply) {
    console.log("Is key " + md5rkey + " exists in Redis? " + reply);
    if (!reply) {
        var newKv = {};
        newKv[md5rkey] = rval;
        client.hmset(rhash, newKv, function (err, reply) {
            if (!err) {
                client.hgetall(rhash, function (err, reply) {
                    if (!err) {
                        console.dir(reply);
                        client.end();
                    } else {
                        client.end();
                    }
                });
            } else {
                client.end();
            }
        });
    } else {
        client.end();
    }
});