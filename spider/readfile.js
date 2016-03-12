/**
 * Created by minmiao on 15/10/27.
 */

var fs = require("fs");

fs.readFile("20151025082534.txt",function(data){
    console.log(arguments);
    console.log(data);
});
