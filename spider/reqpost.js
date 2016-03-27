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
var zlib = require("zlib");
var createpath = require('./createpath');
var savedir = '/usr/local/t';

// 基础变量设置
var target_data = "";
// var hash_url = "http://www.rmdown.com/link.php?hash=153ca0a2d55fcf7eb895277cd9878fb241ed7619fa7";
// var hash_url = process.argv[2];

function getRMtorrent(rmurl, savename, cb) {
    var hash_url = rmurl;
    var savename = savename;

    // 构造请求正式开始
    var req = http.get(hash_url, function (res) {
        // 获取Cookie
        var responseCookies = getResponseHeadersCookies(res.headers);
        // 获取body
        var hash_body = "";
        res.on("data", function (chunk) {
            hash_body += chunk;
        });
        res.on('end', function () {
            // 获取ref
            var ref = hash_url.split("=")[1];
            // 获取reff
            var reff = matchReff(hash_body);
            // 构造boundary
            var hex = rand();
            var boundaryKey = "----WebKitFormBoundary" + hex;
            var payLoad = "--" + boundaryKey + "\r\n"
                + "Content-Disposition: form-data; name='ref'" + "\r\n\r\n"
                + ref + "\r\n"
                + "--" + boundaryKey + "\r\n"
                + "Content-Disposition: form-data; name='reff'" + "\r\n\r\n"
                + reff + "\r\n"
                + "--" + boundaryKey + "\r\n"
                + "Content-Disposition: form-data; name='submit'" + "\r\n\r\n"
                + "download" + "\r\n"
                + "--" + boundaryKey + "--";
            //console.log(payLoad);
            //console.log(responseCookies);
            //console.log(ref);

            var req2 = http.request({
                host: "www.rmdown.com",
                path: "/download.php",
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data; boundary=" + boundaryKey,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    //"Accept-Encoding": "gzip, deflate",
                    //gzip编码目前没有办法正常解压缩
                    "Accept-Language": "zh-CN,zh;q=0.8",
                    "Cache-Control": "max-age=0",
                    "Connection": "Keep-Alive",
                    "Cookie": responseCookies,
                    "Host": "www.rmdown.com",
                    "Origin": "http://www.rmdown.com",
                    "Referer": hash_url,
                    "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)"
                }
            }, function (res2) {
                // var bufferHelper = new BufferHelper();
                // res.setEncoding("utf8");
                var chunks = [];
                res2.on("data", function (chunk) {
                    // bufferHelper.concat(chunk);
                    chunks.push(chunk);
                });
                res2.on("end", function () {
                    //target_data = bufferHelper.toBuffer();
                    target_data = Buffer.concat(chunks);
                    var encoding = res2.headers['content-encoding'];
                    // console.info('Header Encoding: ' + encoding);
                    if (target_data) {
                        if (encoding == "gzip") {
                            //解压gzip
                            zlib.gunzip(target_data, function (err, decoded) {
                                if (!err) {
                                    save2File(decoded.toString());
                                } else {
                                    console.log('Gunzip err: ' + err.message);
                                }
                            });
                        } else if (encoding == "deflate") {
                            //解压deflate
                            zlib.deflate(target_data, function (err, decoded) {
                                if (!err) {
                                    save2File(decoded.toString());
                                } else {
                                    console.log('Deflate err: ' + err.message);
                                }
                            });
                        } else {
                            //save2File(target_data);
                            save2FileByFilename(target_data, savename, function () {
                                cb(savename);
                            });
                        }
                    }
                });
            });

            req2.write(payLoad);
            req2.end();

        });
    }).on("error", function (e) {
        console.log("Got error: " + e.message);
    });
}

function getNow() {
    return moment().format('YYYYMMDDHHmmss_SSS');
}

function getDate() {
    return moment().format('YYYYMMDD');
}

function save2File(str) {
    fs.writeFile(getNow() + '.torrent', str, function (err) {
        if (err) throw err;
    });
}

function getSaveDir() {
    return savedir + '/' + getDate();
}

function save2FileByFilename(str, filename, cb) {
     createpath.dc(getSaveDir(), '0777', function (path) {
        fs.writeFile(path + '/' + getNow() + '.torrent', str, function (err) {
            if (err) throw err;
            cb();
        });
    });
}

function rand() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 16; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function getResponseHeadersCookies(headers) {
    var cookiesRes = "";
    var cookies = headers["set-cookie"];
    cookies.forEach(function (cookie) {
        cookiesRes += cookie.replace(/path=\//g, '');
    });
    var cookieList = cookiesRes.split(";");
    return cookieList[0];
}

function matchReff(html) {
    var reg = /<INPUT TYPE="hidden" NAME="reff" value="(.*?)">/g;
    var regRes = "";
    while (match = reg.exec(html)) {
        regRes = match[1];
    }
    return regRes;
}

exports.getRMtorrent = getRMtorrent;