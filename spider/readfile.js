/**
 * Created by minmiao on 15/10/27.
 *
 * 这个模块的作用是将收集文件中的信息再次解析并保存到一个数据结构中
 */

var fs = require("fs");
//构造一个数据结构
/**
 *
 * @type {Array}
 *
 * [1] => {[title] => abcdefg,
 *         [link] => /html/xxxxxx
 *        };
 */
var tl = [];
var filename = "20160312135556.txt";

function readTargetFile(filename,cb){
    fs.readFile(filename, function (err, data) {
        if (err) throw err;
        var lines = data.toString().split(/\r?\n/);
        var reg = /<(.*?)>\((.*?)\)/g;
        for (i in lines) {
            while(matches = reg.exec(lines[i])) {
                tl.push({
                    'title': matches[1],
                    'link': matches[2]
                });
            }
        }
        cb(tl);
        //console.dir(tl);
    });
}

exports.readTargetFile = readTargetFile;
