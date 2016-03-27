/**
 * Created by minmiao on 16/3/20.
 *
 * 测试使用fs.stat来判断目录是否存在
 */

var fs = require('fs');
var mkdirp = require('mkdirp');

// var dir_name = process.argv[2];
// var dc_options = '0777';

var dc = function (path, options, cb) {
    fs.stat(path, function (err, stats) {
        if (!stats) {
            mkdirp(path, options, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.info('Directory ' + path + ' create completed!');
                    cb(path);
                }
            });
        }else{
            cb(path);
        }
    });
};

exports.dc = dc;