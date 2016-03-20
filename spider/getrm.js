/**
 * Created by minmiao on 15/10/27.
 * 扒取t66y.com的详情页内rmdown.com的下载地址
 */

var http = require("http");
var bufferhelper = require("bufferhelper");
var iconv = require("iconv-lite");
var async = require("async");

// var threadurl = process.argv[2];
/*if (!threadurl) {
    console.log("Please input the thread url.");
    process.exit();
}*/

/*var target_data = "";
var target_result = "";*/

function getRMurlFromTarget(newtl,cb){
    var rmDownArr = [];
    async.each(newtl, function (item, callback) {
        var tmp_rkey = item['title'];
        var tmp_rval = item['link'];

        var options = {
            host: "t66y.com",
            path: '/' + tmp_rval,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "text/plain,text/html",
                "Accept-Language": "zh-cn",
                "Cache-Control": "no-cache",
                "Connection": "Keep-Alive",
                "Host": "t66y.com",
                "Referer": "http://t66y.com/index.php",
                "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)",
                "X-Requested-With": "XMLHttpRequest"
            }
        };

        var req = http.request(options, function (res) {
            var resbuff = new bufferhelper();

            res.on("data", function (chunk) {
                resbuff.concat(chunk);
            });

            res.on("end", function () {
                var target_data = iconv.decode(resbuff.toBuffer(), "gb2312");
                var target_result = matchUrl(target_data);
                //console.log(target_result);
                rmDownArr.push({
                    'title':tmp_rkey,
                    'down':target_result
                });
                callback();
            });
        });

        req.end();

    }, function (err) {
        cb(rmDownArr);
    });
}

function matchUrl(htmldata) {
    var reg = /http:\/\/www\.rmdown\.com\/link\.php\?hash\=(.*?)<\/a><\/div>/g;
    var regRes = "";
    while (match = reg.exec(htmldata)) {
        regRes = "http://www.rmdown.com/link.php?hash=" + match[1];
    }
    return regRes;
}

exports.getRMurlFromTarget = getRMurlFromTarget;