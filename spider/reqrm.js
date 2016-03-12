var request = require("request");
var util = require('util');

/*
var request = request.defaults({jar:true});
var jar = request.jar();
var cookie = request.cookie("__cfduid=d0167262a4ae8e0eb4f441135d9ac76401444573777");
jar.setCookie(cookie);
*/

var fs = require("fs");
var moment = require("moment");


var hex = rand();
console.log(hex);
var boundaryKey = "----WebKitFormBoundary" + hex;

var target_url = "http://www.rmdown.com/link.php?hash=153ca0a2d55fcf7eb895277cd9878fb241ed7619fa7";

var options = {
    url:"http://www.rmdown.com/download.php",
    method:"POST",
    formData:{
        ref:"153ca0a2d55fcf7eb895277cd9878fb241ed7619fa7",
        reff:"MTQ0NDk5OTc1Ng=="
    },
    // jar:jar,
    headers:{
        "Content-Type":"multipart/form-data; boundary=" + boundaryKey,
        "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        //"Accept-Encoding":"gzip, deflate",
        "Accept-Language":"zh-CN,zh;q=0.8",
        "Cache-Control":"max-age=0",
        "Connection":"Keep-Alive",
        "Cookie":"__cfduid=d0167262a4ae8e0eb4f441135d9ac76401444573777",
        "Host":"www.rmdown.com",
        "Origin":"http://www.rmdown.com",
        "Referer":"http://www.rmdown.com/link.php?hash=153ca0a2d55fcf7eb895277cd9878fb241ed7619fa7",
        "User-Agent":"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)",
        //"X-Requested-With":"XMLHttpRequest"
        "Upgrade-Insecure-Requests":"1"
    }
};

request.get(target_url,function(err,response,body){
    if (!err && response.statusCode == 200) {
        // Show the HTML for the Google homepage.
        console.log(response.headers);
        var cookiesRes = "";
        var cookies = response.headers["set-cookie"];
        cookies.forEach(function(cookie){
            cookiesRes += cookie.replace(/path=\//g,'');
        });
        var cookieList = cookiesRes.split(";");
        console.log(cookieList[0]);
        //options.headers = response.headers;
        request({
            url:"http://www.rmdown.com/download.php",
            method:"POST",
            formData:{
                ref:"153ca0a2d55fcf7eb895277cd9878fb241ed7619fa7",
                reff:"MTQ0NDk5OTc1Ng==",
                submit:"download"
            },
            headers:{
                "Content-Type":"multipart/form-data; boundary=" + boundaryKey,
                "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language":"zh-CN,zh;q=0.8",
                "Cache-Control":"max-age=0",
                "Connection":"Keep-Alive",
                "Cookie":cookieList[0],
                "Host":"www.rmdown.com",
                "Origin":"http://www.rmdown.com",
                "Referer":"http://www.rmdown.com/link.php?hash=153ca0a2d55fcf7eb895277cd9878fb241ed7619fa7",
                "User-Agent":"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)"
            }
        },function(err,response,body){
            if (!err && response.statusCode == 200){
                save2File(body,'.torrent');
            }
        });

    }else{
        console.log(err);
        console.log(response);
    }
});

function getNow(){
    return moment().format('YYYYMMDDHHmmss');
}

function save2File(str,postfix){
    fs.writeFile(getNow() + postfix,str,function(err){
        if (err) throw err;
    });
}

function rand() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 16; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}