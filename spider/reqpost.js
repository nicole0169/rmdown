/**
 * RM Downloader
 *
 * author: mm
 * version: 1.0
 *
 */
var http = require("http");
var fs = require("fs");
var BufferHelper = require("bufferhelper");
var moment = require("moment");

// 基础变量设置
var target_data = "";
var target_url = "http://www.rmdown.com/link.php?hash=153ca0a2d55fcf7eb895277cd9878fb241ed7619fa7";
var hex = rand();
var boundaryKey = "----WebKitFormBoundary" + hex;
var payLoad = "--" + boundaryKey + "\r\n"
    + "Content-Disposition: form-data; name='ref'" + "\r\n\r\n"
    + "153ca0a2d55fcf7eb895277cd9878fb241ed7619fa7" + "\r\n"
    + "--" + boundaryKey + "\r\n"
    + "Content-Disposition: form-data; name='reff'" + "\r\n\r\n"
    + "MTQ0NTQyOTc0Mg==" + "\r\n"
    + "--" + boundaryKey + "\r\n"
    + "Content-Disposition: form-data; name='submit'" + "\r\n\r\n"
    + "download" + "\r\n"
    + "--" + boundaryKey + "--";
var options = {
    host: "www.rmdown.com",
    path: "/download.php",
    method: "post",
    headers: {
        "Content-Type": "multipart/form-data; boundary=" + boundaryKey,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        //"Accept-Encoding":"gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.8",
        "Content-Length": "385",
        "Cache-Control": "max-age=0",
        "Connection": "Keep-Alive",
        "Cookie": "__cfduid=d0167262a4ae8e0eb4f441135d9ac76401444573777",
        "Host": "www.rmdown.com",
        "Origin": "http://www.rmdown.com",
        "Referer": "http://www.rmdown.com/link.php?hash=153ca0a2d55fcf7eb895277cd9878fb241ed7619fa7",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)",
        //"X-Requested-With":"XMLHttpRequest"
        "Upgrade-Insecure-Requests": "1"
    }
};

var req2 = http.get(target_url, function (res) {

    console.log(res.headers);
    var cookiesRes = "";
    var cookies = res.headers["set-cookie"];
    cookies.forEach(function (cookie) {
        cookiesRes += cookie.replace(/path=\//g, '');
    });
    var cookieList = cookiesRes.split(";");
    //console.log(cookies);
    console.log(cookieList[0]);

    var req = http.request({
        host: "www.rmdown.com",
        path: "/download.php",
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data; boundary=" + boundaryKey,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            //"Accept-Encoding":"gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.8",
            "Cache-Control": "max-age=0",
            "Connection": "Keep-Alive",
            //"Content-Length":"385",
            //"Cookie":cookieList[0],
            "Cookie": cookieList[0],
            "Host": "www.rmdown.com",
            "Origin": "http://www.rmdown.com",
            "Referer": "http://www.rmdown.com/link.php?hash=153ca0a2d55fcf7eb895277cd9878fb241ed7619fa7",
            "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)"
            //"X-Requested-With":"XMLHttpRequest"
            //"Proxy-Authorization":"Basic bmljb2xlMDE2OTo2NjYxNGYyMDg=",
            //"Proxy-Connection":"keep-alive",
            //"Upgrade-Insecure-Requests":"1"
        }
    }, function (res) {

        console.log(res.headers);

        var bufferHelper = new BufferHelper();
        // res.setEncoding("utf8");
        res.on("data", function (chunk) {
            bufferHelper.concat(chunk);
        });

        res.on("end", function () {
            target_data = bufferHelper.toBuffer();
            if (target_data) {
                save2File(target_data);
            }
        });
    });

    req.write(payLoad);
    req.end();

});

function getNow() {
    return moment().format('YYYYMMDDHHmmss');
}

function save2File(str) {
    fs.writeFile(getNow() + '.torrent', str, function (err) {
        if (err) throw err;
    });
}

function rand() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 16; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}