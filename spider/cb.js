/**
 * Created by minmiao on 16/3/27.
 *
 */
var foo = function (str, cb) {
    if (str == 'cat'){
        cb('Error!');
    }else{
        cb('',{'cat':2,'dog':3,'panda':4});
    }
};

var bar = function (err, data) {
    if (err) {
        console.log('err:' + err);
    } else {
        console.dir(data);
    }
};

var args = process.argv[2];
foo(args, bar);
