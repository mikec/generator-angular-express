fs = require('fs');

global.mocks = {};

var fileNames = fs.readdirSync('./test/mock-files');
for(var i in fileNames) {
    var fn = fileNames[i];
    global.mocks[fn] = fs.readFileSync('./test/mock-files/' + fn);
}