/**
 * Created by minmiao on 16/3/12.
 *
 * 尝试试用模块调用的方式组织之前的功能代码
 */
var onepage = require('./onepage');
var readfile = require('./readfile');
var checkredis = require('./redisio');
var getrm = require('./getrm');
var downtor = require('./reqpost');
var async = require('async');
var sendmail = require('./sendmail');

//初始化参数为t66y.com的页码号
var page_start = process.argv[2];
var page_end = process.argv[3];

//参数必填否则提示退出
if (!page_start || !page_end || (page_end < page_start) || (page_start <= 0)) {
    console.log('You must input the start page number and end page number.');
    process.exit();
}

onepage.setPageStart(page_start);
onepage.setPageEnd(page_end);
onepage.initTarget();
onepage.getTarget(function (filename) {
    console.log('Target save to the ' + filename + ' done!');
    //文件已经保存下一步准备处理文件
    readfile.readTargetFile(filename, function (tl) {
        console.log('Target file has loaded!');
        console.dir(tl);
        //文件已经读取下一步准备处理REDIS
        checkredis.redisIsExists(tl, function (newtl) {
            console.log('Filter Target Array: ');
            console.dir(newtl);
            //判断是否在REDIS有过存储返回没有存储的全部内容下一步准备获取下载地址
            if (newtl.length > 0) {
                getrm.getRMurlFromTarget(newtl, function (rmdownlist) {
                    console.log('RMdown lists: ');
                    console.dir(rmdownlist);
                    if (rmdownlist.length > 0) {
                        var mailattlist = [];
                        async.each(rmdownlist, function (item, callback) {
                            downtor.getRMtorrent(item.down, item.title, function (torinfo) {
                                console.log(torinfo.title + ' download completed!');
                                var mailatt = {'path': torinfo.savefile};
                                mailattlist.push(mailatt);
                                callback();
                            })
                        }, function (err) {
                            console.log('All torrent download completed!');
                            console.dir(mailattlist);
                            if (mailattlist.length > 0) {
                                //发送邮件
                                sendmail.sendmail(mailattlist, function () {
                                    console.log('All done!');
                                });
                            }
                        });
                    }
                })
            }
        });
    });
});
