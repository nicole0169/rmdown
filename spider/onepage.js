/**
 * Created by minmiao on 15/10/11.
 */
var async = require("async");
var http = require("http");
var fs = require("fs");
var moment = require("moment");
var iconv = require("iconv-lite");
var BufferHelper = require("bufferhelper");

// var target_url = "http://t66y.com";

var page_start = process.argv[2];
var page_end = process.argv[3];
if (!page_start || !page_end || (page_end < page_start) || (page_start <= 0)) {
    console.log('You must input the start page number and end page number.');
    process.exit();
}

var chunks = [];
var target_data = "";
var target_result = "";
var themereg = /Mywife|G-area/ig;
var target_url_prefix = "/thread0806.php?fid=15&search=&page=";
var grapurllist = [];
for (var i=page_start; i <= page_end; i++) {
    grapurllist.push(target_url_prefix + i);
}

var options = {
    host: "t66y.com",
    path: "/thread0806.php?fid=15&search=&page=1",
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

async.each(grapurllist, function (url, callback) {

    console.log(url);
    options.path = url;

    var req = http.request(options, function (res) {
        var bufferHelper = new BufferHelper();
        // 设置显示编码
        // res.setEncoding("utf8");
        res.on("data", function (chunk) {
            bufferHelper.concat(chunk);
            // chunks.push(chunk);
        });
        res.on("end", function () {
            // 正式开始处理数据
            //console.log(target_data);
            target_data = iconv.decode(bufferHelper.toBuffer(), "gb2312");
            target_result += array2str(matchUrl(target_data));

            callback();
        });
    });

    req.end();

}, function (err) {
    // console.log("Result:" + target_result);
    if (target_result.length > 0) {
        saveUrl(target_result);
    }
});

function matchUrl(html) {
    var reg = /<h3><a href="(.*?)" target="_blank" id="">\[(.*?)<\/a><\/h3>/g;
    var regRes = [];
    while (match = reg.exec(target_data)) {
        var themetitle = match[2];
        if (themereg.test(themetitle)) {
            // console.log("Match2:" + match[2]);
            regRes.push({
                "url": match[1],
                "title": "[" + match[2]
            });
        }
    }
    return regRes;
}

function getNow() {
    return moment().format('YYYYMMDDHHmmss');
}

function saveUrl(str) {
    fs.writeFile(getNow() + '.txt', str, function (err) {
        if (err) throw err;
    });
}

function array2str(data) {
    var str = "";
    for (var i = 0, len = data.length; i < len; i++) {
        str += "<" + data[i].title + ">(" + data[i].url + ")" + "\n\n";
    }
    return str;
}