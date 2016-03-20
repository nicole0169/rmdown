/**
 * Created by minmiao on 15/10/25.
 *
 * 这个模块的作用是从REDIS判断链接地址是否已经存在
 * 如果不存在则添加
 * 如果存在则不用再做处理
 */
var async = require("async");
var redis = require("redis");
var md5 = require("md5");
var client = redis.createClient("6379", "127.0.0.1");

var rhash = "mywife";
//var rkey = process.argv[2];
//var rval = process.argv[3];

/*if (!rkey || !rval) {
 console.log('You must input the title and url.');
 process.exit();
 }*/

//var md5rkey = md5(rkey);

// Start redis client
client.on("connect", function () {
    console.log("Redis client connected.");
});

function redisIsExists(tl, cb) {
    var newJobArr = [];
    async.each(tl, function (item, callback) {
        var tmp_rkey = item['title'];
        var tmp_rval = item['link'];
        var tmp_md5rkey = md5(tmp_rkey);

        client.hexists(rhash, tmp_md5rkey, function (err, reply) {
            console.log("Is key " + tmp_md5rkey + " exists in Redis? " + reply);
            if (!reply) {
                var newKv = {};
                newKv[tmp_md5rkey] = tmp_rval;
                client.hmset(rhash, newKv, function (err, reply) {
                    if (!err) {
                        newJobArr.push(item);
                        client.end();
                        callback();
                    } else {
                        client.end();
                        callback();
                    }
                });
            } else {
                client.end();
                callback();
            }
        });

    }, function (err) {
        cb(newJobArr);
    });
}

exports.redisIsExists = redisIsExists;